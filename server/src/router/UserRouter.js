const express = require('express');
const { register, verifyEmail, login } = require('../controller/UserController');
const router = express.Router();

// Регистрация пользователя
router.post('/register', register);

// Подтверждение почты
router.post('/verify-email', verifyEmail);

// Логин пользователя
router.post('/login', login);

module.exports = router;
