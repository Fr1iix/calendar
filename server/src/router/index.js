const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const userinfoRouter = require('./userinfoRouter')
const diciplineRouter = require('./DiciplineRouter')
const eventRouter = require('./EventRouter')
const eventtypeRouter = require('./EventTypeRouter')
const sportsRouter = require('./SportsRouter')
const subscriptionsRouter = require("./SubscriptionsRouter")


router.use('/user', userRouter)
router.use('/userinfo', userinfoRouter)
router.use('/dicipline', diciplineRouter)
router.use('/event', eventRouter)
router.use('/eventtype', eventtypeRouter)
router.use('/sports', sportsRouter)
router.use('/subscriptions', subscriptionsRouter)

module.exports = router