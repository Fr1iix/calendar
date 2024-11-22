const Router = require('express')
const router = new Router()
const subscriptionsController = require('../controller/SubscriptionsController')
const authMiddleware = require('../middleware/authmiddleware')



router.get('/subscriptions', subscriptionsController.getAll);
router.get('/subscriptions/:id', subscriptionsController.getById);
router.post('/subscriptions', subscriptionsController.create);
router.put('/subscriptions/:id', subscriptionsController.update);
router.delete('/subscriptions/:id', subscriptionsController.remove);




module.exports = router
