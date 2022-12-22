const router = require('express').Router();
const CourseTutorController = require("../controllers/CourseTutorController");

router.get("/fetchcoursetutor", CourseTutorController.fetchCourseTutors);
router.post("/create", CourseTutorController.create);
router.post("/update",CourseTutorController.update);

module.exports = router;

