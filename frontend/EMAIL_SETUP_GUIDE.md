# Email Setup Guide for Password Reset Functionality

## Overview
This guide will help you configure email sending for password reset functionality. The system supports Gmail, Outlook, and custom SMTP servers.

## 📧 Email Service Options

### Option 1: Gmail (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

#### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "Vortex Clothing App" as the name
4. Copy the 16-character app password (e.g., `abcd efgh ijkl mnop`)

#### Step 3: Update .env file
```env
EMAIL_SERVICE = "gmail"
EMAIL_USER = "your-email@gmail.com"
EMAIL_APP_PASSWORD = "abcd efgh ijkl mnop"
EMAIL_FROM_NAME = "Vortex Clothing"
FRONTEND_URL = "http://localhost:5175"
```

### Option 2: Outlook/Hotmail

#### Step 1: Update .env file
```env
EMAIL_SERVICE = "outlook"
EMAIL_USER = "your-email@outlook.com"
EMAIL_PASSWORD = "your-password"
EMAIL_FROM_NAME = "Vortex Clothing"
FRONTEND_URL = "http://localhost:5175"
```

### Option 3: Custom SMTP Server

#### Step 1: Get SMTP settings from your email provider
- SMTP Host (e.g., mail.yourcompany.com)
- SMTP Port (usually 587 or 465)
- Username and Password

#### Step 2: Update .env file
```env
EMAIL_SERVICE = "smtp"
SMTP_HOST = "mail.yourcompany.com"
SMTP_PORT = "587"
SMTP_SECURE = "false"
EMAIL_USER = "your-email@yourcompany.com"
EMAIL_PASSWORD = "your-password"
EMAIL_FROM_NAME = "Your Company Name"
FRONTEND_URL = "http://localhost:5175"
```

## 🧪 Testing Email Configuration

### Method 1: API Endpoint Test
```bash
# Test email configuration
curl -X GET http://localhost:4000/api/user/test-email
```

Expected response:
```json
{
  "success": true,
  "message": "Email configuration is working correctly"
}
```

### Method 2: Test with Actual Password Reset
```bash
# Request password reset for existing user
curl -X POST http://localhost:4000/api/user/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "existing-user@example.com"}'
```

## 🚀 Production Deployment

### Environment Variables for Production
```env
# Use your production domain
FRONTEND_URL = "https://yourdomain.com"

# Use production email settings
EMAIL_SERVICE = "gmail"
EMAIL_USER = "noreply@yourdomain.com"
EMAIL_APP_PASSWORD = "your-production-app-password"
EMAIL_FROM_NAME = "Vortex Clothing"
```

### Security Considerations
1. **Never expose email credentials** in client-side code
2. **Use App Passwords** instead of regular passwords for Gmail
3. **Enable 2FA** on email accounts used for sending
4. **Use environment variables** for all sensitive configuration
5. **Monitor email sending** for abuse or high volume

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid login" error with Gmail
- **Solution**: Use App Password instead of regular password
- **Check**: 2-Factor Authentication is enabled

#### 2. "Connection refused" error
- **Solution**: Check SMTP host and port settings
- **Check**: Firewall settings allow outbound email traffic

#### 3. "Authentication failed" error
- **Solution**: Verify username/password credentials
- **Check**: Account is not locked or suspended

#### 4. Emails going to spam folder
- **Solution**: Configure SPF, DKIM records for your domain
- **Temporary**: Ask users to check spam folder

### Debug Mode
Add this to your .env for detailed email debugging:
```env
NODE_DEBUG = "nodemailer"
```

## 📊 Monitoring Email Delivery

### Log Analysis
The system logs email sending status:
- ✅ Success: "Password reset email sent successfully"
- ❌ Error: "Failed to send password reset email"

### Production Monitoring
Consider using services like:
- SendGrid
- Mailgun
- Amazon SES
- Postmark

For high-volume applications with better deliverability and analytics.

## 🎨 Email Template Customization

The email template is located in `backend/utils/emailService.js`. You can customize:
- Company branding
- Email styling
- Message content
- Footer information

## 📱 Testing on Different Email Clients

Test the email template on:
- Gmail (Web & Mobile)
- Outlook (Web & Desktop)
- Apple Mail
- Yahoo Mail

## 🔄 Next Steps

1. Configure your chosen email service
2. Update .env file with credentials
3. Test email configuration
4. Test complete password reset flow
5. Monitor email delivery in production

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify email service credentials
3. Test with the `/test-email` endpoint
4. Ensure firewall allows SMTP traffic