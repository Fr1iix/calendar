const Router = require('express')
const router = new Router()
const UserRouter = require('./UserRouter')
const userinfoRouter = require('./UserInfoRouter')


router.use('/user', UserRouter)
router.use('/userinfo', userinfoRouter)

module.exports = router