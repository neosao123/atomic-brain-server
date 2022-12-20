const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const verifySchema = new mongoose.Schema(
	{
		token: { type: String },
		email: { type: String },
		mobile: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("verify", verifySchema);
