const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, UserInfo} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const {
                email,
                password,
                phone = '',
                firstName = '',
                lastName = '',
                middleName = '',
                role = 'user'
            } = req.body;

            // Проверка существования пользователя
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }

            // Хеширование пароля
            const hashPassword = await bcrypt.hash(password, 5);

            // Создание пользователя со всеми полями
            const user = await User.create({
                email,
                password: hashPassword,
                phone,
                firstName,
                lastName,
                middleName,
                role
            });

            // Генерация токена
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.internal('Пользователь не найден'));
            }

            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'));
            }

            const token = generateJwt(user.id, user.email, user.role);

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async check(req, res){
        const token = generateJwt(req.user.id, req.user.email, req.user.role)

        return res.json({token})
    }

    async getAllUserEmails(req, res, next) {
        try {
            const users = await User.findAll({ attributes: ['email'] }); // Получаем только email

            const emails = users.map(user => user.email); // Преобразуем результат в массив email-ов
            return res.json(emails); // Возвращаем массив email-ов
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

module.exports = new UserController()