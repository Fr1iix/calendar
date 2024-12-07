const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = (requiredRole = null) => async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Необходима авторизация.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Если нужна проверка роли
        if (requiredRole) {
            const user = await User.findOne({ where: { idUser: decoded.id } });
            if (!user || user.role !== requiredRole) {
                return res.status(403).json({ message: 'Недостаточно прав.' });
            }
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Неверный токен.' });
    }
};
