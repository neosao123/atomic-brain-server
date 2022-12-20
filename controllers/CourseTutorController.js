require("dotenv").config();
const coursetutorModel = require("../models/coursetutorModel");
module.exports = {
  fetchCourseTutor: async (req, res) => {
    try {
      coursetutorModel.findOne(
        {
          tutorId: { $eq: req.body.trainerId },
        },
        (err, tutor) => {
          if (err) res.status(400).send({ ErrorOccured: err });
          if (tutor) res.status(200).send({ msg: "data Found", data: tutor });
          else res.status(300).send({ msg: "No data Found" });
        }
      );
    } catch {
      res.status(200).send({ err: 500 });
    }
  },

  createCourseTutorList: async (req, res) => {
    try {
      let body = req.body;
      const coursetutor = await coursetutorModel;
      if (coursetutor) {
        const coursetutors = coursetutorModel({
          tutorId: body.tutorId,
          courseId: body.courseId,
          isActive: body.isActive,
        });

        const result = await coursetutors.save();
        return res.status(200).json({
          err: 200,
          message: "Course tutor List created successfully",
          data: result,
        });
      }
    } catch (error) {
      res.status(200).json({ err: 400, message: error.message });
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
