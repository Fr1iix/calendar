const Router = require('express')
const router = new Router()
const AddressController = require("../controller/AddressController");

router.post('/create', AddressController.create)
router.delete('/delete/:id', AddressController.deleteAddress)
router.get("/getAll", AddressController.getAllAddresses)
router.get("/getOne/:id", AddressController.getOneAddress)

module.exports = router;