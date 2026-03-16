# ALMASAR Quick Message Feature - Quick Reference

## 📦 NPM Packages Required

```bash
npm install
```

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18.2 | Web server framework |
| `nodemailer` | ^6.9.7 | Email sending service |
| `sqlite3` | ^5.1.6 | Lightweight database |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `dotenv` | ^16.3.1 | Environment variable management |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.0.2 | Auto-reload server on changes |
| `concurrently` | ^8.2.2 | Run multiple processes simultaneously |

## 🚀 Quick Start Commands

```bash
# Install all dependencies
npm install

# Run frontend dev server
npm run dev
# Access at: http://localhost:8000

# Run backend server
npm run server
# Backend at: http://localhost:3000

# Run both together (development)
npm run dev:full

# Run backend with auto-reload
npm run server:dev
```

## 📁 Files Added/Modified

### New Files
- ✅ `server.js` - Node.js backend server
- ✅ `.env.example` - Environment variables template
- ✅ `SETUP_GUIDE.md` - Detailed setup instructions
- ✅ `messages.db` - SQLite database (auto-created)

### Modified Files
- ✅ `index.html` - Added quick message section
- ✅ `homepage.css` - Added message box styling
- ✅ `homepage.js` - Added message submission handler
- ✅ `package.json` - Added backend scripts and dependencies

## 🎯 Frontend Changes Summary

### HTML Addition (before footer)
```html
<!-- QUICK MESSAGE BOX -->
<section class="quick-message-box" id="message-box">
    <div class="message-container reveal">
        <h3>Quick Message</h3>
        <p>Have an urgent update? Send us a quick message.</p>
        <form id="quick-message-form" class="quick-form">
            <textarea id="quick-message-text" name="message" 
                placeholder="Your message here..." rows="3" required>
            </textarea>
            <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
        <div id="quick-message-success" class="alert alert-success"></div>
        <div id="quick-message-error" class="alert alert-error"></div>
    </div>
</section>
```

### CSS Styling (Design System Compliant)
- Background: Red gradient (primary-red → dark red)
- Container: White with shadow, rounded corners
- Textarea: Matches form styling with focus effects
- Button: Full-width primary button with hover animation

### JavaScript Handler
```javascript
// Fetch API to send message to backend
// Success/error notifications
// Form validation and reset
```

## 🖥️ Backend Architecture

### Server Flow
```
Client Request (POST /api/send-quick-message)
    ↓
Express Server receives message
    ↓
Validation (not empty, < 1000 chars)
    ↓
Save to SQLite Database
    ↓
Send Email via Nodemailer
    ↓
Update DB with email status
    ↓
Return success response to client
```

### Database
- File: `messages.db` (auto-created)
- Table: `messages`
- Stores: Message text, timestamp, email status, creation time

### Email Service
- Configured via `.env`
- Supports: Gmail, SendGrid, Outlook, Custom SMTP
- Sends notification to `ADMIN_EMAIL`

## 🔧 Environment Setup (.env)

```env
# Required
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-specific-password
ADMIN_EMAIL=info@almasar-project.org

# Optional
NODE_ENV=development
ADMIN_TOKEN=your-secret-token
DATABASE_PATH=./messages.db
```

## ✅ Features Implemented

- ✅ Responsive quick message form
- ✅ Real-time frontend validation
- ✅ SQLite database backup
- ✅ Automated email notifications
- ✅ Error handling and user feedback
- ✅ Scroll reveal animations
- ✅ Design system compliance
- ✅ Mobile responsive
- ✅ Admin endpoints for message retrieval
- ✅ Security features (input validation, XSS prevention)

## 🧪 Testing

### Manual Testing
1. Fill in message → Click "Send Message"
2. See success notification
3. Check email inbox
4. Verify message in database

### API Testing (curl)
```bash
# Send message
curl -X POST http://localhost:3000/api/send-quick-message \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "timestamp": "2026-03-16T10:30:00Z"}'

# Get messages
curl "http://localhost:3000/api/messages?token=your-token"

# Get stats
curl "http://localhost:3000/api/messages/stats?token=your-token"
```

## 🚀 Deployment

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Create `.env` with production credentials

### Step 3: Start Backend
```bash
npm run server
```

### Step 4: Update Frontend API
Change `/api/send-quick-message` endpoint to production URL

### Step 5: Host on Cloud
- Backend: Heroku, Railway, Render, AWS
- Frontend: Vercel, Netlify, Firebase

## 📊 Database Admin Access

```bash
# View all messages
sqlite3 messages.db "SELECT * FROM messages;"

# View message count
sqlite3 messages.db "SELECT COUNT(*) FROM messages;"

# Export to CSV
sqlite3 messages.db ".mode csv" ".output messages.csv" "SELECT * FROM messages;" ".quit"
```

## 🎨 Design System Compliance

✅ **Colors**: Primary Red (#ec3353), White, Dark Brown
✅ **Fonts**: Bebas Neue (titles), Open Sans (body)
✅ **Spacing**: 80px padding, 20px border-radius
✅ **Animations**: Scroll reveal, button hover effects
✅ **Responsive**: Mobile-first, works on all screens

## 📋 Checklist Before Deployment

- [ ] `.env` file created with real credentials
- [ ] Email service tested (sent test email)
- [ ] Database initializes without errors
- [ ] Frontend sends message successfully
- [ ] Admin receives email notification
- [ ] Message stored in database
- [ ] HTTPS enabled on production
- [ ] Admin token set securely
- [ ] Frontend API URL updated to production

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module 'express'" | Run `npm install` |
| "Failed to send email" | Check `.env` credentials, enable Gmail app password |
| "Port 3000 in use" | Change PORT in `.env` or kill process using port |
| "Database locked" | Close other connections, restart server |
| "CORS error" | Backend not running or API URL incorrect |

## 📞 Contacts

- Admin Email: info@almasar-project.org
- Website: ALMASAR
- GitHub: nourCS2024/Landmines

---

**Version**: 1.0.0
**Last Updated**: March 16, 2026
**Status**: Production Ready
