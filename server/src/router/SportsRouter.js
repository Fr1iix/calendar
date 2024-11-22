const Router = require('express')
const router = new Router()
const sportsController = require('../controller/SportsController')
const authMiddleware = require('../middleware/authmiddleware')



router.get('/sports', sportsController.getAll);
router.get('/sports/:id', sportsController.getById);
router.post('/sports', sportsController.create);
router.put('/sports/:id', sportsController.update);
router.delete('/sports/:id', sportsController.remove);




module.exports = router
