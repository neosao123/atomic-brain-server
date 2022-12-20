const mongoose = require("mongoose");
const { events } = require("./tutorWeekScheduleModel");

const eventSchema = new mongoose.Schema({
	tutorId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Users",
	},
	timeStart: {
		type: String,
		required: true,
	},
	timeEnd: {
		type: String,
		required: true,
	},
	sessionDate: {
		type: Date,
		required: true,
	},
	sessionType: {
		type: String,
		required: false,
		enum: ["FREE", "PAID"],
	},
	dayNumber: {
		type: Number,
		required: true,
	},
	dayName: {
		type: String,
		required: true,
	},
	isBooked: {
		type: Boolean,
		required: false,
		default: false,
	},
	studentId: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		ref: "Users",
	},
	sessionNo: {
		type: Number,
		required: false,
	},
	isComplete: {
		type: Boolean,
		required: false,
		default: false,
	},
});

module.exports = mongoose.model("Events", eventSchema);
