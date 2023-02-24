const mongoose = require("mongoose");
const BankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  bankName: { type: String, default: "", required: true },
  accountName: { type: String, default: "", required: true },
  ifsc: { type: String, default: "" },
  accountNumber: { type: String, default: "", required: true },
});

module.exports = mongoose.model("Bankdetails", BankSchema);
