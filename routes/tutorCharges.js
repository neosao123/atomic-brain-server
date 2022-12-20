const router = require("express").Router(); 

const TutorCharges = require("../controllers/tutorChargesController");

router.post("/fetchtutorcharges", TutorCharges.fetchTutorChargesById);
router.post("/saveandupdate", TutorCharges.saveAndUpdateTutorCharges);

module.exports = router;