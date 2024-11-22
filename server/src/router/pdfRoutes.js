const express = require('express');
const router = express.Router();
const pdfController = require('../controller/ pdfController');

// Маршрут для парсинга PDF и сохранения данных
router.get('/parse-pdf', pdfController.parsePdfAndSaveEvents);

module.exports = router;
