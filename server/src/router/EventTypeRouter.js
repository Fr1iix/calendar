const Router = require('express')
const router = new Router()
const eventtypesController = require('../controller/EventTypesController')


router.post("/create", eventtypesController.create)
router.delete('/delete/:id', eventtypesController.deleteEventTypes)
router.get("/getall", eventtypesController.getAllEventTypes)
router.get("/getone/:id", eventtypesController.getOneEventTypes)

module.exports = router