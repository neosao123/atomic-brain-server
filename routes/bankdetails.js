const router = require("express").Router();
const bankController = require("../controllers/bankController");

router.post("/bankdetails", bankController.create);
router.post("/bankdetails/get", bankController.getBankDetails);
module.exports = router;
