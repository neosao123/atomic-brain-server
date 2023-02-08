require("dotenv").config();
const { default: mongoose } = require("mongoose");
const EventModel = require("../models/eventModel");
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
};
