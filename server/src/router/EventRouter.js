const Router = require('express')
const router = new Router()
const eventsController = require('../controller/EventController')
const authMiddleware = require('../middleware/authmiddleware')



router.get('/events', eventsController.getAll);
router.get('/events/:id', eventsController.getById);
router.post('/events', eventsController.create);
router.put('/events/:id', eventsController.update);
router.delete('/events/:id', eventsController.remove);




module.exports = router
