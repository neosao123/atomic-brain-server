const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
	{
		courseId: { type: String, required: true },
		syllabusId: { type: String, unique: true },
		topicName: { type: String, default: null },
		description: { type: String, default: null },
	},
	{ timestamps: true }
);

courseSchema.index({
	syllabusId: "text",
});

module.exports = mongoose.model("coursesyllabus", courseSchema);

