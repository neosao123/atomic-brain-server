const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
	{
		uuid: {
			type: String
		},
		role: {
			type: String,
			default: "student"
		},
		firstName: {
			type: String,
			default: null
		},
		lastName: {
			type: String,
			default: null
		},
		gender: {
			type: String
		},
		dob: {
			type: Date,
			default: null
		},
		email: {
			type: String,
			unique: true
		},
		password: {
			type: String
		},
		phone: {
			type: String,
			default: ""
		},
		parentName: {
			type: String,
			default: ""
		},
		parentContact: {
			type: String,
			default: ""
		},
		emailVerified: {
			type: Number,
			default: "0"
		},
		about: {
			type: String,
			default: null
		},
		profilePic: {
			type: String
		},
		isApproved: {
			type: Number,
			maxLength: 1,
			default: "0"
		},
		approvedDate: {
			type: Date,
			default: null
		},
		otp: {
			type: Number,
			maxLength: 6,
			default: null
		},
		isBlocked: {
			type: Number,
			default: "0"
		},
		lastLoginDate: {
			type: Date,
			default: null
		},
		facebookUrl: {
			type: String,
			default: null
		},
		linkedinUrl: {
			type: String,
			default: null
		},
		instagramUrl: {
			type: String,
			default: null
		},
		youtubeUrl: {
			type: String,
			default: null
		},
		refreshToken: [],
	},
	{ timestamps: true }
);

userSchema.index({
	uuid: "text",
	email: "text",
	phone: "text",
});

module.exports = mongoose.model("Users", userSchema);
