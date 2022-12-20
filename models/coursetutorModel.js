const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;


const CourseTutorSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "courses",
  },
  isActive: {
    type: Number,
    maxLength: 1,
    default:0
  },
  isDelete: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: null
  },
  updatedAt:{
    type:Date,
    default:null
  },
  deletedAt:{
    type:Date,
    default:null
  }
});

module.exports = mongoose.model("CourseTutor", CourseTutorSchema);
