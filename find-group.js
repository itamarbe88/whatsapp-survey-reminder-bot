import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"],
    protocolTimeout: 120000,
  },
});

client.on("qr", (qr) => {
  console.log("\nScan this QR code with WhatsApp (Linked Devices):\n");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Connected!");
  console.log("\n👉 Now send ANY message to your pizza group from your phone.");
  console.log("   The group ID will appear here automatically.\n");
});

client.on("message_create", (msg) => {
  const id = msg.from?.endsWith("@g.us") ? msg.from : msg.to;
  if (id?.endsWith("@g.us")) {
    console.log(`\n✅ Group ID found:`);
    console.log(`   ${id}`);
    console.log(`\nSet GROUP_ID=${id} in your .env file, then press Ctrl+C`);
  }
});

client.on("auth_failure", (msg) => console.error("Auth failed:", msg));

console.log("Starting...");
client.initialize();
