const Router = require('express')
const router = new Router()
const sportsController = require('../controller/SportsController')


router.post("/create", sportsController.create)
router.delete('/delete/:id', sportsController.deleteSports)
router.get("/getall", sportsController.getAllSports)
router.get("/getone/:id", sportsController.getOneSports)

module.exports = router