require("dotenv").config();
const { default: mongoose } = require("mongoose");
const EventModel = require("../models/eventModel");
const ratings = require("../models/ratings");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;

module.exports = {
  Fetch_Tutor_Schedule: (req, res) => {
    var query = { tutorId: req.params.id };
    EventModel.find(query, (err, data) => {
      if (err)
        return res
          .status(200)
          .send({ err: 400, message: "Failed to find the records" });
      if (data)
        return res
          .status(200)
          .send({ err: 200, msg: "Data found", data: data });
      else
        return res
          .status(200)
          .send({ err: 300, msg: "No data found", data: [] });
    });
  },

  Fetch_Schedule_Calendar: (req, res) => {
    var query = {};
    EventModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "tutorId",
          foreignField: "_id",
          as: "tutor",
        },
      },
    ]).exec((err, data) => {
      if (err)
        return res
          .status(200)
          .send({ err: 400, message: "Failed to find the records" });
      if (data && data.length > 0) {
        return res.status(200).send({
          err: 200,
          msg: "Data found",
          length: data.length,
          data: data,
        });
      }
      return res.status(200).send({ err: 300, msg: "No data found", data: [] });
    });
  },

  Truncate_Schedule_Calendar: (req, res) => {
    EventModel.findByIdAndDelete(req.params.id, (err, data) => {
      console.log(data);
      if (err)
        return res.status(200).send({ err: 300, data: "No records found" });
      if (data) return res.status(200).send({ err: 200, data: data });
      else
        return res
          .status(200)
          .send({ err: 300, msg: "No data found", data: [] });
    });
  },

  Book_a_class: async (req, res) => {
    try {
      // const { studentId, courseId, classCode, eventId, tutorId } = req.body;
      const bookedClass = await EventModel
        .find({
          isBooked: { $eq: true },
          _id: { $eq: mongoose.Types.ObjectId(req.body.eventId) },
        }).limit(1)
      if (bookedClass.length > 0) {
        res.status(200).send({ err: 300, message: "Class already Booked" })
      } else {
        const updateEvent = {
          studentId: req.body.studentId,
          courseId: mongoose.Types.ObjectId(req.body.courseId),
          classCode: req.body.classCode,
          sessionDate: req.body.sessionDate,
          isBooked: true,
        }
        const updateResult = await EventModel.findByIdAndUpdate(
          mongoose.Types.ObjectId(req.body.eventId),
          { $set: updateEvent },
          { new: true }
        );
        if (typeof updateResult === "object") {
          let ratingsData = await ratings.create({
            eventId: mongoose.Types.ObjectId(req.body.eventId),
            studentId: req.body.studentId,
            courseId: mongoose.Types.ObjectId(req.body.courseId),
            classCode: req.body.classCode,
          })
          if (ratingsData) {
            return res.status(200).send({ err: 200, message: "event table updated and ratings table created", eventData: updateResult, ratingsData: ratingsData })
          } else {
            return res.status(200).send({ err: 301, message: "error while creating data" })
          }
        }
      }
    } catch (ex) { return res.status(500).send({ err: 500, message: ex.message }); }
  },
};
