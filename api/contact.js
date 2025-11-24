const nodemailer = require('nodemailer');

// Check if running as serverless function (Vercel) or Express server (local)
const isServerless = !process.env.LOCAL_DEV;

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Rate limiting - simple in-memory store
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = requestCounts.get(ip) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS) {
        return false;
    }
    
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    return true;
}

async function handleContact(req, res) {
    // Get IP for rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip;
    
    if (!checkRateLimit(ip)) {
        return res.status(429).json({ 
            error: 'Too many requests from this IP, please try again later.' 
        });
    }

    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    // Prepare email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ccff00; background-color: #050505; padding: 20px;">New Contact Form Submission</h2>
                <div style="padding: 20px; border: 1px solid #333;">
                    <p><strong>From:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 1px solid #333; margin: 20px 0;">
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <div style="padding: 20px; background-color: #0a0a0a; text-align: center; margin-top: 20px;">
                    <p style="color: #888; font-size: 0.9em;">Sent from your portfolio website</p>
                </div>
            </div>
        `,
        text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from your portfolio website
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        
        // Send confirmation email
        const confirmationMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting me!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ccff00; background-color: #050505; padding: 20px;">Message Received!</h2>
                    <div style="padding: 20px;">
                        <p>Hi ${name},</p>
                        <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
                        <p>Here's a copy of what you sent:</p>
                        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 3px solid #ccff00;">
                            <p><strong>Subject:</strong> ${subject}</p>
                            <p style="white-space: pre-wrap;">${message}</p>
                        </div>
                        <p>Best regards,<br>Nazmul Alom</p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(confirmationMail);

        return res.status(200).json({ 
            message: 'Message sent successfully! Check your email for confirmation.' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ 
            error: 'Failed to send message. Please try again later.' 
        });
    }
}

// Export for Vercel serverless (production)
module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return handleContact(req, res);
};

// Express server for local development
if (require.main === module || process.env.LOCAL_DEV) {
    const express = require('express');
    const cors = require('cors');
    require('dotenv').config();

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', message: 'Contact API is running' });
    });

    // Contact endpoint
    app.post('/api/contact', async (req, res) => {
        return handleContact(req, res);
    });

    app.listen(PORT, () => {
        console.log(`Contact API server running on http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
        console.log(`Contact endpoint: http://localhost:${PORT}/api/contact`);
    });
}

