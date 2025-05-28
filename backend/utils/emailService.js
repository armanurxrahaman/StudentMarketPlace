const nodemailer = require('nodemailer');

const {
    EMAIL_USER,
    EMAIL_PASSWORD,
    SENDER_EMAIL
} = process.env;

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

// Function to send plain text email
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: SENDER_EMAIL,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Function to send HTML email
const sendHtmlEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: SENDER_EMAIL,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('HTML email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending HTML email:', error);
        throw error;
    }
};

module.exports = {
    sendEmail,
    sendHtmlEmail
}; 