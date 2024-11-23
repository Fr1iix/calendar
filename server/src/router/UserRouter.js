const Router = require('express')
const router = new Router()
const userController = require('../controller/UserController')
const authMiddleware = require('../middleware/authmiddleware')



router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/email', userController.getAllUserEmails)



module.exports = router
