const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting to prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/contact', limiter);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Verify email configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            error: 'All fields are required' 
        });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            error: 'Invalid email address' 
        });
    }

    // Prepare email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        replyTo: email, // Reply to the sender
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
        
        // Send confirmation email to the sender
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

        res.status(200).json({ 
            message: 'Message sent successfully! Check your email for confirmation.' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Contact API is running' });
});

app.listen(PORT, () => {
    console.log(`Contact API server running on port ${PORT}`);
});
