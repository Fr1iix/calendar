const Router = require('express')
const router = new Router()
const subscriptionsController = require('../controller/SubscriptionsController')


router.post("/create", subscriptionsController.create)
router.delete('/delete/:id', subscriptionsController.deleteSubscriptions)
router.get("/getall", subscriptionsController.getAllSubscriptions)
router.get("/getone/:id", subscriptionsController.getOneSubscriptions)

module.exports = router