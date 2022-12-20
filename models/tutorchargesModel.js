const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const TutorChargesSchema = new mongoose.Schema({
  tutorId: {
    type: String,
    required:true
  },
  paidClassCharge: {
    type: Number,
  },
  freeClassCharge: {
    type: Number,
  },
  paidClassPenalty: {
    type: Number,
  },
  freeClassPenalty: {
    type: Number,
  },
  maxPaidSkipCount: {
    type: Number,
  },
  maxFreeSkipCount: {
    type: Number,
  },
});

module.exports = mongoose.model("TutorCharges", TutorChargesSchema);
