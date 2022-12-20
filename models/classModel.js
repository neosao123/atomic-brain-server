const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const ClassSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		course: { type: ObjectId, ref: "course", required: true },
		classCode: { type: String },
		studentCode: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("class", ClassSchema);
