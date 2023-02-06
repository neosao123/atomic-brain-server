const router = require("express").Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");

//img storage path
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/users");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});
//img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only image is allowed"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

router.route("/fetch/details/:AdminId").get(adminController.FetchAdminById);
router.post(
  "/update/:id",
  upload.single("profilePic"),
  adminController.UpdateAdminProfile
);
router.get(
  "/coursepurchasedbystudent",
  adminController.fetchCoursePurchasedByStudent
);
router.get("/studentlist", adminController.getStudents);
router.get("/courselist", adminController.getCourses);

module.exports = router;
