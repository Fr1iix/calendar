const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const userinfoRouter = require('./userinfoRouter')
const diciplineRouter = require('./DiciplineRouter')
const eventtypeRouter = require('./EventTypeRouter')
const sportsRouter = require('./SportsRouter')
const subscriptionsRouter = require("./SubscriptionsRouter")
const pdfrouter = require("./pdfRouter")
const eventRouter = require('./EventRouter');


router.use('/user', userRouter)
router.use('/userinfo', userinfoRouter)
router.use('/dicipline', diciplineRouter)
router.use('/eventtype', eventtypeRouter)
router.use('/sports', sportsRouter)
router.use('/subscriptions', subscriptionsRouter)
router.use('/parse', pdfrouter)
router.use('/event', eventRouter);

module.exports = router