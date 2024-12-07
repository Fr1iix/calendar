const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserInfo, Address, City, Region, Country, Gender } = require('../models/models');
const sendEmail = require('../utils/sendEmail');
const { Op } = require('sequelize');
const crypto = require('crypto');

class UserController{
     async register(req, res)  {
        const { email, phone, password, firstName, lastName, middleName, age, city, region, country, gender } = req.body;

        try {
            // Проверка существующего пользователя
            const existingUser = await User.findOne({
                where: { [Op.or]: [{ email }, { phone }] },
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Пользователь уже существует.' });
            }

            // Создание записи пользователя
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                email,
                phone,
                password: hashedPassword,
                dateRegister: new Date(),
            });

            // Создание записи в UserInfo
            const [createdGender] = await Gender.findOrCreate({ where: { gender: gender } });


            // Создание связанных записей
            const [gotCountry] = await Country.findOrCreate({
                where: { country },
            });

            // Создаём или получаем регион
            const [gotRegion] = await Region.findOrCreate({
                where: { region },
            });

            // Создаём или получаем город
            const [gotCity] = await City.findOrCreate({
                where: { city },
            });

            // Создаём или проверяем запись в таблице Address
            const [gotAddress] = await Address.findOrCreate({
                where: {
                    idCountry: gotCountry.idCountry, // Используем идентификатор страны
                    idRegion: gotRegion.idRegion,   // Используем идентификатор региона
                    idCity: gotCity.idCity,       // Используем идентификатор города
                },
            });

            await UserInfo.create({
                firstName: firstName,
                lastName: lastName,
                middleName: middleName,
                age: age,
                idGender: createdGender[0]?.idGender,
                idAddress: gotAddress.idAddress,
                idUser: user?.idUser,
            });

            // Генерация кода подтверждения
            const verificationCode = crypto.randomBytes(20).toString('hex');
            await User.update(
                { verificationCode: verificationCode }, // Данные для обновления
                { where: { /* Условие для обновления */ } } // Условие обновления
            );

            // Отправка письма с подтверждением
            const emailSent = await sendEmail(user.email, 'Подтверждение почты', `Ваш код: ${verificationCode}`);
            if (!emailSent) {
                return res.status(500).json({ message: 'Ошибка при отправке письма.' });
            }

            res.status(200).json({ message: 'Регистрация успешна. Проверьте почту для подтверждения.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка на сервере.' });
        }
    };

// Функция для подтверждения почты
async verifyEmail(req, res) {
        const { email, verificationCode } = req.body;

        try {
            const user = await User.findOne({ where: { email, verificationCode } });

            if (!user) {
                return res.status(400).json({ message: 'Неверный код или email.' });
            }

            user.isEmailVerified = true;
            user.verificationCode = null;
            await user.save();

            res.status(200).json({ message: 'Почта подтверждена!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка на сервере.' });
        }
    };

// Функция для логина
async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: 'Неверный пароль.' });

            if (!user.isEmailVerified) {
                return res.status(403).json({ message: 'Email не подтвержден.' });
            }

            const token = jwt.sign(
                { idUser: user.idUser, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'Вход выполнен.', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка на сервере.' });
        }
    };

// Получение пользователей по ID
async getUsersById(req, res){
        const { ids } = req.query; // Получаем массив ID через query-параметры

        if (!ids) {
            return res.status(400).json({ message: 'Не переданы ID пользователей.' });
        }

        const idArray = ids.split(',').map(Number); // Преобразуем строку в массив чисел

        try {
            // Ищем пользователей с указанными ID, включая их связные таблицы
            const users = await User.findAll({
                where: {
                    idUser: { [Op.in]: idArray }
                },
                include: [
                    {
                        model: UserInfo,
                        as: 'userInfo'
                    },
                    {
                        model: Address,
                        as: 'address',
                        include: [
                            {
                                model: City,
                                as: 'city',
                                include: [
                                    {
                                        model: Region,
                                        as: 'region',
                                        include: [{ model: Country, as: 'country' }]
                                    }
                                ]
                            }
                        ]
                    },
                    { model: Gender, as: 'gender' }
                ]
            });

            if (users.length === 0) {
                return res.status(404).json({ message: 'Пользователи с указанными ID не найдены.' });
            }

            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка на сервере.' });
        }
    }

// Обновление данных пользователя
async updateUser(req, res){
        const { idUser } = req.user; // ID пользователя из токена
        const { email, phone, password, firstName, lastName, middleName, age, genderId } = req.body;

        try {
            // Ищем пользователя по ID
            const user = await User.findOne({ where: { idUser } });

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }

            // Обновляем данные в таблице User
            if (email) user.email = email;
            if (phone) user.phone = phone;
            if (password) user.password = await bcrypt.hash(password, 10);

            await user.save();

            // Обновляем данные в таблице UserInfo
            const userInfo = await UserInfo.findOne({ where: { idUser } });

            if (userInfo) {
                if (firstName) userInfo.firstName = firstName;
                if (lastName) userInfo.lastName = lastName;
                if (middleName) userInfo.middleName = middleName;
                if (age) userInfo.age = age;
                await userInfo.save();
            }

            // Обновляем пол пользователя (при наличии)
            if (genderId) {
                const gender = await Gender.findOne({ where: { idGender: genderId } });
                if (!gender) {
                    return res.status(400).json({ message: 'Указан некорректный идентификатор пола.' });
                }
                user.genderId = genderId;
                await user.save();
            }

            res.status(200).json({ message: 'Данные успешно обновлены.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка на сервере.' });
        }
    };

}

// Функция для регистрации пользователя
module.exports = new UserController();