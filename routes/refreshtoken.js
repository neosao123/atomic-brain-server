const router = require("express").Router();
const refreshTokenController = require("../controllers/refreshTokenController");

router.get("/", refreshTokenController.HandleRefreshToken);

module.exports = router;
