const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 587,
    secure: true,
    auth: {
        user: process.env.YANDEX_EMAIL,
        pass: process.env.YANDEX_PASSWORD,
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.YANDEX_EMAIL,
            to: to,
            subject: subject,
            text: text,
        });

        console.log('Письмо отправлено: ', info.response);
        return true;
    } catch (error) {
        console.error('Ошибка при отправке письма: ', error);
        return false;
    }
};

module.exports = sendEmail;