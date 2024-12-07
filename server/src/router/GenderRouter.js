const Router = require('express')
const router = new Router()
const GenderController = require("../controller/GenderController");

router.post("/create", GenderController.create)
router.delete('/delete/:id', GenderController.deleteGender)
router.get("/getAll", GenderController.getAllSports)
router.get("/getOne/:id", GenderController.getOneSports)
router.post('/getGenderFromEvents', GenderController.createFromJson)


module.exports = router;