# Quick Message Feature - Setup & Implementation Guide

## 📦 Installation

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- **express** - Web server framework
- **nodemailer** - Email sending service
- **sqlite3** - Lightweight database
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** (dev) - Auto-reload server during development
- **concurrently** (dev) - Run multiple processes at once

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your configuration:

```env
PORT=3000
NODE_ENV=development

# Gmail Setup (Recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

ADMIN_EMAIL=info@almasar-project.org
ADMIN_TOKEN=your-secret-token

DATABASE_PATH=./messages.db
```

#### Getting Gmail App Password

If using Gmail:
1. Enable 2-Factor Authentication on your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Use this password in `.env` as `EMAIL_PASSWORD`

#### Using Other Email Services

**SendGrid:**
```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxx
```

**Outlook:**
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
# Run frontend only
npm run dev
# Visit: http://localhost:8000

# Run backend only
npm run server:dev
# Backend runs on: http://localhost:3000

# Run both together
npm run dev:full
```

### Production Mode

```bash
npm run server
```

## 📋 Frontend Files Modified

### 1. `index.html` - Added Quick Message Section

```html
<!-- QUICK MESSAGE BOX -->
<section class="quick-message-box" id="message-box">
    <div class="message-container reveal">
        <h3>Quick Message</h3>
        <p>Have an urgent update? Send us a quick message.</p>
        <form id="quick-message-form" class="quick-form">
            <textarea 
                id="quick-message-text" 
                name="message" 
                placeholder="Your message here..." 
                rows="3"
                required>
            </textarea>
            <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
        <div id="quick-message-success" class="alert alert-success" style="display: none; margin-top: 15px;">
            <p>✓ Message sent successfully!</p>
        </div>
        <div id="quick-message-error" class="alert alert-error" style="display: none; margin-top: 15px;">
            <p>✗ Failed to send message. Please try again.</p>
        </div>
    </div>
</section>
```

**Placement**: Before the footer section
**Design**: Uses existing ALMASAR color palette (red background, white container)

### 2. `homepage.css` - Added Quick Message Styling

```css
.quick-message-box {
    padding: 80px 10%;
    background: linear-gradient(135deg, var(--primary-red) 0%, #d42844 100%);
    text-align: center;
}

.message-container {
    max-width: 500px;
    margin: 0 auto;
    background: var(--white);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.quick-form textarea {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.quick-form textarea:focus {
    outline: none;
    border-color: var(--primary-red);
    background-color: var(--white);
    box-shadow: 0 0 0 3px rgba(236, 51, 83, 0.1);
}

.quick-form .btn {
    width: 100%;
    margin-top: 15px;
}
```

**Design System Compliance**:
- ✅ Uses `--primary-red` (#ec3353)
- ✅ Uses `--white` background
- ✅ Uses `--font-title` and `--font-body`
- ✅ Matches button and form styling
- ✅ Responsive design

### 3. `homepage.js` - Added Message Submission Handler

```javascript
// 4. Quick Message Form Handler
const quickMessageForm = document.getElementById('quick-message-form');
const quickMessageSuccess = document.getElementById('quick-message-success');
const quickMessageError = document.getElementById('quick-message-error');

if (quickMessageForm) {
    quickMessageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const messageText = document.getElementById('quick-message-text').value.trim();

        try {
            const response = await fetch('/api/send-quick-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    timestamp: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (data.success) {
                quickMessageSuccess.style.display = 'block';
                quickMessageForm.reset();
                setTimeout(() => {
                    quickMessageSuccess.style.display = 'none';
                }, 4000);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            quickMessageError.style.display = 'block';
            setTimeout(() => {
                quickMessageError.style.display = 'none';
            }, 4000);
        }
    });
}
```

## 🖥️ Backend Architecture

### Server File: `server.js`

#### Key Components:

1. **Express Server**
   - Runs on configurable PORT (default: 3000)
   - Serves static files
   - CORS enabled for cross-origin requests

2. **SQLite Database**
   - Auto-creates `messages.db`
   - Table: `messages` with columns:
     - `id` - Auto-increment primary key
     - `message` - User message text
     - `timestamp` - When message was sent
     - `email_sent` - Boolean (0 or 1)
     - `created_at` - Server timestamp

3. **Nodemailer Email Service**
   - Configured via environment variables
   - Supports Gmail, SendGrid, Outlook, etc.
   - HTML email templates

### API Endpoints

#### 1. POST `/api/send-quick-message`

**Request**:
```json
{
    "message": "User's message text",
    "timestamp": "2026-03-16T10:30:00.000Z"
}
```

**Process**:
1. Validates message (not empty, max 1000 chars)
2. Saves to SQLite database
3. Sends email notification to admin
4. Updates database with email status

**Response (Success)**:
```json
{
    "success": true,
    "message": "Message received and processed",
    "email_sent": true
}
```

**Response (Error)**:
```json
{
    "success": false,
    "message": "Error description"
}
```

#### 2. POST `/api/send-email`

Handles contact form submissions (full form with name, email, subject, message)

#### 3. GET `/api/messages?token=YOUR_ADMIN_TOKEN`

Retrieve all messages from database (Admin only)

**Response**:
```json
{
    "success": true,
    "messages": [
        {
            "id": 1,
            "message": "Quick message text",
            "timestamp": "2026-03-16T10:30:00.000Z",
            "email_sent": 1,
            "created_at": "2026-03-16 10:30:00"
        }
    ]
}
```

#### 4. GET `/api/messages/stats?token=YOUR_ADMIN_TOKEN`

Get message statistics

**Response**:
```json
{
    "success": true,
    "stats": {
        "total_messages": 25,
        "emails_sent": 24,
        "last_message_time": "2026-03-16 15:45:30"
    }
}
```

#### 5. GET `/api/health`

Health check endpoint

## 🗄️ Database Schema

```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    email_sent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes** (for faster queries):
```sql
CREATE INDEX idx_created_at ON messages(created_at DESC);
CREATE INDEX idx_email_sent ON messages(email_sent);
```

## 📧 Email Template

When a message is submitted, the admin receives:

```
Subject: 🚨 New Quick Message from ALMASAR Website

---

New Quick Message Received

Message:
[User's message in a highlighted box]

Received: [Timestamp]

---

This is an automated notification from your ALMASAR website
```

## ✅ Testing the Feature

### 1. Test Frontend Validation

- Try submitting empty message → Error message appears
- Try submitting message → Success message appears
- Message clears after submission

### 2. Test Backend (using curl)

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test send message
curl -X POST http://localhost:3000/api/send-quick-message \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message", "timestamp": "2026-03-16T10:30:00Z"}'

# Get messages (with token)
curl "http://localhost:3000/api/messages?token=your-secret-token"

# Get stats
curl "http://localhost:3000/api/messages/stats?token=your-secret-token"
```

### 3. Verify Database

```bash
# Check if messages.db was created
ls -la messages.db

# View messages using SQLite CLI
sqlite3 messages.db
> SELECT * FROM messages;
> .exit
```

## 🚨 Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to send message" | Backend not running | Start with `npm run server` |
| "Message sent but no email" | Wrong email config | Check `.env` credentials |
| "Port 3000 already in use" | Another app using port | Change PORT in `.env` |
| "ENOENT: no such file" | Missing node_modules | Run `npm install` |

## 🔒 Security Considerations

- ✅ Input validation on both frontend and backend
- ✅ HTML escaping to prevent XSS
- ✅ CORS configured
- ✅ Environment variables for sensitive data
- ✅ Admin token for protected endpoints
- ✅ Database backup mechanism

## 📦 Deployment Checklist

- [ ] `.env` file created with production credentials
- [ ] Email service tested and working
- [ ] Database initialized
- [ ] Backend running on production server
- [ ] Frontend pointing to production backend URL
- [ ] HTTPS enabled
- [ ] Rate limiting configured (optional)
- [ ] Database backups scheduled

## 🎯 Next Steps

1. **Configure email service** with your credentials
2. **Test locally** with `npm run dev:full`
3. **Deploy backend** to hosting (Heroku, Railway, Render, etc.)
4. **Update frontend** API endpoint to production server
5. **Monitor messages** via `/api/messages` admin endpoint

## 📞 Support

For issues:
1. Check server logs: `npm run server:dev`
2. Verify `.env` configuration
3. Test API endpoints with curl
4. Check SQLite database: `sqlite3 messages.db`

---

**Happy deploying! 🚀**
