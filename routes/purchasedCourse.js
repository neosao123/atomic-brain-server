const router = require("express").Router();

const purchasedCourse = require("../controllers/purchasedCourseController");

router.post("/coursepurchase", purchasedCourse.coursePurchase);
router.get("/trash", purchasedCourse.truncate);
router.post(
  "/coursepurchaselist",
  purchasedCourse.getListCoursePurchasedByStudent
);
// router.get("/soldcourses/:tutorId", purchasedCourse.fetchCourseSoldOftutor);
module.exports = router;
