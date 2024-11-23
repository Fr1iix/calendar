const express = require('express');
const router = express.Router();
const pdfController = require('../middleware/pdfMiddleware');

// Маршрут для парсинга PDF и сохранения данных
router.get('/parse-pdf', pdfController.parsePdfAndGetEvents);

module.exports = router;
