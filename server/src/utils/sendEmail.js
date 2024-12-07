const nodemailer = require('nodemailer');

// Создаем транспортер для подключения к SMTP-серверу Яндекса
const transporter = nodemailer.createTransport({
    service: 'yahoo', // Для Яндекса используем 'yahoo' в качестве сервиса
    auth: {
        user: process.env.YANDEX_EMAIL,  // Ваш email на Яндекс
        pass: process.env.YANDEX_PASSWORD,  // Ваш пароль от почты Яндекс
    },
});

// Функция для отправки email
const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.YANDEX_EMAIL, // Адрес отправителя
            to: to, // Адрес получателя
            subject: subject, // Тема письма
            text: text, // Текст письма
        });

        console.log('Письмо отправлено: ', info.response);
        return true;
    } catch (error) {
        console.error('Ошибка при отправке письма: ', error);
        return false;
    }
};

module.exports = sendEmail;
