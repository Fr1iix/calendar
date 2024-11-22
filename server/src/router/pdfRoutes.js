const express = require('express');
const router = express.Router();
const pdfController = require('../controller/ pdfController');

// Маршрут для парсинга PDF файла
router.get('/parse-pdf', pdfController.parsePdfFromFile);

module.exports = router;