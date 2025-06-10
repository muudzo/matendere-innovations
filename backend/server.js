const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Input validation middleware
const validateFormInput = (req, res, next) => {
    const { name, email, phone, message } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push('Please provide a valid email address');
    }

    if (!phone || !phone.match(/^\+?[\d\s-]{10,}$/)) {
        errors.push('Please provide a valid phone number');
    }

    if (!message || message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email configuration endpoint
app.get('/api/test-email-config', async (req, res) => {
    try {
        await transporter.verify();
        res.status(200).json({
            success: true,
            message: 'Email configuration is valid'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email configuration is invalid',
            error: error.message
        });
    }
});

// Form submission endpoint
app.post('/api/submit-form', validateFormInput, async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        // Send email to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
            `
        };

        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting us',
            html: `
                <h3>Thank you for reaching out!</h3>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you shortly.</p>
                <p>Here's a copy of your submission:</p>
                <p><strong>Message:</strong> ${message}</p>
                <hr>
                <p>Best regards,<br>Your Company Name</p>
            `
        };

        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        res.status(200).json({
            success: true,
            message: 'Form submitted successfully',
            data: {
                name,
                email,
                phone,
                submittedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit form',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Test email config: http://localhost:${PORT}/api/test-email-config`);
});