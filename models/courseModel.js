const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("course", CourseSchema);
