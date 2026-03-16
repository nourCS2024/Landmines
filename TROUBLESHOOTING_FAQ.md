# ALMASAR Quick Message Feature - Troubleshooting & FAQ

## ❓ Frequently Asked Questions

### Installation & Setup

**Q1: What should I do first?**
A: Follow this order:
1. Run `npm install` (installs all packages)
2. Copy `.env.example` to `.env`
3. Fill in your email credentials in `.env`
4. Start backend: `npm run server`
5. Start frontend: `npm run dev` (in new terminal)

**Q2: I get "Cannot find module 'express'" error**
A: You haven't installed dependencies. Run:
```bash
npm install
```

**Q3: What Node.js version do I need?**
A: Node.js 14.0.0 or higher. Check with:
```bash
node --version
```

**Q4: Can I use a free email service?**
A: Yes! Gmail (recommended), SendGrid (free tier), or Mailgun all work. See `.env.example` for examples.

---

### Email Configuration

**Q5: Gmail says "Invalid credentials" even though my password is correct**
A: Gmail requires an **App Password**, not your regular password:
1. Enable 2-Factor Authentication on your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Use the 16-character password Google generates

**Q6: How do I test if my email configuration works?**
A: Use curl to test the API:
```bash
curl -X POST http://localhost:3000/api/send-quick-message \
  -H "Content-Type: application/json" \
  -d '{"message":"Test message","timestamp":"2026-03-16T10:30:00Z"}'
```

**Q7: Emails aren't being sent but no error appears**
A: Check the server logs for detailed error messages. Add logging to `server.js`:
```javascript
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('DETAILED ERROR:', error); // Add this
    }
});
```

**Q8: Can I send emails to multiple recipients?**
A: Yes, modify `mailOptions.to` to accept an array:
```javascript
to: 'admin@example.com, staff@example.com'
// or
to: ['admin@example.com', 'staff@example.com']
```

---

### Database

**Q9: Where is the database stored?**
A: SQLite creates `messages.db` in your project root directory. It's automatically created on first run.

**Q10: How do I view messages in the database?**
A: Use SQLite CLI:
```bash
sqlite3 messages.db "SELECT * FROM messages;"
```

**Q11: Can I backup the database?**
A: Yes, just copy `messages.db` to a backup location:
```bash
cp messages.db messages.db.backup
```

**Q12: How do I clear all messages?**
A: ⚠️ WARNING: This deletes everything!
```bash
sqlite3 messages.db "DELETE FROM messages;"
```

**Q13: Database shows "email_sent = 0" - did the email fail?**
A: Yes, it means the email wasn't sent successfully. Check:
1. Email configuration in `.env`
2. Network connectivity
3. Server logs for errors
4. SMTP service status

---

### Frontend & User Interface

**Q14: The quick message box doesn't appear**
A: Check:
1. Browser console for JavaScript errors (F12 → Console)
2. Verify `homepage.js` is loading (Network tab)
3. Verify CSS is loading (Network tab)
4. Check that the HTML section is before `</footer>`

**Q15: The form submits but nothing happens**
A: Backend is not running. Start it with:
```bash
npm run server
```

**Q16: I get a CORS error**
A: Make sure:
1. Backend server is running on port 3000
2. CORS is enabled in `server.js` (it is by default)
3. Frontend API calls use correct endpoint: `/api/send-quick-message`

**Q17: The success message appears but email isn't sent**
A: Frontend success just means backend responded with `success: true`. Check:
1. Email configuration in `.env`
2. Admin email is correct
3. Server logs for email errors

**Q18: How do I customize the success/error messages?**
A: Edit in `index.html`:
```html
<div id="quick-message-success" class="alert alert-success">
    <p>✓ Your custom success message here!</p>
</div>
```

---

### Backend & API

**Q19: Port 3000 is already in use**
A: Either:
1. Kill the process using port 3000
2. Change PORT in `.env`:
   ```env
   PORT=3001
   ```

**Q20: How do I enable HTTPS?**
A: Depends on hosting platform. Most cloud services (Heroku, Railway, Vercel) provide free HTTPS. For local testing, you need:
```bash
npm install https
```
Then modify `server.js` to use HTTPS (requires SSL certificates).

**Q21: Can I add rate limiting?**
A: Yes, install `express-rate-limit`:
```bash
npm install express-rate-limit
```
Then add to `server.js`:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // max 5 requests per window
});
app.use('/api/send-quick-message', limiter);
```

**Q22: How do I add authentication to admin endpoints?**
A: Use the `ADMIN_TOKEN` from `.env`. It's already implemented:
```javascript
if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({success: false});
}
```

---

### Deployment

**Q23: How do I deploy to production?**
A: General steps:
1. Deploy backend to cloud service (Heroku, Railway, Render)
2. Deploy frontend to CDN (Vercel, Netlify, Firebase)
3. Update frontend API endpoint to production backend URL
4. Configure email service for production
5. Test end-to-end

**Q24: What cloud platforms are recommended?**
A: 
- **Backend**: Heroku, Railway, Render (Node.js friendly)
- **Frontend**: Vercel, Netlify (static files)
- **Database**: Stays with backend or use cloud DB

**Q25: Do I need to change code for deployment?**
A: Minimal changes:
1. Update `.env` with production credentials
2. Update frontend API URL to production backend
3. Everything else should work as-is

**Q26: How do I monitor the backend in production?**
A: Use cloud platform's dashboard:
- Heroku: heroku logs
- Railway: console logs
- Render: logs tab

---

### Security

**Q27: Is my email password secure?**
A: Yes, it's:
1. Stored in `.env` (not in code)
2. Never sent to frontend
3. Never logged
4. Only used server-side for SMTP

**Q28: Can hackers spam my contact form?**
A: Potentially. Add rate limiting (see Q21) or:
1. Add CAPTCHA verification
2. Set message character limits (already done: max 1000)
3. Monitor `/api/messages/stats` for unusual activity

**Q29: Is the database secured?**
A: SQLite is file-based, so:
1. Protect your server access
2. Backup regularly
3. Don't commit `messages.db` to version control
4. Add `.env` and `messages.db` to `.gitignore`

**Q30: How do I prevent XSS attacks?**
A: Already implemented in `server.js`:
```javascript
function escapeHtml(text) {
    const map = {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'':'&#039;'};
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
```

---

## 🐛 Troubleshooting Guide

### Server Won't Start

**Error**: `EADDRINUSE: address already in use :::3000`
```bash
# Solution: Kill process on port 3000
# Linux/Mac:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error**: `Cannot find module 'dotenv'`
```bash
# Solution: Install missing packages
npm install
```

**Error**: `TypeError: Cannot read property 'verify' of undefined`
```bash
# Solution: Email credentials missing in .env
# Check:
echo $EMAIL_USER
echo $EMAIL_PASSWORD
```

---

### Database Issues

**Error**: `SQLITE_CANTOPEN: unable to open database file`
```bash
# Solution: Database folder doesn't exist
mkdir -p ./
# Or: Check file permissions
chmod 777 messages.db
```

**Error**: `database is locked`
```bash
# Solution: Another process is using DB
# Kill the process using the database
npm stop
npm run server
```

---

### Email Issues

**Error**: `Invalid login: 535-5.7.8 Username and Password not accepted`
```bash
# Solution for Gmail:
# 1. Use app password (not regular password)
# 2. Enable 2-Factor Authentication
# 3. Get password from myaccount.google.com/apppasswords
```

**Error**: `Error: getaddrinfo ENOTFOUND smtp.gmail.com`
```bash
# Solution: Network issue
# 1. Check internet connection
# 2. Check if port 587 is open (firewall)
# 3. Try different EMAIL_SERVICE in .env
```

**Error**: `Timed out waiting for mail server to respond`
```bash
# Solution:
# 1. Increase timeout in server.js:
#    transporter.set('socketTimeout', 30000)
# 2. Check network stability
# 3. Try different SMTP server
```

---

### API Issues

**Error**: `POST http://localhost:3000/api/send-quick-message 404`
```bash
# Solution: Backend not running
npm run server
```

**Error**: `Preflight response had invalid HTTP status code 403`
```bash
# Solution: CORS issue
# Check server.js has:
# app.use(cors());
```

**Error**: `SyntaxError: Unexpected token < in JSON at position 0`
```bash
# Solution: Receiving HTML instead of JSON
# Check:
# 1. API endpoint URL is correct
# 2. Backend is responding with JSON
# 3. No typo in endpoint path
```

---

### Frontend Issues

**Error**: Form doesn't submit
```bash
# Check:
# 1. Browser console (F12) for errors
# 2. Network tab to see failed requests
# 3. Backend running on port 3000
# 4. Form ID matches: id="quick-message-form"
```

**Error**: Submit button doesn't work on mobile
```bash
# Check:
# 1. CSS media queries applied correctly
# 2. Touch events work (not just click)
# 3. Viewport meta tag in <head>:
#    <meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## ⚡ Performance Tips

### Optimize Database Queries
```bash
# Create indexes for faster queries
sqlite3 messages.db
> CREATE INDEX idx_created_at ON messages(created_at DESC);
> CREATE INDEX idx_email_sent ON messages(email_sent);
> .exit
```

### Reduce Email Send Time
```javascript
// Add async/await and error handling
async function sendEmailNotification(message, timestamp) {
    try {
        const info = await transporter.sendMail(mailOptions);
        // Update DB
    } catch (error) {
        console.error('Email failed:', error.message);
        // Don't block main process
    }
}
```

### Enable Compression
```bash
npm install compression
```
Then in `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

---

## 📞 Getting Help

If you're stuck:

1. **Check logs**: Look at server terminal output
2. **Check console**: Browser F12 → Console tab
3. **Check network**: Browser F12 → Network tab
4. **Test API**: Use curl commands from `test-api.sh`
5. **Test database**: Check `messages.db` with sqlite3
6. **Check .env**: Verify all credentials are correct
7. **Try examples**: Run test commands exactly as shown

---

## 🔧 Debug Mode

Enable detailed logging:

```javascript
// Add to server.js
const DEBUG = process.env.DEBUG === 'true';

function log(...args) {
    if (DEBUG) console.log('[DEBUG]', ...args);
}

// Use throughout:
log('Message received:', message);
log('Saving to database...');
log('Sending email to:', process.env.ADMIN_EMAIL);
```

Run with:
```bash
DEBUG=true npm run server
```

---

## 📊 Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format, missing fields |
| 401 | Unauthorized | Check admin token |
| 404 | Not Found | Check endpoint URL |
| 500 | Server Error | Check server logs |
| 503 | Service Unavailable | Email service down |
| EADDRINUSE | Port in use | Use different port |
| ENOTFOUND | DNS error | Check internet/firewall |

---

**FAQ Version**: 1.0
**Last Updated**: March 16, 2026
**For**: ALMASAR Quick Message Feature Support
