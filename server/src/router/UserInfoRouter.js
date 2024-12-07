const express = require('express');
const { getUserInfo } = require('../controller/UserInfoController');
const router = express.Router();

// Получение информации о пользователе
router.get('/info/:userId', getUserInfo);

module.exports = router;
