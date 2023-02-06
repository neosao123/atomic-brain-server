const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
const upload = require('../utils/profilePic');

router.route("/signup").post(userController.CreateUser);
router.route("/signin").post(userController.LoginUser);
router.route("/check").get(verifyJWT,userController.CheckUser);
router.route("/approve/:UserId").post(verifyJWT, userController.ApproveUser);
router.route("/delete/:UserId").post(userController.DeleteUser);
router.route("/fetch/details/:UserId").get( userController.FetchUserById);
router.route("/fetch/users").get(userController.FetchUsers);
router.route("/verify").get(userController.VerifyEmail);
router.route("/sendVerificationEmail").post(userController.SendVerificationEmail);
router.route("/updateprofile").post(userController.UpdateProfile);
router.route("/updatepassword").post(userController.UpdatePassword);
module.exports = router;
 