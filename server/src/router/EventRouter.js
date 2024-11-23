const Router = require('express');
const router = new Router();
const eventController = require('../controller/EventController');
const parsePdfMiddleware = require('../middleware/pdfMiddleware');

router.post('/create', eventController.create); // Для создания одного события
router.post('/createFromPdf', parsePdfMiddleware, eventController.createFromPdf); // Для создания событий из PDF
router.get('/events', eventController.getAllEvent);
router.get('/:id', eventController.getOneEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
