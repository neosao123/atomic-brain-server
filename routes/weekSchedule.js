const router = require("express").Router();

const WeekSchedule = require("../controllers/tutorWeeklScheduleController");

router.post("/createslot", WeekSchedule.Create);
router.post("/fetch/tutor/slots", WeekSchedule.Fetch_Slot_By_Tutor_Id);
router.get("/readslot/:id", WeekSchedule.Read);
router.post("/updateslot/:id", WeekSchedule.Update);
router.delete("/removeslot/:id", WeekSchedule.Delete);

router.post("/createrecurringweek", WeekSchedule.createReccuringWeeklySchedule);
router.post("/deleterecurringweek", WeekSchedule.deleteRecurringWeeklySchedule);

router.get("/crone/crws", WeekSchedule.cronCreateRecurringWeekSchedule)
// create-recurring-week-schedule - crws

module.exports = router;
