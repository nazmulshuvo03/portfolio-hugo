# Contact Form API

This API handles contact form submissions from the portfolio website and sends emails using Gmail.

## Setup Instructions

### 1. Install Dependencies

```bash
cd api
npm install
```

### 2. Configure Email Credentials

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual credentials:
   ```env
   EMAIL_USER=your.email@gmail.com
   EMAIL_APP_PASSWORD=your-app-password-here
   PORT=3000
   ```

### 3. Generate Gmail App Password

Since Gmail requires App Passwords for third-party apps:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "Portfolio Contact Form"
6. Copy the generated 16-character password
7. Paste it into your `.env` file as `EMAIL_APP_PASSWORD`

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will run on `http://localhost:3000` by default.

## API Endpoints

### POST `/api/contact`
Send a contact form submission.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to discuss a project..."
}
```

**Success Response:**
```json
{
  "message": "Message sent successfully! Check your email for confirmation."
}
```

**Error Response:**
```json
{
  "error": "All fields are required"
}
```

### GET `/api/health`
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Contact API is running"
}
```

## Features

- ✅ Email notifications to your inbox
- ✅ Automatic confirmation emails to senders
- ✅ Rate limiting (5 requests per 15 minutes per IP)
- ✅ Input validation
- ✅ HTML and plain text email formats
- ✅ Reply-to functionality
- ✅ CORS enabled
- ✅ Error handling

## Security Notes

- The `.env` file is gitignored by default
- Rate limiting prevents spam abuse
- Input validation prevents injection attacks
- Use App Passwords, never your actual Gmail password

## Alternative Email Providers

If you prefer other email services, update the `transporter` configuration in `contact-server.js`:

### Outlook/Hotmail
```javascript
service: 'hotmail'
```

### Yahoo
```javascript
service: 'yahoo'
```

### Custom SMTP
```javascript
host: 'smtp.example.com',
port: 587,
secure: false,
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
}
```

## Deployment

For production deployment, consider:
- Using environment variables directly (not `.env` files)
- Deploying on platforms like Heroku, Railway, or Vercel
- Setting up proper logging and monitoring
- Using a dedicated email service like SendGrid or Mailgun for better deliverability

## Troubleshooting

**Issue:** "Invalid login" error
- **Solution:** Make sure you're using an App Password, not your regular Gmail password

**Issue:** Emails not being received
- **Solution:** Check your spam folder, verify email credentials, ensure 2FA is enabled

**Issue:** "Too many requests" error
- **Solution:** Wait 15 minutes or adjust rate limiting in `contact-server.js`
