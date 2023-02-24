const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const RatingSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Events"
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users",
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "courses"
        },
        classCode: {
            type: String
        },
        status: {
            type: String,
            req: false,
            default: "INCOMPLETE"
        }
    }
);

module.exports = mongoose.model("Ratings", RatingSchema);
