const router = require("express").Router();
const courseController = require("../controllers/courseController");
const multer = require("multer");

//img storage path
const imgconfig = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "./uploads/courses");
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

router.post("/create", upload.single("coverimage"), courseController.create);
router.get("/list", courseController.list);
router.get("/:id", courseController.edit);
router.post("/update/:id", upload.single("coverimage"), courseController.update);
router.delete("/remove/:id", courseController.remove);

module.exports = router;
