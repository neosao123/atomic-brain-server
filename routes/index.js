const path = require("path");
const router = require("express").Router();
const refreshTokenRoutes = require("./refreshtoken");
const userRoutes = require("./user");
const syllabusRoutes = require("./syllabus");
const classRoutes = require("./class");
const courseRoutes = require("./course");
const weekScheduleRoutes = require("./weekSchedule");
const eventRoutes = require("./events");
const tutorRoutes = require("./tutor");
const studentRoutes = require("./student");
const adminRoutes = require("./admin");
const middleware = require("../middleware/auth");
const tutorCharges = require("./tutorCharges");
const courseTutorList = require("./courseTutorList");
const purchasedCourse = require("./purchasedCourse");
// API routes
router.use("/api/refreshtoken", refreshTokenRoutes);
router.use("/api/users", userRoutes);
router.use("/api/course", courseRoutes);
router.use("/api/syllabus", syllabusRoutes);
router.use("/api/class", classRoutes);
router.use("/api/weekschedule", weekScheduleRoutes);
router.use("/api/events", eventRoutes);
router.use("/api/tutor", tutorRoutes);
router.use("/api/student", studentRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/admin/tutorcharges", tutorCharges);
router.use("/api/admin/coursetutor", courseTutorList);
router.use("/api/student/coursetutor", courseTutorList);
router.use("/api/student", purchasedCourse);
router.use("/api/tutor", purchasedCourse);
// If no API routes are hit, send the React app

router.use(function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
