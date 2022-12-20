const router = require("express").Router();
const tutorController = require("../controllers/tutorController");
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

router.get("/fetch/details/:TutorId", tutorController.FetchTutorById);
router.post("/update/:id",upload.single("profilePic"), tutorController.UpdateProfile);

module.exports = router;
