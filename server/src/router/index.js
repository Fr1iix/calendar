const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const userinfoRouter = require('./userinfoRouter')
const sportsRouter = require('./SportsRouter')
const subscriptionsRouter = require("./SubscriptionsRouter")
const eventRouter = require('./EventRouter');
const userController = require('../controller/UserController');
const authMiddleware = require('../middleware/authmiddleware');
const GenderRouter = require('./GenderRouter')


router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware(), userController.check);

// Роут для страницы добавления новостей
router.get('/news/add-news', authMiddleware('admin'), (req, res) => {
    res.json({ message: 'Доступ к добавлению новостей подтверждён.' });
});

router.use('/user', userRouter)
router.use('/userinfo', userinfoRouter)
router.use('/sports', sportsRouter)
router.use('/subscriptions', subscriptionsRouter)
router.use('/event', eventRouter);
router.use('/gender', GenderRouter)

module.exports = router