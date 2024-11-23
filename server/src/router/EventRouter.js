const Router = require('express');
const router = new Router();
const eventController = require('../controller/EventController');
const parsePdfMiddleware = require('../middleware/pdfMiddleware');

// Маршруты для работы с событиями
router.post('/create', eventController.create); // Создание одного события
router.post('/createFromPdf', parsePdfMiddleware, eventController.createFromPdf); // Создание событий из PDF
router.get('/events', eventController.getAllEvent); // Получение всех событий
router.get('/:id', eventController.getOneEvent); // Получение одного события
router.put('/update/:id', eventController.updateEvent); // Обновление события
router.delete('/:id', eventController.deleteEvent); // Удаление события

// Добавлен маршрут для отмены события
router.put('/cancel/:id', eventController.cancelEvent); // Отмена события (изменение статуса на "отменено")

module.exports = router;