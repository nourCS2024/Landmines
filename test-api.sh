#!/bin/bash
# ALMASAR API Testing Script
# Use these commands to test the backend API

echo "================================"
echo "ALMASAR API Testing Commands"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_URL="http://localhost:3000"
ADMIN_TOKEN="your-secret-token"

echo -e "${BLUE}Make sure the backend is running!${NC}"
echo "Command: npm run server"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}[TEST 1] Health Check${NC}"
echo "Endpoint: GET /api/health"
echo "Command:"
echo "curl $SERVER_URL/api/health"
echo ""
echo "Expected Response:"
echo '{"status":"Server is running","timestamp":"2026-03-16T10:30:00Z"}'
echo ""
echo -e "${GREEN}Run this command:${NC}"
curl $SERVER_URL/api/health 2>/dev/null | jq . || echo "Server not running"
echo ""
echo ""

# Test 2: Send Quick Message
echo -e "${YELLOW}[TEST 2] Send Quick Message${NC}"
echo "Endpoint: POST /api/send-quick-message"
echo "Command:"
echo "curl -X POST $SERVER_URL/api/send-quick-message \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"message\": \"Test message from API\", \"timestamp\": \"2026-03-16T10:30:00Z\"}'"
echo ""
echo "Expected Response:"
echo '{"success":true,"message":"Message received and processed","email_sent":true}'
echo ""
echo -e "${GREEN}Run this command:${NC}"
curl -X POST $SERVER_URL/api/send-quick-message \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message from ALMASAR API", "timestamp": "2026-03-16T10:30:00Z"}' \
  2>/dev/null | jq . || echo "Failed to send message"
echo ""
echo ""

# Test 3: Get All Messages
echo -e "${YELLOW}[TEST 3] Get All Messages (Admin Only)${NC}"
echo "Endpoint: GET /api/messages?token=ADMIN_TOKEN"
echo "Command:"
echo "curl \"$SERVER_URL/api/messages?token=$ADMIN_TOKEN\""
echo ""
echo "Expected Response:"
echo '{"success":true,"messages":[...]}'
echo ""
echo -e "${GREEN}Run this command (replace token):${NC}"
curl "$SERVER_URL/api/messages?token=$ADMIN_TOKEN" \
  2>/dev/null | jq . || echo "Unauthorized or no messages"
echo ""
echo ""

# Test 4: Get Message Statistics
echo -e "${YELLOW}[TEST 4] Get Message Statistics (Admin Only)${NC}"
echo "Endpoint: GET /api/messages/stats?token=ADMIN_TOKEN"
echo "Command:"
echo "curl \"$SERVER_URL/api/messages/stats?token=$ADMIN_TOKEN\""
echo ""
echo "Expected Response:"
echo '{"success":true,"stats":{"total_messages":5,"emails_sent":5,"last_message_time":"2026-03-16 15:45:30"}}'
echo ""
echo -e "${GREEN}Run this command (replace token):${NC}"
curl "$SERVER_URL/api/messages/stats?token=$ADMIN_TOKEN" \
  2>/dev/null | jq . || echo "Unauthorized or no data"
echo ""
echo ""

# Test 5: Send Contact Form Email
echo -e "${YELLOW}[TEST 5] Send Contact Form Email${NC}"
echo "Endpoint: POST /api/send-email"
echo "Command:"
echo "curl -X POST $SERVER_URL/api/send-email \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{ \\"
echo "    \"name\": \"John Doe\", \\"
echo "    \"email\": \"john@example.com\", \\"
echo "    \"subject\": \"General Inquiry\", \\"
echo "    \"message\": \"This is a test message from the contact form\" \\"
echo "  }'"
echo ""
echo "Expected Response:"
echo '{"success":true,"message":"Email sent successfully"}'
echo ""
echo -e "${GREEN}Run this command:${NC}"
curl -X POST $SERVER_URL/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "General Inquiry",
    "message": "This is a test message from the contact form"
  }' \
  2>/dev/null | jq . || echo "Failed to send email"
echo ""
echo ""

# Test 6: Database Query
echo -e "${YELLOW}[TEST 6] View Database Messages${NC}"
echo "Command:"
echo "sqlite3 messages.db \"SELECT id, message, timestamp, email_sent, created_at FROM messages LIMIT 10;\""
echo ""
echo -e "${GREEN}Run this command:${NC}"
if command -v sqlite3 &> /dev/null; then
    sqlite3 messages.db "SELECT id, message, timestamp, email_sent, created_at FROM messages LIMIT 10;" 2>/dev/null || echo "No messages in database"
else
    echo "sqlite3 not installed on this system"
fi
echo ""
echo ""

# Test 7: Database Stats
echo -e "${YELLOW}[TEST 7] Database Statistics${NC}"
echo "Command:"
echo "sqlite3 messages.db \"SELECT COUNT(*) as total, SUM(email_sent) as emails_sent FROM messages;\""
echo ""
echo -e "${GREEN}Run this command:${NC}"
if command -v sqlite3 &> /dev/null; then
    sqlite3 messages.db "SELECT COUNT(*) as total, SUM(email_sent) as emails_sent FROM messages;" 2>/dev/null || echo "No data in database"
else
    echo "sqlite3 not installed on this system"
fi
echo ""
echo ""

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Testing Complete!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo "Notes:"
echo "- Replace ADMIN_TOKEN with your actual token from .env"
echo "- Make sure server is running on port 3000"
echo "- Check .env file for email configuration"
echo "- Check /dev/null | jq . for formatted JSON output"
echo ""
