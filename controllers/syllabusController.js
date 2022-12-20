require("dotenv").config();
const SyllabusModel = require("../models/syllabusModel");
const CourseModel = require("../models/courseModel");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;

module.exports = {
	list: async (req, res) => {
		try {
			var query = { courseId: req.query.courseId };
			SyllabusModel.find(query, (err, data) => {
				if (err) return res.status(200).send({ err: 400, message: "Failed to find the records" });
				if (data) return res.status(200).send({ msg: "Data found", data: data });
				else return res.status(200).send({ msg: "No user found", data: [] });
			});
		} catch (error) {
			res.status(400).send("Failed to get Syllabus list.");
		}
	},
	create: async (req, res) => {
		try {
			const { courseId, topicName, description } = req.body;
			CourseModel.findById(courseId, function (err, courseDoc) {
				if (err) return res.status(400).json({ message: "No course found..." });
				var courseTitle = courseDoc.title;
				var title = courseTitle.split(" ");
				var prefix = "";
				title.forEach((element) => {
					prefix += element.charAt(0).toUpperCase();
				});
				SyllabusModel.countDocuments({ courseId: courseId }, function (err, numofDocs) {
					var classCode = prefix + "_" + (numofDocs + 1);
					const syllabus = {
						topicName: topicName,
						description: description,
						courseId: courseId,
						syllabusId: classCode,
					};
					SyllabusModel.create(syllabus, function (err, doc) {
						if (err) return res.status(400).json({ message: err.message });
						return res.status(200).json({ message: "Insert successful" });
					});
				});
			});
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	},
	edit: async (req, res) => {
		console.log("From Syllabus Edit Controller");
		try {
			const syllabus = await SyllabusModel.findById(req.params.id);
			return res.status(200).json({ message: "Data found", data: syllabus });
		} catch (error) {
			res.status(400).send("Failed to get syllabus.");
		}
	},
	update: (req, res) => {
		console.log("From Syllabus Update Controller", req.body);

		console.log(req.body.updateData.topicName);
		try {
			const data = {
				courseId: req.body.updateData.courseId,
				topicName: req.body.updateData.topicName,
                description: req.body.updateData.description,
			};
			SyllabusModel.updateOne({ _id: req.params.id }, data, function (err, rest) {
				if (err) return res.status(400).json({ message: "Failed to update" });
				return res.status(200).json({ message: "Update Successfull", updates: rest.modifiedCount });
			});
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
	remove: async (req, res) => {
		try {
			const syllabus = await SyllabusModel.findOneAndDelete({ _id: req.params.id });
			res.status(200).json({ syllabus });
		} catch (error) {
			res.status(400).send("Failed to delete syllabus.");
		}
	},
};
