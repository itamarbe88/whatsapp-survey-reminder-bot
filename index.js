import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";

const RESPONSE_WINDOW_HOURS = parseFloat(process.env.RESPONSE_WINDOW_HOURS || "24");

let sock;
// Key: pollMessageId, Value: { groupId, title, voters: Set<jid>, pollMsg }
const surveys = new Map();

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === "open") console.log("✅ מחובר לווצאפ");
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("החיבור נסגר. מתחבר מחדש:", shouldReconnect);
      if (shouldReconnect) connectToWhatsApp();
    }
  });

  sock.ev.on("messages.upsert", ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message) continue;
      const groupId = msg.key.remoteJid;
      if (!groupId?.endsWith("@g.us")) continue;

      // You created a poll — start tracking it
      if (msg.key.fromMe && msg.message.pollCreationMessageV3) {
        const pollId = msg.key.id;
        const title = msg.message.pollCreationMessageV3.name;
        console.log(`🗳️ זוהה סקר: "${title}" בקבוצה ${groupId}`);
        startResponseWindow(pollId, groupId, title, msg);
        continue;
      }

      // Someone voted or cancelled
      if (msg.message.pollUpdateMessage) {
        const pollId = msg.message.pollUpdateMessage.pollCreationMessageKey?.id;
        const survey = surveys.get(pollId);
        if (!survey) continue;

        const voter = msg.key.participant;
        if (!voter) continue;

        // AES-GCM cancellation = exactly 16 bytes (auth tag only, no content)
        const encPayload = msg.message.pollUpdateMessage.vote?.encPayload;
        const payloadBytes = encPayload
          ? (typeof encPayload === 'string'
              ? Buffer.from(encPayload, 'base64').length
              : encPayload.length)
          : 0;
        const cancelled = payloadBytes <= 16;

        if (cancelled) {
          survey.voters.delete(voter);
          console.log(`↩️ ביטול הצבעה מ-${voter} בסקר "${survey.title}"`);
        } else {
          survey.voters.add(voter);
          console.log(`✅ הצבעה מ-${voter} בסקר "${survey.title}"`);
        }
      }
    }
  });
}

function startResponseWindow(pollId, groupId, title, pollMsg) {
  if (surveys.has(pollId)) return;

  const survey = { groupId, title, voters: new Set(), pollMsg };
  surveys.set(pollId, survey);

  const minutes = Math.round(RESPONSE_WINDOW_HOURS * 60);
  console.log(`⏳ אוסף הצבעות למשך ${minutes} דקות...`);
  setTimeout(() => sendSummary(pollId), RESPONSE_WINDOW_HOURS * 60 * 60 * 1000);
}

async function sendSummary(pollId) {
  const survey = surveys.get(pollId);
  if (!survey) return;
  surveys.delete(pollId);

  if (!sock) return;
  const { groupId, title, voters, pollMsg } = survey;

  try {
    const metadata = await sock.groupMetadata(groupId);
    const myId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
    const participants = metadata.participants
      .map((p) => p.id)
      .filter((id) => id !== myId);

    const nonVoters = participants.filter((p) => !voters.has(p));

    if (nonVoters.length === 0) {
      await sock.sendMessage(groupId, {
        text: `✅ כולם הצביעו בסקר "${title}"!`,
      }, { quoted: pollMsg });
    } else {
      const names = nonVoters.map((j) => `@${j.split("@")[0]}`).join(", ");
      await sock.sendMessage(groupId, {
        text: `⏰ עדיין לא הצביעו בסקר "${title}": ${names}`,
        mentions: nonVoters,
      }, { quoted: pollMsg });
    }

    console.log(`📊 סיכום נשלח. הצביעו: ${voters.size}, חסרים: ${nonVoters.length}`);
  } catch (err) {
    console.error("שגיאה בשליחת הסיכום:", err.message);
  }
}

console.log("🚀 הבוט פועל. צור סקר בכל קבוצה כדי להתחיל.");
connectToWhatsApp();