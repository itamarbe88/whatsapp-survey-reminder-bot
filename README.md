
# בוט תזכורת לסקרי וואטסאפ

בוט Node.js שמתחבר לחשבון וואטסאפ שלך, עוקב אחרי סקרים בכל קבוצה שהחשבון חבר בה, ושולח תזכורת אוטומטית למי שלא הצביע בתום חלון הזמן.

> בנוי עם [Baileys](https://github.com/WhiskeySockets/Baileys) — מתחבר כמכשיר מקושר לוואטסאפ, ללא צורך בדפדפן או טלפון לאחר ההגדרה הראשונית.

---

## איך זה עובד

1. אתה יוצר סקר (Poll) בכל קבוצה שחשבון הבוט חבר בה
2. הבוט מזהה את הסקר מיידית ומתחיל את חלון הזמן (ברירת מחדל: 24 שעות)
3. בסיום החלון, הבוט מגיב ישירות לסקר ומתייג את כל מי שלא הצביע
4. מי שהצביע וביטל את הצבעתו נחשב כמי שלא הצביע
5. תומך במספר קבוצות ומספר סקרים בו-זמנית

---

## דרישות

- [Node.js](https://nodejs.org/) גרסה 20.6 ומעלה
---

## התקנה

```bash
git clone https://github.com/itamarbe88/whatsapp-survey-reminder-bot.git
cd whatsapp-survey-reminder-bot
npm install
```

---

## הגדרות

העתק את `.env.example` לקובץ `.env`:

```bash
# Mac / Linux
cp .env.example .env

# Windows
copy .env.example .env
```

ערוך את `.env`:

```
RESPONSE_WINDOW_HOURS=24
```

| משתנה | תיאור | ברירת מחדל |
|---|---|---|
| `RESPONSE_WINDOW_HOURS` | כמה שעות להמתין לפני שליחת התזכורת | `24` |

---

## הפעלה

**Mac / Linux:**
```bash
npm start
```

**Windows:**
```bash
npm run start:win
```

> הפקודה `start:win` מגדירה את הטרמינל ל-UTF-8 כדי שתווים בעברית יוצגו בצורה תקינה.

בהפעלה ראשונה יופיע ברקוד בטרמינל. סרוק אותו דרך הוואטסאפ שלך:

**וואטסאפ ← הגדרות ← מכשירים מקושרים ← קישור מכשיר**

הסשן נשמר בתיקיית `auth_info/` — לא תצטרך לסרוק שוב, אלא אם תמחק את התיקייה או תנתק את המכשיר ממסך המכשירים המקושרים.

---

## שימוש

לאחר שהבוט פועל ומחובר:

1. הוסף את מספר הבוט לכל קבוצה
2. צור סקר בקבוצה (לחץ על `+` ← סקר)
3. הבוט מזהה את הסקר אוטומטית — אין צורך בפקודות או מילות מפתח
4. לאחר חלון הזמן, הבוט מגיב לסקר ומתייג את כל מי שלא הצביע

---

## סריקה מחדש של הברקוד

```bash
# Mac / Linux
rm -rf auth_info && npm start

# Windows
Remove-Item -Recurse -Force auth_info; npm start
```

---

## הרצה 24/7 על שרת

כדי שהבוט יפעל ללא הפסקה מבלי להשאיר את המחשב דלוק:

1. שכור שרת זול או חינמי ($5 בחודש ב-[Hetzner](https://www.hetzner.com) או [DigitalOcean](https://www.digitalocean.com)), או פרוס ב-[Railway](https://railway.app) / [Render](https://render.com)
2. שכפל את הריפו והתקן את התלויות על השרת
3. הפעל `npm start` פעם אחת דרך SSH לסריקת הברקוד
4. השתמש ב-pm2 לשמור על הרצה תמידית:

```bash
npm install -g pm2
pm2 start "npm start" --name whatsapp-survey
pm2 save
pm2 startup   # הפעלה אוטומטית לאחר ריסטרט לשרת
```

# WhatsApp Poll Reminder Bot

A Node.js bot that connects to your WhatsApp account, watches any group you're in for polls, and automatically reminds non-voters after a configurable time window.

> Built with [Baileys](https://github.com/WhiskeySockets/Baileys) — connects as a linked WhatsApp device, no browser or phone needed after first setup.

---

## How it works

1. You create a native WhatsApp poll in any group the bot's account is a member of
2. The bot detects it instantly and starts a response window (default: 24 hours)
3. When the window closes, the bot replies directly to the poll — tagging everyone who hasn't voted
4. Votes that were cast and then cancelled count as non-votes
5. Works across multiple groups and multiple simultaneous polls

---

## Requirements

- [Node.js](https://nodejs.org/) v20.6 or higher
---

## Installation

```bash
git clone https://github.com/itamarbe88/whatsapp-survey-reminder-bot.git
cd whatsapp-survey-reminder-bot
npm install
```

---

## Configuration

Copy `.env.example` to `.env`:

```bash
# Mac / Linux
cp .env.example .env

# Windows
copy .env.example .env
```

Edit `.env`:

```
RESPONSE_WINDOW_HOURS=24
```

| Variable | Description | Default |
|---|---|---|
| `RESPONSE_WINDOW_HOURS` | Hours to wait before sending the reminder | `24` |

---

## Running

**Mac / Linux:**
```bash
npm start
```

**Windows:**
```bash
npm run start:win
```

> `start:win` sets the terminal to UTF-8 so Hebrew characters display correctly.

On first run, a QR code appears in the terminal. Scan it with WhatsApp:

**WhatsApp → Settings → Linked Devices → Link a Device**

The session is saved in `auth_info/`. You won't need to scan again unless you delete that folder or log out from WhatsApp's linked devices screen.

---

## Usage

Once the bot is running and connected:

1. Add the bot's WhatsApp number to any group
2. Create a poll in the group (tap `+` → Poll)
3. The bot detects it automatically — no commands or keywords needed
4. After the configured window, the bot replies to the poll mentioning everyone who hasn't voted yet

---

## Re-scanning the QR code

```bash
# Mac / Linux
rm -rf auth_info && npm start

# Windows
Remove-Item -Recurse -Force auth_info; npm start
```

---

## Running 24/7 on a server

To keep the bot always on without leaving your computer running:

1. Get a free tier or cheap VPS ($5/month on [Hetzner](https://www.hetzner.com) or [DigitalOcean](https://www.digitalocean.com)) or deploy to [Railway](https://railway.app) / [Render](https://render.com)
2. Clone the repo and install dependencies on the server
3. Run `npm start` once over SSH to scan the QR code
4. Use pm2 to keep it alive:

```bash
npm install -g pm2
pm2 start "npm start" --name whatsapp-survey
pm2 save
pm2 startup   # auto-restart on server reboot
```
