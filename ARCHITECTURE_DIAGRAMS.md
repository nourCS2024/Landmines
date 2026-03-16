# ALMASAR Quick Message Feature - Architecture & Flow Diagrams

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         FRONTEND (HTML / CSS / JavaScript)                │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Quick Message Box (Section Before Footer)          │  │  │
│  │  │                                                      │  │  │
│  │  │ 🔴 Red Gradient Background                         │  │  │
│  │  │ ⬜ White Container (padding: 40px)                │  │  │
│  │  │                                                      │  │  │
│  │  │ Title: "Quick Message"                             │  │  │
│  │  │ Textarea: 3 rows, placeholder text                │  │  │
│  │  │ Button: "Send Message" (primary-red)              │  │  │
│  │  │                                                      │  │  │
│  │  │ Success Alert: ✓ Message sent successfully!       │  │  │
│  │  │ Error Alert: ✗ Failed to send message             │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                           │                                │  │
│  │                    [Form Submission]                       │  │
│  │                           │                                │  │
│  │         ┌─────────────────┼─────────────────┐             │  │
│  │         │                 │                 │             │  │
│  │    Validation       Fetch API         Show Alert          │  │
│  │    (Check empty)    (POST request)    (Success/Error)    │  │
│  │         │                 │                 │             │  │
│  │         └─────────────────┼─────────────────┘             │  │
│  │                           │                                │  │
│  └───────────────────────────┼────────────────────────────────┘  │
│                              │                                     │
│                       HTTP POST REQUEST                           │
│                    /api/send-quick-message                       │
│                      (JSON with message)                         │
│                              │                                     │
└──────────────────────────────┼─────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (Node.js)                     │
├─────────────────────────────────────────────────────────────────┤
│  PORT: 3000 (Configurable)                                       │
│                                                                   │
│  ┌──────────────┐                                               │
│  │ Express.js   │                                               │
│  │ Server       │─────┐                                         │
│  └──────────────┘     │                                         │
│                       │                                         │
│      ┌────────────────┴────────────────┐                        │
│      │                                 │                        │
│      ▼                                 ▼                        │
│  ┌──────────────┐          ┌──────────────────┐               │
│  │ Validation   │          │  Database        │               │
│  │              │          │  (SQLite)        │               │
│  │ • Not empty  │          │                  │               │
│  │ • <1000 char │          │ messages.db      │               │
│  │              │          │                  │               │
│  └──────────────┘          │ ┌──────────────┐ │               │
│      │                      │ │ id           │ │               │
│      │                      │ │ message      │ │               │
│      │ Valid ✓              │ │ timestamp    │ │               │
│      │                      │ │ email_sent   │ │               │
│      ▼                      │ │ created_at   │ │               │
│  ┌──────────────┐          │ └──────────────┘ │               │
│  │ Save to DB   │          │                  │               │
│  │              │          │  Status: ✓      │               │
│  │ INSERT msg   │          └──────────────────┘               │
│  └──────────────┘                   ▲                         │
│      │                              │                         │
│      │ Message Saved               │                         │
│      └──────────────────────────────┘                         │
│                                                                │
│      ┌─────────────────────────────────┐                      │
│      │   Send Email Notification       │                      │
│      │   (Nodemailer)                  │                      │
│      │                                 │                      │
│      │ To: ADMIN_EMAIL                 │                      │
│      │     (from .env)                 │                      │
│      │                                 │                      │
│      │ Subject: 🚨 New Quick Message   │                      │
│      │                                 │                      │
│      │ Body:                           │                      │
│      │ ┌─────────────────────────────┐ │                      │
│      │ │ New Quick Message Received  │ │                      │
│      │ │                             │ │                      │
│      │ │ Message:                    │ │                      │
│      │ │ [User's message text]       │ │                      │
│      │ │                             │ │                      │
│      │ │ Received: [timestamp]       │ │                      │
│      │ └─────────────────────────────┘ │                      │
│      │                                 │                      │
│      └─────────────────────────────────┘                      │
│      │                                                        │
│      ├─ Email Service ──────┐                               │
│      │                      │                               │
│      │                      ▼                               │
│      │            ┌──────────────────┐                      │
│      │            │ Gmail / SendGrid │                      │
│      │            │ (Configurable)   │                      │
│      │            │                  │                      │
│      │            │ SMTP Service     │                      │
│      │            └──────────────────┘                      │
│      │                                                       │
│      └── Update DB: email_sent = 1                          │
│                                                              │
│  ┌──────────────────────────────────────┐                   │
│  │ Return JSON Response to Client       │                   │
│  │                                      │                   │
│  │ {                                    │                   │
│  │   "success": true,                   │                   │
│  │   "message": "Message processed",    │                   │
│  │   "email_sent": true                 │                   │
│  │ }                                    │                   │
│  └──────────────────────────────────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────────┘
                               │
                       HTTP RESPONSE (JSON)
                               │
                               ▼
                          CLIENT BROWSER
                               │
                         ┌──────┴──────┐
                         │             │
                    SUCCESS        ERROR
                         │             │
                    Show ✓          Show ✗
                    Reset           No Reset
```

---

## 📊 Message Lifecycle

```
┌──────────────────────────────────────────────────────────────────┐
│                    MESSAGE LIFECYCLE                              │
└──────────────────────────────────────────────────────────────────┘

  1. USER ACTION
     ├─ Types message in textarea
     ├─ Clicks "Send Message" button
     └─ JavaScript captures event

                          │
                          ▼

  2. FRONTEND VALIDATION
     ├─ Check: Message not empty
     └─ Valid? → Continue : Show Error

                          │
                          ▼

  3. SEND TO BACKEND
     ├─ Endpoint: /api/send-quick-message
     ├─ Method: POST
     ├─ Headers: Content-Type: application/json
     └─ Body: {message: "...", timestamp: "..."}

                          │
                          ▼

  4. BACKEND VALIDATION
     ├─ Check: Message not empty
     ├─ Check: Message < 1000 characters
     └─ Valid? → Continue : Return Error

                          │
                          ▼

  5. DATABASE SAVE
     ├─ INSERT into messages table
     ├─ id: AUTO_INCREMENT
     ├─ message: User's message
     ├─ timestamp: Client timestamp
     ├─ email_sent: 0 (pending)
     └─ created_at: Server time

                          │
                          ▼

  6. SEND EMAIL
     ├─ To: ADMIN_EMAIL (from .env)
     ├─ Subject: 🚨 New Quick Message from ALMASAR
     ├─ Body: HTML email with message content
     └─ Via: Nodemailer (Gmail/SendGrid/etc)

                          │
                          ▼

  7. UPDATE DATABASE
     ├─ Email sent? → Update email_sent = 1
     └─ Email failed? → Keep email_sent = 0

                          │
                          ▼

  8. RETURN RESPONSE
     ├─ Success: {success: true, email_sent: true}
     └─ Error: {success: false, message: "..."}

                          │
                          ▼

  9. FRONTEND NOTIFICATION
     ├─ Success? → Show "✓ Message sent!"
     └─ Error? → Show "✗ Failed to send"

                          │
                          ▼

  10. USER FEEDBACK
      ├─ Message persists for 4 seconds
      ├─ Auto-hide alert
      ├─ Form resets (on success)
      └─ User can send another message
```

---

## 🔄 API Call Sequence

```
CLIENT                              SERVER                       DATABASE
  │                                   │                             │
  │─── POST /api/send-quick-message ──>                           │
  │  {message, timestamp}              │                           │
  │                                    ├─ Validate input           │
  │                                    │                           │
  │                                    ├─ Save to DB              │
  │                                    ├─────────────────────────>│
  │                                    │   INSERT message          │
  │                                    │<─────────────────────────┤
  │                                    │   return id=1             │
  │                                    │                           │
  │                                    ├─ Send Email ─────────────>│
  │                                    │  (to Gmail/SendGrid)      │
  │                                    │                           │
  │                                    ├─ Update DB               │
  │                                    ├─────────────────────────>│
  │                                    │   UPDATE email_sent=1     │
  │                                    │<─────────────────────────┤
  │                                    │   OK                      │
  │                                    │                           │
  │<── {success:true, email_sent:true}─┤                           │
  │                                    │                           │
  ├─ Show "✓ Message sent!"           │                           │
  ├─ Auto-hide alert in 4s            │                           │
  └─ Form reset                        │                           │
```

---

## 📁 File Structure

```
landmines-website/
│
├── Frontend Files
│   ├── index.html              (Modified - Quick message section)
│   ├── homepage.css            (Modified - Quick message styling)
│   ├── homepage.js             (Modified - Form handler)
│   └── package.json            (Modified - Scripts & dependencies)
│
├── Backend Files
│   ├── server.js               (New - Node.js Express server)
│   └── messages.db             (Auto-created - SQLite database)
│
├── Configuration
│   ├── .env.example            (New - Environment template)
│   └── .env                    (You create - Actual config)
│
├── Documentation
│   ├── README.md               (Project overview)
│   ├── SETUP_GUIDE.md          (Detailed setup)
│   ├── QUICK_REFERENCE.md      (Quick commands)
│   ├── IMPLEMENTATION_SUMMARY.md (This summary)
│   └── test-api.sh             (Testing script)
│
└── Dependencies
    └── node_modules/           (Auto-created after npm install)
        ├── express/
        ├── nodemailer/
        ├── sqlite3/
        ├── cors/
        ├── dotenv/
        └── ... (others)
```

---

## 🔌 Database Schema

```
messages (Table)
┌─────────────────────────────────────────┐
│                                         │
│ Column Name    │ Type     │ Constraints │
│────────────────┼──────────┼──────────────│
│ id             │ INTEGER  │ PRIMARY KEY │
│                │          │ AUTOINCREMENT
│                │          │             │
│ message        │ TEXT     │ NOT NULL    │
│                │          │             │
│ timestamp      │ TEXT     │ NOT NULL    │
│                │          │             │
│ email_sent     │ BOOLEAN  │ DEFAULT 0   │
│                │          │             │
│ created_at     │ DATETIME │ DEFAULT     │
│                │          │ CURRENT_TS  │
│                                         │
└─────────────────────────────────────────┘

Example Row:
┌────┬──────────────────────┬─────────────────────┬────────────┬─────────────────────┐
│ id │ message              │ timestamp           │ email_sent │ created_at          │
├────┼──────────────────────┼─────────────────────┼────────────┼─────────────────────┤
│ 1  │ "Test quick message" │ "2026-03-16T10:30"  │ 1          │ "2026-03-16 10:30"  │
│ 2  │ "Another message"    │ "2026-03-16T10:35"  │ 1          │ "2026-03-16 10:35"  │
│ 3  │ "Urgent update"      │ "2026-03-16T10:40"  │ 0          │ "2026-03-16 10:40"  │
└────┴──────────────────────┴─────────────────────┴────────────┴─────────────────────┘
```

---

## 🛠️ Configuration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Create .env file from .env.example                       │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
   ┌──────────────────┐
   │ .env file        │
   │                  │
   │ PORT=3000        │
   │ EMAIL_SERVICE=   │
   │ EMAIL_USER=      │
   │ EMAIL_PASSWORD=  │
   │ ADMIN_EMAIL=     │
   │ ADMIN_TOKEN=     │
   └──────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Load via dotenv in server.js                             │
│    require('dotenv').config()                               │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
   ┌──────────────────┐
   │ process.env      │
   │ variables        │
   └──────────────────┘
          │
    ┌─────┼─────┐
    │     │     │
    ▼     ▼     ▼
  PORT  EMAIL  ADMIN_EMAIL
  3000  Config  addr@example.com
```

---

## ✨ User Experience Flow

```
DESKTOP VIEW
┌─────────────────────────────────────────────────────────────┐
│ ALMASAR Website                                              │
├─────────────────────────────────────────────────────────────┤
│ [Navigation]                                                 │
│ [Hero Section]                                               │
│ [Threat Cards]                                               │
│ [Mission Section]                                            │
│ [Partners Grid]                                              │
│ [Contact Form]                                               │
│ ╔═════════════════════════════════════════════════════╗     │
│ ║ 🔴 QUICK MESSAGE                                    ║     │
│ ║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃     │
│ ║                                                      ║     │
│ ║ Have an urgent update? Send us a quick message.    ║     │
│ ║                                                      ║     │
│ ║ ┌────────────────────────────────────────────────┐ ║     │
│ ║ │ Your message here...                           │ ║     │
│ ║ │                                                │ ║     │
│ ║ │                                                │ ║     │
│ ║ └────────────────────────────────────────────────┘ ║     │
│ ║                                                      ║     │
│ ║ [Send Message] Button (Red)                        ║     │
│ ║                                                      ║     │
│ ║ ✓ Message sent successfully! (Alert)               ║     │
│ ║                                                      ║     │
│ ╚═════════════════════════════════════════════════════╝     │
│ [Footer]                                                     │
└─────────────────────────────────────────────────────────────┘

MOBILE VIEW
┌──────────────────┐
│ ALMASAR Website  │
├──────────────────┤
│ [Navigation]     │
│ [Hero]           │
│ [Threat]         │
│ [Mission]        │
│ [Partners]       │
│ [Contact]        │
│ ╔════════════════╗
│ ║🔴 QUICK MSG    ║
│ ║────────────────║
│ ║ Have an urgent ║
│ ║ update?        │
│ ║                ║
│ ║┌──────────────┐║
│ ││ Message...  ││
│ ││              ││
│ ││              ││
│ │└──────────────┘│
│ ║                ║
│ ║[Send Message]  ║
│ ║                ║
│ ╚════════════════╝
│ [Footer]         │
└──────────────────┘
```

---

## 📈 Scaling Considerations

```
CURRENT (Small Scale)
├─ Single server instance
├─ SQLite local database
├─ Direct SMTP (Gmail)
└─ ~100-1000 messages/day capacity

FUTURE (Medium Scale)
├─ Multiple server instances (load balanced)
├─ PostgreSQL/MySQL (cloud database)
├─ Email service API (SendGrid/AWS SES)
└─ ~100,000+ messages/day capacity

ENTERPRISE (Large Scale)
├─ Kubernetes/Docker deployment
├─ Message queue (Redis/RabbitMQ)
├─ Data warehouse (Snowflake/BigQuery)
├─ Advanced analytics
└─ ~1,000,000+ messages/day capacity
```

---

## 🎓 Component Relationships

```
┌─────────────────────────────────────────────────┐
│           QUICK MESSAGE FEATURE                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  FRONTEND                 BACKEND               │
│  ┌──────────────┐        ┌──────────────┐      │
│  │ HTML Form    │───────>│ Express API  │      │
│  └──────────────┘        └──────────────┘      │
│        │                        │               │
│        │                        │               │
│   CSS Styles              JSON Response        │
│   JavaScript                   │               │
│   Validation                   │               │
│        │                       │               │
│        │            ┌──────────┴──────────┐    │
│        │            │                     │    │
│        │            ▼                     ▼    │
│        │     ┌────────────┐        ┌──────────┐│
│        │     │ Nodemailer │        │  SQLite  ││
│        │     │  (Email)   │        │(Database)││
│        │     └────────────┘        └──────────┘│
│        │            │                     │    │
│        └────────────┼─────────────────────┘    │
│                     │                          │
│              JSON Response                     │
│                     │                          │
│                     ▼                          │
│            User Gets Feedback                  │
│            (Success or Error)                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

**Diagrams Version**: 1.0
**Last Updated**: March 16, 2026
**For**: ALMASAR Quick Message Feature
