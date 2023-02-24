const router = require("express").Router();
const CourseTutorController = require("../controllers/CourseTutorController");

router.get("/fetchcoursetutor", CourseTutorController.fetchcourseTutorList);
router.post("/create", CourseTutorController.create);
router.post("/update", CourseTutorController.update);
router.post("/delete", CourseTutorController.delete);
router.post("/fetchdata/:courseId", CourseTutorController.fetchallcoursedetails);
router.post("/fetchtutor", CourseTutorController.fetchTutorByCourseId)
module.exports = router;

