const Router = require('express')
const router = new Router()
const userController = require('../controller/UserController')
const authMiddleware = require('../middleware/authmiddleware')
const roleMiddleware = require('../middleware/roleMiddleware');



router.post('/registration', userController.registration)
router.post('/activate', userController.activateAccount);
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/email', userController.getAllUserEmails)

router.get('/admin', [authMiddleware, roleMiddleware('admin')], userController.adminPanel);


module.exports = router
