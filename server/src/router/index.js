const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const userinfoRouter = require('./userinfoRouter');
const eventRouter = require('./eventRouter');
const userController = require('../controller/UserController');
const authMiddleware = require('../middleware/authmiddleware');

// Роуты для регистрации и авторизации
router.post('/registration', userController.register); // Регистрация
router.post('/login', userController.login); // Логин

// Пример маршрута для страницы добавления новостей, доступной только администратору
router.get('/news/add-news', authMiddleware('admin'), (req, res) => {
    res.json({ message: 'Доступ к добавлению новостей подтверждён.' });
});

// Подключение других роутеров
router.use('/user', userRouter); // Роуты для пользователей
router.use('/userinfo', userinfoRouter); // Роуты для информации о пользователе
router.use('/event', eventRouter); // Роуты для событий

module.exports = router;
