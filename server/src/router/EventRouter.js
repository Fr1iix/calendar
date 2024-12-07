const express = require('express');
const EventController = require('../controller/EventController');

const router = express.Router();

router.get('/createJsonFile', EventController.parse)

module.exports = router;
