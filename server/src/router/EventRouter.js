const Router = require('express')
const router = new Router()
const eventController = require('../controller/EventController')


router.post("/create", eventController.create)
router.delete('/delete/:id', eventController.deleteEvent)
router.get("/getall", eventController.getAllEvent)
router.get("/getone/:id", eventController.getOneEvent)

module.exports = router