const { User } = require('../models/models');

// Мидлвар для проверки роли
const checkRole = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.user.id);  // Получаем пользователя из токена
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Проверяем, является ли роль пользователя одной из разрешенных
            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Недостаточно прав для доступа к этому ресурсу' });
            }

            next();  // Если роль пользователя подходит, продолжаем выполнение
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка на сервере' });
        }
    };
};

module.exports = checkRole;
