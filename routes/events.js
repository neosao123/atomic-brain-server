const router = require("express").Router();
const eventsController = require("../controllers/eventsController");

router.get("/tutor/schedule/:id", eventsController.Fetch_Tutor_Schedule);
router.get("/schedule", eventsController.Fetch_Schedule_Calendar);
router.get("/truncateevents/:id", eventsController.Truncate_Schedule_Calendar);
router.post("/sudent/bookaclass", eventsController.Book_a_class);
module.exports = router;
