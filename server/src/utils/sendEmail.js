const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Настройка OAuth 2.0
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID, // ваш Client ID
    process.env.GOOGLE_CLIENT_SECRET, // ваш Client Secret
    'http://localhost:5000/oauth2callback' // URL для редиректа (обновите, если нужно)
);

// Функция для отправки письма
async function sendEmail(to, subject, text) {
    try {
        // Получение refreshToken и accessToken
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // ваш refresh token
        });

        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GOOGLE_USER, // ваш email
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Письмо отправлено!');
        return true;
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        return false;
    }
}

module.exports = sendEmail;
