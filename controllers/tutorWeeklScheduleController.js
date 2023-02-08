require("dotenv").config();
const TutorWeekScheduleModel = require("../models/tutorWeekScheduleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;
const eventModel = require("../models/eventModel");

module.exports = {
  Create: (req, res) => {
    try {
      const { tutorId, dayNumber, dayName, timeStart, timeEnd } = req.body;
      const TimeSlotSave = new TutorWeekScheduleModel({
        tutorId: tutorId,
        dayName: dayName,
        dayNumber: dayNumber,
        timeStart: timeStart,
        timeEnd: timeEnd,
        sessionType: "FREE",
      });
      TimeSlotSave.save()
        .then((result) => {
          var date = new Date();
          var startDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );
          var endDate = new Date(
            date.getFullYear(),
            date.getMonth() + 2,
            date.getDate()
          );
          var dates = [];
          var currentDate = startDate;
          while (currentDate <= endDate) {
            if (currentDate.getDay() == dayNumber) {
              dates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          dates.forEach(async (date) => {
            // create events for each particular week day on the dates
            const newEvent = new eventModel({
              tutorId: tutorId,
              timeStart: timeStart,
              timeEnd: timeEnd,
              sessionDate: date,
              sessionType: "FREE",
              dayNumber: dayNumber,
              dayName: dayName,
            });
            await newEvent.save();
          });

          return res
            .status(200)
            .send({ err: 200, message: "Time slot added successfully" });
        })
        .catch((ex) => {
          console.log(ex);
          return res
            .status(200)
            .send({ err: 300, message: "Failed to add time slot" });
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  Update: (req, res) => {
    try {
      TutorWeekScheduleModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      )
        .then((result) => {
          return res
            .status(200)
            .send({ err: 200, message: "Time slot updated successfully" });
        })
        .catch((ex) => {
          return res
            .status(200)
            .send({ err: 300, message: "Failed to add time slot" });
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  Read: (req, res) => {
    try {
      TutorWeekScheduleModel.findById(req.params.id, (err, data) => {
        if (err)
          return res
            .status(200)
            .send({ err: 400, message: "No time slot found" });
        if (data) {
          console.log(data);
          res.status(200).send({ err: 200, message: "Data found", data: data });
        } else res.status(200).send({ err: 300, message: "No record found" });
      });
    } catch (error) {
      res.status(404).send("Failed to get course.");
    }
  },
  Delete: (req, res) => {
    try {
      TutorWeekScheduleModel.findByIdAndRemove(req.params.id, (err, data) => {
        if (err)
          return res
            .status(200)
            .send({ err: 400, message: "Failed to take action" });
        return res
          .status(200)
          .send({ err: 200, message: "Removed Successfully" });
      });
    } catch (ex) {
      return res.status(500).send({ msg: ex.message });
    }
  },
  Fetch_Slot_By_Tutor_Id: (req, res) => {
    var query = { tutorId: req.body.tutorId };
    TutorWeekScheduleModel.find(query, (err, data) => {
      if (err)
        return res
          .status(200)
          .send({ err: 400, message: "Failed to find the records" });
      if (data) return res.status(200).send({ msg: "Data found", data: data });
      else return res.status(200).send({ msg: "No user found", data: [] });
    });
  },
  createReccuringWeeklySchedule: async (req, res) => {
    // Create Recurring schedule for two months from now, for same week day
    try {
      const { tutorId, dayNumber, dayName, timeStart, timeEnd, sessionType } =
        req.body;

      const newWeekSchedule = new TutorWeekScheduleModel({
        tutorId: tutorId,
        dayName: dayName,
        dayNumber: dayNumber,
        timeStart: timeStart,
        timeEnd: timeEnd,
        sessionType: sessionType,
      });
      await newWeekSchedule.save();

      var date = new Date();
      var startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      var endDate = new Date(
        date.getFullYear(),
        date.getMonth() + 2,
        date.getDate()
      );

      var dates = [];
      var currentDate = startDate;
      while (currentDate <= endDate) {
        if (currentDate.getDay() == dayNumber) {
          dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      var query = {};
      let newEvent;
      dates.forEach(async (date) => {
        // create events for each particular week day on the dates
        // filter data
        newEvent = new eventModel({
          tutorId: tutorId,
          timeStart: timeStart,
          timeEnd: timeEnd,
          sessionDate: date,
          sessionType: sessionType,
          dayNumber: dayNumber,
          dayName: dayName,
        });

        await newEvent.save();
      });
      return res.status(200).send({ message: "Time slot added successfully" });
    } catch (err) {
      res.status(500).send({ msg: "Internal Server Error", err: err });
    }
  },
  deleteRecurringWeeklySchedule: async (req, res) => {
    // Delete Recurring schedule; only the non booked one's will be deleted
    try {
      const { tutorId, dayNumber, timeStart, timeEnd } = req.body;
      const date = new Date();
      // delete the time slot from the tutor week schedule
      var startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 14
      );
      var endDate = new Date(
        date.getFullYear(),
        date.getMonth() + 2,
        date.getDate()
      );
      var dates = [];
      var currentDate = startDate;
      while (currentDate <= endDate) {
        if (currentDate.getDay() == dayNumber) {
          dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      dates.forEach(async (date) => {
        const event = await eventModel.findOne({
          tutorId: tutorId,
          dayNumber: dayNumber,
          timeStart: timeStart,
          timeEnd: timeEnd,
          sessionDate: date,
        });
        if (event != undefined && event.isBooked === false) {
          await eventModel.findOneAndDelete({
            tutorId: tutorId,
            dayNumber: dayNumber,
            timeStart: timeStart,
            timeEnd: timeEnd,
            sessionDate: date,
          });
        }
      });
      await TutorWeekScheduleModel.findOneAndDelete({
        tutorId: tutorId,
        dayNumber: dayNumber,
        timeStart: timeStart,
        timeEnd: timeEnd,
      });
      return res
        .status(200)
        .send({ message: "Time slot removed successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: "Internal Server Error" });
    }
  },
  cronCreateRecurringWeekSchedule: async (req, res) => {
    // consider all tutorsweekly schdule and create recurring schedule for two weeks from now
    try {
      const tutors = await TutorWeekScheduleModel.find({ $eq: req.params.id });
      tutors.forEach(async (tutor) => {
        var date = new Date();
        var startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        var endDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 14
        );
        var dates = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
          if (currentDate.getDay() == tutor.dayNumber) {
            dates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        dates.forEach(async (date) => {
          // create events for each particular week day on the dates
          const newEvent = new eventModel({
            tutorId: tutor.tutorId,
            timeStart: tutor.timeStart,
            timeEnd: tutor.timeEnd,
            sessionDate: date,
            sessionType: tutor.sessionType,
            dayNumber: tutor.dayNumber,
            dayName: tutor.dayName,
          });
          await newEvent.save();
        });
      });
      return res.status(200).send({ message: "Time slot added successfully" });
    } catch (err) {
      res.status(500).send({ msg: "Internal Server Error" });
    }
  },
};
