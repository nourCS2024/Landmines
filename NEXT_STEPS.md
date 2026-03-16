# ✅ Quick Message Feature - NEXT STEPS

## Changes Made (March 16, 2026)

### 1. **HTML Form Updated** ✅
- Added email input field
- Added subject input field  
- Message textarea remains
- All fields are required

### 2. **CSS Styling Fixed** ✅
- Input fields styled with focus effects
- Proper red color (var(--primary-red) = #ec3353)
- Textarea styling updated
- Email/Subject same style as textarea

### 3. **Frontend JavaScript Updated** ✅
- Form now captures email, subject, and message
- Email validation added
- All fields validation added
- Sends complete payload to backend

### 4. **Backend API Updated** ✅
- Database schema updated to include `email` and `subject` columns
- POST endpoint now accepts all three fields
- Email now includes sender's email in `replyTo` header
- Subject line includes user's subject

### 5. **Database Schema Updated** ✅
```sql
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    email_sent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🚨 CRITICAL: The 404 Error Issue

**Why you got 404 error:**
```
POST /api/send-quick-message Error (404): "Not found"
```

**Reason:** 
- You're running `http-server` (frontend only) on port 8000
- `http-server` cannot handle the `/api/` endpoints
- You need Node.js backend running on port 3000

**Solution:** Start the Node.js backend

---

## 🔧 How to Start Everything

### Step 1: Install Dependencies (if not already done)
```bash
npm install
```

### Step 2: Create `.env` file
Copy from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your email credentials:
```env
PORT=3000
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
ADMIN_EMAIL=info@almasar-project.org
ADMIN_TOKEN=your-secret-token
DATABASE_PATH=./messages.db
```

### Step 3: Stop http-server
- In your terminal with http-server, press **CTRL+C**

### Step 4: Start Node.js Backend
```bash
npm run server
```

You should see:
```
╔════════════════════════════════════════╗
║   ALMASAR Backend Server Running       ║
║   Server: http://localhost:3000        ║
║   Environment: development             ║
╚════════════════════════════════════════╝
```

### Step 5: Start Frontend (in NEW terminal)
```bash
npm run dev
```

Or use http-server:
```bash
npx http-server
```

---

## ✅ Testing the Form

1. Open browser to `http://localhost:8000` (or `http://localhost:9999` if using different port)
2. Scroll to "Quick Message" section
3. Fill in:
   - **Email:** your-email@example.com
   - **Subject:** Test Subject
   - **Message:** Test message content
4. Click **"Send Message"**
5. You should see green success message: ✓ Message sent successfully!

---

## 🎯 What Happens When You Submit

1. **Frontend** sends POST to `http://localhost:3000/api/send-quick-message`
2. **Backend** receives request with email, subject, message
3. **Backend** validates all fields
4. **Backend** saves to SQLite database (`messages.db`)
5. **Backend** sends email via Nodemailer to admin
6. **Backend** updates database to mark email as sent
7. **Frontend** shows success message

---

## 📧 Email Configuration

### For Gmail (Recommended)
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-Factor Authentication first if not done
3. Select "Mail" → "Windows Computer"
4. Copy the 16-character app password
5. Paste in `.env` as `EMAIL_PASSWORD`

### For Other Services
See `.env.example` for SendGrid, Mailgun, Outlook options

---

## 🐛 Troubleshooting

### "EADDRINUSE: address already in use :::3000"
```bash
# Kill process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Form submits but shows error
- Check backend is running: `npm run server`
- Check `.env` file exists with correct credentials
- Check browser console (F12) for errors
- Check server logs for detailed error

### Email not sending
- Verify Gmail app password (not regular password)
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Check internet connection
- Verify `ADMIN_EMAIL` is correct

---

## 📊 Verify Everything Works

### Check Database
```bash
sqlite3 messages.db "SELECT * FROM messages;"
```

### Check API Health
```bash
curl http://localhost:3000/api/health
```

### Test API Directly
```bash
curl -X POST http://localhost:3000/api/send-quick-message \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "subject":"Test",
    "message":"Test message content"
  }'
```

---

## 📝 Files Changed

| File | Changes |
|------|---------|
| `index.html` | Added email & subject inputs to quick message form |
| `homepage.css` | Added styling for email/subject input fields |
| `homepage.js` | Updated form handler to send email & subject |
| `server.js` | Updated API to accept email & subject; Updated DB schema |

---

## 🎉 You're Ready!

1. Stop http-server (CTRL+C)
2. Run `npm run server`
3. Open new terminal, run `npm run dev` or `npx http-server`
4. Test the form - it should work!

Questions? Check `TROUBLESHOOTING_FAQ.md`
