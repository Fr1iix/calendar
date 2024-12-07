const Router = require('express')
const router = new Router()
const roleMiddlewate = require('../middleware/roleMiddleware')
const NewsController = require('../controller/NewsController')

router.post('/creat', roleMiddlewate('admin'), NewsController.create);
router.get('/getAll',  roleMiddlewate('admin'), NewsController.getAllNews)
router.delete('/deleteNews',  roleMiddlewate('admin'), NewsController.deleteNews)
router.get('/getOne',  roleMiddlewate('admin'), NewsController.getOneNews)

module.exports = router;