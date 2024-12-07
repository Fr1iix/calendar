const express = require('express');
const EventController = require('../controller/EventController');

const router = express.Router();

router.get('/createJsonFile', EventController.parse)
router.post('/create', EventController.create);
router.delete('/delete/:id', EventController.deleteEvent)
router.get("/getAll", EventController.getAllEvents)
router.get("/getOne/:id", EventController.getOneEvent)

module.exports = router;
