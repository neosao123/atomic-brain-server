const router = require('express').Router();
const CourseTutorController = require("../controllers/CourseTutorController");

router.post("/create", CourseTutorController.createCourseTutorList);
// router.post("/fetchcoursetutor", CourseTutorController.fetchCourseTutor);
router.get("/fetchcoursetutorlist", CourseTutorController.fetchcourseTutorList);


module.exports = router;

