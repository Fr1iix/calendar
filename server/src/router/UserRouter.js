const Router = require('express');
const userController = require('../controller/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

// Роут для регистрации
router.post('/register', userController.register);
// Роут для логина
router.post('/login', userController.login);
// Роут для получения пользователей по ID
router.get('/users', authMiddleware('admin'), userController.getUsersById);
// Роут для обновления данных пользователя
router.put('/update', authMiddleware(), userController.updateUser);
// Подтверждение почты
router.post('/verify-email', userController.verifyEmail);



module.exports = router;
