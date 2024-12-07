const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models/models');
const sendEmail = require('../utils/sendEmail');
const { Op } = require('sequelize');
const crypto = require('crypto');

// Функция для хэширования пароля
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Функция для регистрации пользователя
exports.register = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        // Проверка на существующего пользователя
        const existingUser = await User.findOne({
            where: { [Op.or]: [{ email }, { phone }] },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        // Хэширование пароля
        const hashedPassword = await hashPassword(password);

        // Создание нового пользователя
        const user = await User.create({
            email,
            phone,
            password: hashedPassword,
        });

        // Генерация кода для подтверждения почты
        const verificationCode = crypto.randomBytes(20).toString('hex');
        user.verificationCode = verificationCode;
        await user.save();

        // Отправка письма с кодом подтверждения через OAuth
        const emailSent = await sendEmail(user.email, 'Подтверждение почты', verificationCode);

        if (emailSent) {
            return res.status(200).json({
                message: 'Пожалуйста, проверьте свою почту для подтверждения аккаунта.',
            });
        }

        res.status(500).json({ message: 'Ошибка при отправке письма с подтверждением.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
};

// Функция для подтверждения почты
exports.verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const user = await User.findOne({ where: { email, verificationCode } });

        if (!user) {
            return res.status(400).json({ message: 'Неверный код подтверждения или пользователь не найден.' });
        }

        // Подтверждаем email
        user.isEmailVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ message: 'Почта успешно подтверждена!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
};

// Функция для логина пользователя
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ищем пользователя по email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Пользователь с таким email не найден' });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }

        // Проверяем, подтверждена ли почта
        if (!user.isEmailVerified) {
            return res.status(400).json({ message: 'Пожалуйста, подтвердите свою почту.' });
        }

        // Генерация JWT токена
        const token = jwt.sign(
            { id: user.id, email: user.email, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Токен истекает через 1 час
        );

        // Отправляем токен в ответе
        res.status(200).json({ message: 'Авторизация успешна', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
};
