const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log("Inside Multer Middleware");
		cb(null, "../uploads/profilePictures");
	},
	filename: function (req, file, cb) {
		const name = Date.now() + path.extname(file.originalname);
		console.log(req);
		console.log("This is the Image Name from upload middleware", req.imageName);
		cb(null, name);
	}
})

const upload = multer({ storage: storage });

module.exports = upload;