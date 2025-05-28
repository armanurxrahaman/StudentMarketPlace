const express = require("express");
const { sendEmail, sendHtmlEmail } = require("../utils/emailService");
const { getUserEmailById } = require("../models/userModel");

const router = express.Router();

// Test plain text email
router.post('/text', async (req, res) => {
    try {
        const { sellerId, subject, text } = req.body;
        let sellerEmail;
        try {
            sellerEmail = await getUserEmailById(sellerId);
        } catch (err) {
            return res.status(404).json({ error: 'Seller not found. Please ensure the seller account exists.' });
        }
        if (!sellerEmail) {
            return res.status(404).json({ error: 'Seller email not found.' });
        }
        const result = await sendEmail(sellerEmail, subject, text);
        res.json({ success: true, messageId: result.messageId });
    } catch (error) {
        console.error('Error sending donation request email:', error);
        res.status(500).json({ error: error.message });
    }
});

// Test HTML email
router.post('/html', async (req, res) => {
    try {
        const htmlContent = `
            <h1>Test HTML Email</h1>
            <p>This is a <strong>formatted</strong> test email.</p>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
            </ul>
        `;
        
        const result = await sendHtmlEmail(
            'anirvanchakravarty39@gmail.com', // Replace with your email
            'Test HTML Email',
            htmlContent
        );
        res.json({ success: true, messageId: result.messageId });
    } catch (error) {
        console.error('Test HTML email failed:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;