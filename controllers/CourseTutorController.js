require("dotenv").config();
const mongoose = require("mongoose");
const courseModel = require("../models/courseModel");
const coursetutorModel = require("../models/coursetutorModel");
const purchasedCoursesModel = require("../models/purchasedCoursesModel");
const syllabusModel = require("../models/syllabusModel");

module.exports = {
  fetchCourseTutors: async (req, res) => {
    try {
      coursetutorModel.find((err, tutor) => {
        if (err) res.status(400).send({ ErrorOccured: err });
        if (tutor) res.status(200).send({ msg: "data Found", data: tutor });
        else res.status(300).send({ msg: "No data Found" });
      });
    } catch {
      res.status(200).send({ err: 500 });
    }
  },

  create: async (req, res) => {
    try {
      let body = req.body;
      tutorId = body.tutorId;
      courseId = body.courseId;

      const coursetutor = await coursetutorModel.findOne({
        tutorId: { $eq: tutorId },
        courseId: { $eq: courseId },
      });

      if (coursetutor === null) {
        const coursetutors = new coursetutorModel({
          tutorId: tutorId,
          courseId: courseId,
          isActive: body.isActive,
          createdAt: Date(),
        });

        const result = await coursetutors.save();
        return res.status(200).json({
          err: 200,
          message: "Tutor assigned successfully",
          data: result,
        });
      } else {
        res.status(300).json({
          err: 300,
          message: "Tutor is already assigned for this course",
        });
      }
    } catch (error) {
      res.status(200).json({ err: 500, message: error });
    }
  },

  update: async (req, res) => {
    try {
      let body = req.body;
      tutorId = body.tutorId;
      courseId = body.courseId;
      isActive = body.isActive;
      _id = body._id;
      const updateTutor = await coursetutorModel.findOne({
        _id: { $ne: _id },
        tutorId: { $eq: tutorId },
        courseId: { $eq: courseId },
      });

      if (updateTutor === null) {
        const coursetutors = await coursetutorModel.findByIdAndUpdate(
          _id,
          {
            $set: {
              tutorId: tutorId,
              courseId: courseId,
              isActive: isActive,
              updatedAt: Date(),
            },
          },
          { new: true }
        );
        return res.status(200).json({
          err: 200,
          message: "Tutor updated successfully",
          data: coursetutors,
        });
      } else {
        return res.status(200).json({
          err: 300,
          message: "Tutor is not available",
        });
      }
    } catch (err) {
      res.status(200).json({ err: 500, message: err.message });
    }
  },

  fetchcourseTutorList: async (req, res) => {
    try {
      const data = await coursetutorModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "tutorId",
            foreignField: "_id",
            as: "tutor",
          },
        },
        {
          $unwind: {
            path: "$tutor",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            _id: 1,
            courseId: 1,
            courseTitle: "$course.title",
            courseType: "$course.type",
            coursePrice: "$course.price",
            coursePic: "$course.image",
            courseShortDesc: "$course.shortDescription",
            courseDesc: "$course.description",
            courseSlug: "$course.slug",
            tutorId: 1,
            tutorName: {
              $concat: ["$tutor.firstName", " ", "$tutor.lastName"],
            },
            tutorEmail: "$tutor.email",
            tutorPicture: "$tutor.profilePic",
            tutorMobile: "$tutor.phone",
            isActive: 1,
            updatedAt: 1,
          },
        },
      ]);

      if (data !== null) {
        return res.status(200).send({
          err: 200,
          msg: "Data found",
          count: data.length,
          data: data,
        });
      } else {
        return res.status(200).send({ err: 300, msg: "No data found" });
      }
    } catch (error) {
      return res.status(200).send({ err: 500, msg: error.toString() });
    }
  },

  delete: async (req, res) => {
    try {
      coursetutorModel.findByIdAndDelete(req.body._id, (err, data) => {
        if (err) res.status(400).send({ ErrorOccured: err });
        if (data)
          res.status(200).send({ err: 200, msg: "Deleted Successfully" });
        else res.status(300).send({ err: 200, msg: "No record exists" });
      });
    } catch (ex) {
      return res.status(500).send({ msg: ex.message });
    }
  },

  filterCourseTutorList: async (req, res) => {
    try {
      const data = await coursetutorModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "tutorId",
            foreignField: "_id",
            as: "tutor",
          },
        },
        {
          $unwind: {
            path: "$tutor",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            _id: 1,
            courseId: 1,
            courseTitle: "$course.title",
            courseType: "$course.type",
            coursePrice: "$course.price",
            coursePic: "$course.image",
            courseShortDesc: "$course.shortDescription",
            courseDesc: "$course.description",
            courseSlug: "$course.slug" ?? null,
            tutorId: 1,
            tutorName: {
              $concat: ["$tutor.firstName", " ", "$tutor.lastName"],
            },
            tutorEmail: "$tutor.email",
            tutorPicture: "$tutor.profilePic",
            tutorMobile: "$tutor.phone",
            isActive: 1,
            updatedAt: 1,
          },
        },
      ]);

      if (data !== null) {
        return res.status(200).send({
          err: 200,
          msg: "Data found",
          count: data.length,
          data: data,
        });
      } else {
        return res.status(200).send({ err: 300, msg: "No data found" });
      }
    } catch (error) {
      return res.status(200).send({ err: 500, msg: error.toString() });
    }
  },

  fetchallcoursedetails: async (req, res) => {
    try {
      let courseId = req.params.courseId;
      var coursedata = await courseModel.findById(courseId);
      if (coursedata) {
        const syllabus = await syllabusModel.find(
          {
            courseId: { $eq: courseId },
          },
          {
            _id: 1,
            topicName: 1,
            description: 1,
          }
        );

        const tutors = await coursetutorModel.aggregate([
          {
            $match: {
              isActive: 1,
              courseId: mongoose.Types.ObjectId(courseId),
            },
          },  
          {
            $lookup: {
              from: "courses",
              localField: "courseId",
              foreignField: "_id",
              as: "course",
            },
          },
          {
            $unwind: {
              path: "$course",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "tutorId",
              foreignField: "_id",
              as: "tutor",
            },
          },
          {
            $unwind: {
              path: "$tutor",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $project: {
              tutorId: 1,
              tutorName: {
                $concat: ["$tutor.firstName", " ", "$tutor.lastName"],
              },
              tutorEmail: "$tutor.email",
              tutorPicture: "$tutor.profilePic",
              tutorMobile: "$tutor.phone",
              isActive: 1,
              updatedAt: 1,
            },
          },
        ]);

        var alreadyBought = 0;
        // db query an courseId = post.courseId  & studentId = post.studentId  & paymentStatus= "success"
        let purchasedCourse = await purchasedCoursesModel.find({
          courseId: { $eq: req.params.courseId },
          studentId: { $eq: req.body.studentId },
          paymentStatus: "success",
        });

        if (purchasedCourse.length > 0) {
          alreadyBought = 1;
        } else {
          alreadyBought = 0;
        }

        var data = {
          courseId: coursedata._id,
          description: coursedata.description,
          courseImage: coursedata.image,
          shortdescription: coursedata.shortDescription,
          title: coursedata.title,
          price: coursedata.price ?? "0",
          type: coursedata.type,
          syllabus: syllabus,
          tutor: tutors,
          alreadyBought: alreadyBought,
        };
        res.status(200).send({ err: 200, msg: "data found", data: data });
      }
    } catch (ex) {
      return res.status(200).send({ err: 500, msg: ex.message });
    }
  },

};
