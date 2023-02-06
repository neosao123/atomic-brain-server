const mongoose = require("mongoose");
const purchasedSyllabus = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "purchasedcourse",
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  syllabusCode: {
    type: String,
    required: true,
  },
  syllabusTitle: {
    type: String,
    required: false,
  },
  syllabusDescription: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("purchasedsyllyabus", purchasedSyllabus);
