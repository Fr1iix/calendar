const Router = require('express')
const router = new Router()
const UserInfoController = require('../controller/UserInfoController')


router.post("/create", UserInfoController.create)
router.put("/update/:id", UserInfoController.updateOne)
router.get("/getOne/:id", UserInfoController.getOneUserInfo)

module.exports = router