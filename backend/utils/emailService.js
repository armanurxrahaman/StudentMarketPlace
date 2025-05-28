const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const {
    EMAIL_CLIENT_ID: CLIENT_ID,
    EMAIL_CLIENT_SECRET: CLIENT_SECRET,
    EMAIL_REDIRECT_URI: REDIRECT_URI,
    EMAIL_REFRESH_TOKEN: REFRESH_TOKEN,
    SENDER_EMAIL: GMAIL,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

let accessToken;
let transporter;

function refreshTransporter() {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: GMAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken,
        },
    });
}

async function refreshAccessToken() {
    try {
        const res = await oAuth2Client.getAccessToken();
        console.log('Refreshed Email Access Token');
        accessToken = res.token;
        refreshTransporter();
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
}

// Initial token refresh
refreshAccessToken();

// Refresh token every 58 minutes (tokens expire after 1 hour)
setInterval(refreshAccessToken, 58 * 60 * 1000);

async function sendEmail(to, subject, text, html = null) {
    try {
        if (!transporter) {
            await refreshAccessToken();
        }

        const mailOptions = {
            from: GMAIL,
            to,
            subject,
            text,
            html,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

async function sendHtmlEmail(to, subject, html) {
    return sendEmail(to, subject, null, html);
}

module.exports = {
    sendEmail,
    sendHtmlEmail,
    refreshAccessToken,
}; 