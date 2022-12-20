const router = require("express").Router();
const studentController = require("../controllers/studentController");
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
router.get("/fetch/details/:StudentId",studentController.fetchStudentById);
router.post("/update/:id", upload.single("profilePic"), studentController.UpdateProfile);

module.exports = router;
