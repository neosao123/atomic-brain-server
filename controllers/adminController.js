require("dotenv").config();
const userModel = require("../models/userModel");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;
const { deleteFile } = require("../utils/fileOperations");
const fs = require("fs");
const purchasedCoursesModel = require("../models/purchasedCoursesModel");
const { default: mongoose } = require("mongoose");

module.exports = {
  // Fetch Admin by Id
  FetchAdminById: (req, res) => {
    userModel.findById(req.params.AdminId, (err, admin) => {
      if (err) res.status(400).send({ ErrorOccured: err });
      if (admin) res.status(200).send({ msg: "Data found", data: admin });
      else res.status(300).send({ msg: "No data found" });
    });
  },

  UpdateAdminProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const { gender } = req.body;

      const user = await userModel
        .find({
          email: { $eq: userData.email },
          _id: { $ne: userId },
        })
        .limit(1);
      if (user.length > 0) {
        return res.status(200).send({
          err: 300,
          message:
            "This email-id has already been used. Please try with another email-id",
        });
      }

      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        dob: userData.dob,
        email: userData.email,
        phone: userData.phone,
      };

      if (req.file != undefined) {
        let { filename } = req.file;
        updateData.profilePic = filename;
      }

      const updateResult = await userModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      );
      if (typeof updateResult === "object") {
        return res.status(200).send({
          err: 200,
          message: "Profile updated successfully",
          data: updateResult,
        });
      }
      return res.status(200).send({
        err: 300,
        message: "No changes where found to update.",
        data: updateResult,
      });
    } catch (ex) {
      return res.status(500).send({ err: 500, message: ex.message });
    }
  },

  fetchCoursePurchasedByStudent: async (req, res) => {
    // if (
    //   req.query.courseId !== null &&
    //   req.query.studentId === null &&
    //   req.query.paymentStatus === null
    // ) {
    //   var matchStr = {
    //     $match: {
    //       courseId: { $eq: mongoose.Types.ObjectId(req.query.courseId) },
    //     },
    //   };
    // } else if (
    //   req.query.courseId === null &&
    //   req.query.studentId !== null &&
    //   req.query.paymentStatus === null
    // ) {
    //   var matchStr = {
    //     $match: {
    //       studentId: { $eq: mongoose.Types.ObjectId(req.query.studentId) },
    //     },
    //   };
    // } else if (
    //   req.query.courseId === null &&
    //   req.query.studentId === null &&
    //   req.query.paymentStatus !== null
    // ) {
    //   var matchStr = {
    //     $match: {
    //       $eq: req.query.paymentStatus,
    //     },
    //   };
    // } else if (
    //   req.query.courseId !== null &&
    //   req.query.studentId !== null &&
    //   req.query.paymentStatus === null
    // ) {
    //   var matchStr = {
    //     $match: {
    //       studentId: { $eq: mongoose.Types.ObjectId(req.query.studentId) },
    //       courseId: { $eq: mongoose.Types.ObjectId(req.query.courseId) },
    //     },
    //   };
    // } else if (
    //   req.query.courseId === null &&
    //   req.query.studentId !== null &&
    //   req.query.paymentStatus !== null
    // ) {
    //   var matchStr = {
    //     $match: {
    //       studentId: { $eq: mongoose.Types.ObjectId(req.query.studentId) },
    //       paymentStatus: { $eq: req.query.paymentStatus },
    //     },
    //   };
    // } else if (
    //   req.query.courseId !== null &&
    //   req.query.studentId === null &&
    //   req.query.paymentStatus !== null
    // ) {
    //   var matchStr = {
    //     $match: {
    //       studentId: { $eq: mongoose.Types.ObjectId(req.query.studentId) },
    //       paymentStatus: { $eq: req.query.paymentStatus },
    //     },
    //   };
    // } else if (
    //   req.query.courseId !== null &&
    //   req.query.studentId !== null &&
    //   req.query.paymentStatus !== null
    // ) {
    //   var matchStr = {
    //     $match: {
    //       studentId: { $eq: mongoose.Types.ObjectId(req.query.studentId) },
    //       courseId: { $eq: mongoose.Types.ObjectId(req.query.courseId) },
    //       paymentStatus: { $eq: req.query.paymentStatus },
    //     },
    //   };
    // } else if (
    //   req.query.courseId === null &&
    //   req.query.studentId === null &&
    //   req.query.paymentStatus === null
    // ) {
    //   var matchStr = {
    //     $match: {
    //       studentId: "",
    //       courseId: "",
    //       paymentStatus: "",
    //     },
    //   };
    // }

    let data = await purchasedCoursesModel.aggregate([
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
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: {
          path: "$student",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          studentId: 1,
          courseId: 1,
          coursename: "$course.title",
          studentname: {
            $concat: ["$student.firstName", " ", "$student.lastName"],
          },
          tranactionDate: 1,
          coursePrice: 1,
          coursePriceIncludingGST: 1,
          coursePriceIncludingGST: 1,
          paymentStatus: 1,
        },
      },
    ]);

    // let filteredData = data.filter(
    //   (d) => d.courseId.toString() === req.query.courseId
    // );

    // console.log(filteredData);

    if (data !== null) {
      return res.status(200).send({ err: 200, data: data });
    } else {
      return res.status(200).send({ err: 300, data: "No data found" });
    }
  },

  getStudents: async (req, res) => {
    let data = await purchasedCoursesModel
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "studentId",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $unwind: {
            path: "$student",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            studentId: 1,
            studentname: {
              $concat: ["$student.firstName", " ", "$student.lastName"],
            },
          },
        },
      ])
      .limit(10);
    if (data !== null) {
      return res.status(200).send({ err: 200, no: data.length, data: data });
    } else {
      return res.status(200).send({ err: 300, data: "No data found" });
    }
  },

  getCourses: async (req, res) => {
    let data = await purchasedCoursesModel
      .aggregate([
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
            localField: "studentId",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $unwind: {
            path: "$student",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            courseId: 1,
            coursename: "$course.title",
          },
        },
      ])
      .limit(10);
    if (data !== null) {
      return res.status(200).send({ err: 200, data: data });
    } else {
      return res.status(200).send({ err: 300, data: "No data found" });
    }
  },
};
