const mongoose = require("mongoose");
const purchasedCourse = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "courses",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  coursePrice: {
    type: Number,
    default: null,
  },
  coursePriceIncludingGST: {
    type: Number,
    default: null,
  },
  tranactionDate: {
    type: Date,
    default: null,
  },
  receiptId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    default: "success",
  },
});
module.exports = mongoose.model("newpurchasedcourse", purchasedCourse);
