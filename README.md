# WhatsApp Poll Reminder Bot

A Node.js bot that watches your WhatsApp groups for polls and automatically reminds non-voters after a configurable time window.

---

## How it works

1. You create a native WhatsApp poll in any group
2. The bot detects it and starts a response window (default: 24 hours)
3. When the window closes, the bot replies to the poll tagging everyone who hasn't voted yet
4. If someone votes and then cancels, they are included in the reminder

---

## Requirements

- [Node.js](https://nodejs.org/) v20.6 or higher
- A WhatsApp account (dedicated number recommended for shared use)

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-survey.git
cd whatsapp-survey
npm install
```

---

## Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```
RESPONSE_WINDOW_HOURS=24
```

| Variable | Description | Default |
|---|---|---|
| `RESPONSE_WINDOW_HOURS` | How long to wait before sending the reminder | `24` |

---

## Running

**Mac / Linux:**
```bash
npm start
```

**Windows (Hebrew / non-ASCII characters):**
```bash
npm run start:win
```

On first run, a QR code will appear in the terminal. Scan it with WhatsApp on your phone:  
**WhatsApp → Settings → Linked Devices → Link a Device**

The session is saved in `auth_info/`. You won't need to scan again unless you delete that folder.

---

## Usage

1. Start the bot and keep it running
2. Open any WhatsApp group the bot's account is a member of
3. Create a poll (tap `+` → Poll)
4. The bot detects it automatically — no commands needed
5. After the configured window, the bot replies to the poll mentioning everyone who hasn't voted

The bot supports multiple groups and multiple simultaneous polls.

---

## Re-scanning the QR code

Delete the session folder and restart:

```bash
# Mac / Linux
rm -rf auth_info

# Windows
Remove-Item -Recurse -Force auth_info
```

Then run `npm start` again.

---

## Deployment (always-on server)

To run the bot 24/7 without keeping your computer on, deploy to a cloud server:

1. Push this repo to GitHub
2. Create a server (e.g. [Railway](https://railway.app), [Render](https://render.com), or a $5 VPS)
3. SSH in and run `npm start` once to scan the QR code
4. Use a process manager to keep it running:

```bash
npm install -g pm2
pm2 start "npm start" --name whatsapp-survey
pm2 save
```

---

---

# בוט תזכורת לסקרי וואטסאפ

בוט Node.js שמזהה סקרים בקבוצות וואטסאפ ושולח תזכורת לכל מי שלא הצביע בתום חלון הזמן שהגדרת.

---

## איך זה עובד

1. אתה יוצר סקר (Poll) בכל קבוצת וואטסאפ
2. הבוט מזהה את הסקר ומתחיל למנות את חלון הזמן (ברירת מחדל: 24 שעות)
3. בסיום החלון, הבוט מגיב לסקר ומתייג את כל מי שטרם הצביע
4. אם מישהו הצביע וביטל את הצבעתו — הוא יכלל בתזכורת

---

## דרישות

- [Node.js](https://nodejs.org/) גרסה 20.6 ומעלה
- חשבון וואטסאפ (מומלץ מספר ייעודי לשימוש משותף)

---

## התקנה

```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-survey.git
cd whatsapp-survey
npm install
```

---

## הגדרות

העתק את `.env.example` לקובץ `.env`:

```bash
cp .env.example .env
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

**Windows (תמיכה בעברית):**
```bash
npm run start:win
```

בהפעלה ראשונה יופיע ברקוד בטרמינל. סרוק אותו דרך הוואטסאפ שלך:  
**וואטסאפ ← הגדרות ← מכשירים מקושרים ← קישור מכשיר**

הסשן נשמר בתיקיית `auth_info/` — לא תצטרך לסרוק שוב אלא אם תמחק אותה.

---

## שימוש

1. הפעל את הבוט והשאר אותו פועל
2. פתח קבוצת וואטסאפ שחשבון הבוט חבר בה
3. צור סקר (לחץ על `+` ← סקר)
4. הבוט מזהה את הסקר אוטומטית — אין צורך בפקודות
5. לאחר חלון הזמן, הבוט מגיב לסקר ומתייג את כל מי שלא הצביע

הבוט תומך במספר קבוצות ומספר סקרים בו-זמנית.

---

## סריקה מחדש של הברקוד

מחק את תיקיית הסשן והפעל מחדש:

```bash
# Mac / Linux
rm -rf auth_info

# Windows
Remove-Item -Recurse -Force auth_info
```

---

## פריסה לשרת (תמידי)

להרצת הבוט 24/7 ללא תלות במחשב שלך:

1. העלה את הפרויקט ל-GitHub
2. צור שרת (למשל [Railway](https://railway.app), [Render](https://render.com), או VPS ב-5$)
3. התחבר דרך SSH והפעל `npm start` פעם אחת לסריקת הברקוד
4. השתמש ב-pm2 להרצה תמידית:

```bash
npm install -g pm2
pm2 start "npm start" --name whatsapp-survey
pm2 save
```