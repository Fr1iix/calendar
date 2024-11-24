const Router = require('express');
const router = new Router();
const eventController = require('../controller/EventController');

router.post('/processPdfParse', eventController.processPdfData);
router.post("/createevent", eventController.create)
router.get('/events', eventController.getAllEvent);// Маршрут для получения всех событий
router.get('/:id', eventController.getOneEvent);// Маршрут для получения одного события по ID
router.put('/update/:id', eventController.updateEvent);// Маршрут для обновления события (перенос, изменение) через PUT
router.delete('/:id', eventController.deleteEvent);// Маршрут для удаления события по ID
router.put('/cancel/:id', eventController.cancelEvent);// Маршрут для отмены события (изменение статуса на "отменено")
router.get('/sendReminder', eventController.sendReminder);// Маршрут для отправки напоминаний за 24 часа до события
router.put('/sendNotificationAboutChange/:id', eventController.sendNotificationAboutChange);// Добавление маршрута для отправки уведомлений об изменениях/переносах
router.get('sendNotificationToAllUsers', eventController.sendNotificationToAllUsers)
module.exports = router;
