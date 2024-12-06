const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendActivationCode(email, code) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Активация аккаунта',
            text: `Ваш код активации: ${code}`,
            html: `<p>Ваш код активации: <strong>${code}</strong></p>`,
        });
    }
}

module.exports = new MailService();
