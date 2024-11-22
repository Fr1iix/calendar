const express = require('express');
const router = express.Router();
const pdfController = require('../controller/ pdfController');

// Маршрут для загрузки и парсинга PDF
router.post('/upload-pdf', pdfController.parsePdf);

module.exports = router;
