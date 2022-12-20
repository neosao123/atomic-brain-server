const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CourseSchema = new mongoose.Schema(
	{
		tutorId: {
			type: String,
			required: true,
		},
		dayNumber: {
			type: Number,
			required: true,
			default: 1,
		},
		dayName: {
			type: String,
			required: true,
			default: "MONDAY",
		},
		timeStart: {
			type: String,
			required: true,
			default: "9:00 AM",
		},
		timeEnd: {
			type: String,
			required: true,
			default: "10:00 AM",
		},
		sessionType: {
			type: String,
			required: true,
			enum: ["FREE", "PAID"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("TutorWeekSchedule", CourseSchema);
