/**
 * Export Messages to Notes File
 * Reads all messages from SQLite database and creates a formatted notes file
 * Can be run standalone: node export-messages.js
 * Or required as a module for automatic updates
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'messages.db');

/**
 * Export messages to MESSAGES_LOG.md
 * @param {sqlite3.Database} dbInstance - Database instance to use (optional, creates own if not provided)
 * @param {boolean} closeDb - Whether to close database after export (default: true)
 */
function exportMessages(dbInstance = null, closeDb = true) {
    const isStandalone = dbInstance === null;
    const db = dbInstance || new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Database error:', err);
            if (isStandalone) process.exit(1);
        }
    });

    db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error('Query error:', err);
            if (isStandalone) {
                db.close();
                process.exit(1);
            }
            return;
        }

        // Create formatted content
        let content = `# ALMASAR Quick Messages Database Export\n`;
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `Total Messages: ${rows.length}\n`;
        content += `\n---\n\n`;

        if (rows.length === 0) {
            content += `No messages yet.\n`;
        } else {
            // Create table header
            content += `| # | Email | Subject | Message | Status | Date |\n`;
            content += `|---|-------|---------|---------|--------|------|\n`;

            // Add rows
            rows.forEach((row, index) => {
                const messagePreview = row.message.substring(0, 50).replace(/\n/g, ' ') + 
                                     (row.message.length > 50 ? '...' : '');
                const status = row.email_sent === 1 ? '✅ Sent' : '❌ Failed';
                const date = new Date(row.created_at).toLocaleString();
                
                content += `| ${index + 1} | ${row.email} | ${row.subject} | ${messagePreview} | ${status} | ${date} |\n`;
            });

            // Add detailed view
            content += `\n---\n\n## Detailed Messages\n\n`;

            rows.forEach((row, index) => {
                content += `### Message ${index + 1}\n`;
                content += `- **From:** ${row.email}\n`;
                content += `- **Subject:** ${row.subject}\n`;
                content += `- **Status:** ${row.email_sent === 1 ? '✅ Email Sent' : '❌ Email Failed'}\n`;
                content += `- **Received:** ${new Date(row.created_at).toLocaleString()}\n`;
                content += `- **Message:**\n\n`;
                content += `${row.message}\n\n`;
                content += `---\n\n`;
            });

            // Add statistics
            content += `## Statistics\n\n`;
            const sentCount = rows.filter(r => r.email_sent === 1).length;
            const failedCount = rows.filter(r => r.email_sent === 0).length;
            content += `- **Total Messages:** ${rows.length}\n`;
            content += `- **Emails Sent:** ${sentCount}\n`;
            content += `- **Emails Failed:** ${failedCount}\n`;
            content += `- **Success Rate:** ${rows.length > 0 ? ((sentCount / rows.length) * 100).toFixed(1) : 0}%\n`;
        }

        // Write to file
        const outputPath = path.join(__dirname, 'MESSAGES_LOG.md');
        fs.writeFileSync(outputPath, content);
        
        console.log(`✅ Messages exported to: ${outputPath}`);
        console.log(`📊 Total messages: ${rows.length}`);
        
        if (closeDb && isStandalone) {
            db.close();
        }
    });
}

// Run as standalone if executed directly
if (require.main === module) {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Database error:', err);
            process.exit(1);
        }
        console.log('Connected to database...');
        exportMessages(db, true);
    });
}

// Export for use as module
module.exports = { exportMessages };
