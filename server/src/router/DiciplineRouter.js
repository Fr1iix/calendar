const Router = require('express')
const router = new Router()
const disciplinesController = require('../controller/DiciplineController')


router.post("/create", disciplinesController.create)
router.delete('/delete/:id', disciplinesController.deleteDisciplines)
router.get("/getall", disciplinesController.getAllDisciplines)
router.get("/getone/:id", disciplinesController.getOneDisciplines)

module.exports = router