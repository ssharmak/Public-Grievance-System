# Email Notification Setup Guide

## Overview
The Public Grievance System now supports dual-channel notifications:
- **📱 Push Notifications** (via Expo)
- **📧 Email Notifications** (via Nodemailer + SMTP)

Both channels are triggered automatically when:
1. A user submits a new grievance
2. An admin updates the grievance status

---

## Setup Instructions

### 1. Install Dependencies
Already done! The following package has been installed:
- `nodemailer` - Email sending library

### 2. Configure Environment Variables

Update your `backend/.env` file with SMTP credentials:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
EMAIL_FROM_NAME=Public Grievance System
```

### 3. Email Service Provider Options

#### Option A: Gmail (Recommended for Testing)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Factor Authentication**
3. Generate an **App Password**:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
4. Use these settings:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASS=your-16-char-app-password
```

#### Option B: SendGrid (Recommended for Production)
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Use these settings:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Option C: Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Option D: Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

---

## File Structure

```
backend/
├── config/
│   └── emailConfig.js          # Email transporter configuration
├── utils/
│   ├── emailTemplates.js       # HTML email templates
│   └── notificationService.js  # Dual-channel notification service
├── controllers/
│   ├── notificationController.js
│   └── grievanceController.js
└── .env                        # SMTP credentials (not in git)
```

---

## How It Works

### 1. Notification Service (`utils/notificationService.js`)
The `createAndSendNotification()` function now:
1. Creates a database record
2. Sends an **email** using Nodemailer
3. Sends a **push notification** using Expo
4. Logs the success/failure of each channel

### 2. Email Templates (`utils/emailTemplates.js`)
Three professional HTML email templates:
- **grievanceSubmitted** - Confirmation email with grievance ID
- **statusUpdate** - Status change notification with visual indicators
- **generic** - Fallback template for other notifications

### 3. Automatic Triggers
Email notifications are automatically sent:

**On Grievance Submission:**
```javascript
await createAndSendNotification(
  userId,
  "Grievance Submitted",
  "Your grievance has been submitted successfully.",
  {
    type: "grievanceSubmitted",
    grievanceId: "PGS-XXX",
    title: "Grievance title"
  }
);
```

**On Status Update:**
```javascript
await createAndSendNotification(
  userId,
  "Grievance Status Updated",
  "Your grievance status changed from Submitted to In Review.",
  {
    type: "statusUpdate",
    grievanceId: "PGS-XXX",
    oldStatus: "Submitted",
    newStatus: "In Review"
  }
);
```

---

## Testing

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ Email server is ready to send messages
```

### 2. Test Email Sending
Submit a grievance via the mobile app or use the test endpoint:

```bash
# POST /api/notifications/send
{
  "userId": "user-id-here",
  "title": "Test Email",
  "message": "This is a test notification"
}
```

### 3. Check Console Logs
You'll see detailed logs:
```
📬 === SENDING NOTIFICATION ===
   User: John Doe
   Title: Grievance Submitted
   Message: Your grievance PGS-XXX has been submitted successfully.
✅ [EMAIL SENT to user@example.com] Subject: Grievance Submitted - PGS-XXX
   Message ID: <unique-message-id>
📱 [PUSH SENDING to Token: ExponentPushToken[xxx]]
✅ [PUSH DISPATCHED] Tickets received: 1
📊 Notification Status:
   ✉️  Email: ✅ Sent
   📱 Push: ✅ Sent
=================================
```

---

## Troubleshooting

### Email not sending?

**1. Check SMTP credentials:**
```bash
# In backend directory
cat .env | grep SMTP
```

**2. Gmail-specific issues:**
- Ensure 2FA is enabled
- Use App Password, not account password
- Check "Less secure app access" is OFF (use App Password instead)

**3. Network issues:**
- Some networks block port 587
- Try port 465 with SMTP_SECURE=true

**4. View detailed errors:**
- Check backend console for error messages
- Look for "❌" symbols in logs

### Email sent but not received?

**1. Check spam folder**

**2. Verify email address:**
```javascript
// In MongoDB
db.users.findOne({ _id: "user-id" }, { email: 1 })
```

**3. Check email service status:**
- Gmail: https://www.google.com/appsstatus
- SendGrid: https://status.sendgrid.com/

---

## API Endpoints

### Register Push Token
```http
POST /api/notifications/register-token
Authorization: Bearer <token>
{
  "pushToken": "ExponentPushToken[xxx]"
}
```

### Send Manual Notification (Admin)
```http
POST /api/notifications/send
Authorization: Bearer <token>
{
  "userId": "user-id",
  "title": "Notification Title",
  "message": "Notification message"
}
```

### Get User Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

---

## Production Recommendations

1. **Use SendGrid or AWS SES** for production (not Gmail)
2. **Set up SPF/DKIM** records for your domain
3. **Monitor email delivery rates** using service provider dashboards
4. **Implement retry logic** for failed emails (already built-in for push)
5. **Add email templates** for more notification types as needed

---

## Email Template Customization

Edit `backend/utils/emailTemplates.js` to customize:
- Email styling (colors, fonts, layout)
- Email content (messages, CTAs)
- Add new template types

Example:
```javascript
export const emailTemplates = {
  // Add your custom template
  welcomeEmail: (data) => ({
    subject: `Welcome to PGS, ${data.userName}!`,
    html: `...your HTML here...`,
    text: `...plain text version...`
  })
};
```

---

## Support

For issues or questions:
1. Check backend console logs
2. Verify environment variables
3. Test with a simple email service first (Gmail)
4. Review `backend/utils/notificationService.js` for logic flow

---

**✅ Email notifications are now fully functional!**
