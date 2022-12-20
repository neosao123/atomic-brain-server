require("dotenv").config();
const CourseModel = require("../models/courseModel");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;
const { deleteFile } = require("../utils/fileOperations");
const slugify = require("slugify");
const path = require("path");

function generateSlug(title) {
	var slug = slugify(title);
	slug = slug.toLowerCase();
	const course = CourseModel.find({
		slug: { $eq: slug },
	}).count();
	if (course > 0) {
		const len = course + 1;
		generateSlug(title + " " + len);
	}
	return slug;
}

module.exports = {
	create: async (req, res) => {
		try {
			const { title, shortDescription, description, type, price } = req.body;
			const slug = generateSlug(title);
			const course = new CourseModel({
				title: title,
				slug: slug,
				shortDescription: shortDescription,
				description: description,
				type: type,
				price: price,
			});
			if (req.file != undefined) {
				let { filename } = req.file;
				course.image = filename;
			} else {
				course.image = "";
			}
			const result = await course.save();
			return res.status(200).json({ err: 200, message: "Course created successfully", data: result });
		} catch (error) {
			res.status(200).json({ err: 400, message: error.message });
		}
	},
	list: async (req, res) => {
		try {
			const data = await CourseModel.find({ isDelete: false }).sort({ createdAt: -1 }).exec();
			console.log(process.env.IMAGE_URL);
			const image_url = process.env.IMAGE_URL + "/uploads/courses/";
			data.forEach((element) => {
				element.image = element.image ? image_url + element.image : "";
			});
			return res.status(200).send({ err: 200, message: "Data Found", data: data });
		} catch (error) {
			res.status(500).send("Failed to get course list.");
		}
	},
	edit: async (req, res) => {
		try {
			const course = await CourseModel.findById(req.params.id);
			const image_url = process.env.IMAGE_URL + "/uploads/courses/";
			course.image = course.image ? image_url + course.image : "";
			return res.status(200).json({ err: 200, message: "Data found", data: course });
		} catch (error) {
			res.status(200).json({ err: 300, message: "No Data Found" });
		}
	},
	update: async (req, res) => {
		try {
			const oldCourse = await CourseModel.findById(req.params.id);
			const imageName = oldCourse.image;
			if (req.file !== undefined) {
				if (imageName != "") {
					deleteFile(path.resolve(__dirname, "../uploads/courses/" + imageName));
				}
			}
			const { title, shortDescription, description, type, price } = req.body;
			const slug = generateSlug(title);
			const updateData = {
				title: title,
				shortDescription: shortDescription,
				description: description,
				slug: slug,
				type: type,
				price: price,
			};
			if (req.file != undefined) {
				let { filename } = req.file;
				updateQuery.image = filename;
			}
			const course = await CourseModel.findOneAndUpdate({ _id: req.params.id }, { $set: updateData }, { new: true });
			return res.status(200).json({ err: 200, message: "Course updated successfully", data: course });
		} catch (error) {
			res.status(200).json({ err: 300, message: error.message });
		}
	},
	remove: async (req, res) => {
		try {
			const course = await CourseModel.findOneAndUpdate({ _id: req.params.id }, { $set: { isDelete: true } });
			/*
            const imageName = course.image;
			if (imageName != "") {
				deleteFile(path.join(__dirname, "../uploads/courses/" + imageName));
			}
            */
			return res.status(200).json({ err: 200, message: "Course deleted successfully" });
		} catch (error) {
			res.status(400).send("Failed to delete course.");
		}
	},
};
