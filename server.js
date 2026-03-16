/**
 * ALMASAR Backend Server
 * Handles quick message submissions, email dispatch, and database logging
 * 
 * Features:
 * - Express.js API endpoint for message submissions
 * - Nodemailer email dispatch
 * - SQLite database for message backup/logging
 * - Error handling and validation
 * - Automatic MESSAGES_LOG.md updates
 */

const express = require('express');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import export function for automatic updates
const { exportMessages } = require('./export-messages');

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// MIDDLEWARE SETUP
// =====================

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// =====================
// DATABASE SETUP (SQLite)
// =====================

const dbPath = path.join(__dirname, 'messages.db');

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create messages table if it doesn't exist
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            email_sent BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating messages table:', err);
        } else {
            console.log('Messages table initialized');
        }
    });
}

// =====================
// EMAIL CONFIGURATION
// =====================

// Configure Nodemailer
// You can use Gmail, SendGrid, or any SMTP service
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,     // Your email
        pass: process.env.EMAIL_PASSWORD  // Your app-specific password
    }
});

// Verify email configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email service ready');
    }
});

// =====================
// API ENDPOINTS
// =====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

/**
 * POST /api/send-quick-message
 * Receives a quick message from the frontend
 * Saves to database and sends email notification
 */
app.post('/api/send-quick-message', async (req, res) => {
    try {
        const { email, subject, message, timestamp } = req.body;

        // Validation
        if (!email || email.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Email cannot be empty'
            });
        }

        if (!subject || subject.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Subject cannot be empty'
            });
        }

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message cannot be empty'
            });
        }

        if (message.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Message cannot exceed 1000 characters'
            });
        }

        // Save to database
        saveMessageToDatabase(email, subject, message, timestamp || new Date().toISOString());

        // Send email notification
        const emailSent = await sendEmailNotification(email, subject, message, timestamp);

        // Respond to client
        res.json({
            success: true,
            message: 'Message received and processed',
            email_sent: emailSent
        });

    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your message'
        });
    }
});

/**
 * POST /api/send-email
 * Handles contact form submissions (for the full contact form)
 */
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
                <p><small>Sent at: ${new Date().toISOString()}</small></p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email send error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to send email'
                });
            } else {
                console.log('Email sent:', info.response);
                res.json({
                    success: true,
                    message: 'Email sent successfully'
                });
            }
        });

    } catch (error) {
        console.error('Error handling contact form:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
});

/**
 * GET /api/messages
 * Retrieve all messages from database (admin endpoint)
 * Protected with simple token check (in production, use proper auth)
 */
app.get('/api/messages', (req, res) => {
    const token = req.query.token || req.headers.authorization;

    // Simple token validation
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.json({ success: true, messages: rows });
        }
    });
});

/**
 * GET /api/messages/stats
 * Get message statistics
 */
app.get('/api/messages/stats', (req, res) => {
    const token = req.query.token || req.headers.authorization;

    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    db.get(
        `SELECT 
            COUNT(*) as total_messages,
            SUM(email_sent) as emails_sent,
            MAX(created_at) as last_message_time
        FROM messages`,
        (err, row) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Database error' });
            } else {
                res.json({ success: true, stats: row });
            }
        }
    );
});

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Save message to SQLite database
 */
function saveMessageToDatabase(email, subject, message, timestamp) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO messages (email, subject, message, timestamp, email_sent) VALUES (?, ?, ?, ?, 0)',
            [email, subject, message, timestamp],
            function(err) {
                if (err) {
                    console.error('Database insert error:', err);
                    reject(err);
                } else {
                    console.log(`Message saved to database with ID: ${this.lastID}`);
                    
                    // Automatically export messages after database update
                    exportMessages(db, false);
                    
                    resolve(this.lastID);
                }
            }
        );
    });
}

/**
 * Send email notification to admin
 */
async function sendEmailNotification(email, subject, message, timestamp) {
    try {
        const mailOptions = {
            from: `"${escapeHtml(email)}" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `📨 Quick Message from ${escapeHtml(email.split('@')[0])} - ${subject}`,
            html: `
                <h2>New Quick Message Received</h2>
                <p><strong>From:</strong> ${escapeHtml(email)}</p>
                <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background-color: #f4f4f4; padding: 15px; border-left: 4px solid #a6ad38;">
                    ${escapeHtml(message).replace(/\n/g, '<br>')}
                </blockquote>
                <p><strong>Received:</strong> ${timestamp}</p>
                <hr>
                <p><small>This is an automated notification from your ALMASAR website. You can reply directly to this email to contact the sender.</small></p>
            `
        };

        return new Promise((resolve) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email notification error:', error);
                    // Update database to mark email as failed
                    db.run('UPDATE messages SET email_sent = 0 WHERE timestamp = ?', [timestamp]);
                    resolve(false);
                } else {
                    console.log('Email notification sent:', info.response);
                    // Update database to mark email as sent
                    db.run('UPDATE messages SET email_sent = 1 WHERE timestamp = ?', [timestamp]);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        console.error('Error sending email notification:', error);
        return false;
    }
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// =====================
// ERROR HANDLING
// =====================

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// =====================
// SERVER STARTUP
// =====================

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   ALMASAR Backend Server Running       ║
    ║   Server: http://localhost:${PORT}         ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}       ║
    ╚════════════════════════════════════════╝
    `);
});

// =====================
// GRACEFUL SHUTDOWN
// =====================

process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
