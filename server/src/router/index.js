const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const eventRouter = require('./eventRouter');
const userController = require('../controller/UserController');
const authMiddleware = require('../middleware/authmiddleware');
const AddressRouter = require('./AddressRouter');
const GenderRouter = require('./GenderRouter');
const NewsRouter = require('./NewsRouter')


// Пример маршрута для страницы добавления новостей, доступной только администратору
router.get('/news/add-news', authMiddleware('admin'), (req, res) => {
    res.json({ message: 'Доступ к добавлению новостей подтверждён.' });
});

// Подключение других роутеров
router.use('/user', userRouter); // Роуты для пользователей
router.use('/event', eventRouter); // Роуты для событий
router.use('/address', AddressRouter)
router.use('/gender', GenderRouter)
router.use('/news', NewsRouter)

module.exports = router;
