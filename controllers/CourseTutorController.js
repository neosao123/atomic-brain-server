require("dotenv").config();
const coursetutorModel = require("../models/coursetutorModel");
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
      res.status(200).json({ err: 400, message: error.message });
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
        isActive: { $eq: isActive },
      });

      if (updateTutor === null) {
        const coursetutors = await coursetutorModel({
          tutorId: tutorId,
          courseId: courseId,
          isActive: isActive,
        });

        const result = coursetutors.save();
        return res.status(200).json({
          err: 200,
          message: "Tutor updated successfully",
          data: result,
        });
      } else {
        return res.status(300).json({
          err: 300,
          message: "Tutor is not available",
        });
      }
    } catch (err) {
      res.status(200).json({ err: 400, message: err.message });
    }
  },

  fetchcourseTutorList: async (req, res) => {
    coursetutorModel
      .aggregate([
        {
          $lookup: {
            from: "users",
            // localfield: "tutorId",
            // foreignField: "_id",
            let: { tutor: "tutor" },
            pipeline: [{ $limit: 1 }],
            as: "tutor",
          },
        },
        {
          $lookup: {
            from: "courses",
            // localfield: "tutorId",
            // foreignField: "_id",
            let: { courses: "courses" },
            pipeline: [{ $limit: 1 }],
            as: "courses",
          },
        },
        {
          $project: {
            "tutor.firstName": 1,
            "tutor.lastName": 1,
            "tutor.email": 1,
            "tutor.phone": 1,
            "tutor.profilePic": 1,
            "courses.title": 1,
            isActive: 1,
          },
        },

        //$lookup: {
        //   from: "courses",
        //   // localfield: "courseId",
        //   // foreignField: "_id",
        //   let: { courses: 'courses' },
        //   pipeline: [ {$limit: 1} ],
        //   as: "courses",
        // },
        // },
        // {
        //   $project: {
        //     "tutor.firstName":   1,
        //     "tutor.lastName": 1,
        //     "tutor.email": 1,
        //     "tutor.phone": 1,
        //     // "courses.title": 1,
        //   },
        // },
      ])
      .exec((err, data) => {
        if (err) return res.status(200).send({ err: 400, message: err });
        if ((data, data.length >= 0))
          return res
            .status(200)
            .send({ err: 200, msg: "data found", data: data });
        else res.status(200).send({ err: 300, msg: "No data found", data: [] });
      });
  },
};
