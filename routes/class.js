const router = require("express").Router();

const classController = require("../controllers/classController");

router.get("/list", classController.list);

module.exports = router;
