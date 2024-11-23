const nodemailer = require('nodemailer');

// Настройки для отправки email через SMTP сервер
const transporter = nodemailer.createTransport({
    service: 'gmail', // Это пример с Gmail, но ты можешь использовать другой SMTP-сервис
    auth: {
        user: 'your-email@gmail.com', // Твой email
        pass: 'your-email-password', // Твой пароль (или лучше, если это приложение, используй app password)
    },
});

// Функция для отправки email
const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: '"Event Notification" <your-email@gmail.com>', // От кого
            to, // Кому
            subject, // Тема
            text, // Текст письма
        });

        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = sendEmail;
