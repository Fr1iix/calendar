const Router = require('express')
const router = new Router()
const disciplinesController = require('../controller/DiciplineController')
const authMiddleware = require('../middleware/authmiddleware')



router.get('/disciplines', disciplinesController.getAll);
router.get('/disciplines/:id', disciplinesController.getById);
router.post('/disciplines', disciplinesController.create);
router.put('/disciplines/:id', disciplinesController.update);
router.delete('/disciplines/:id', disciplinesController.remove);




module.exports = router
