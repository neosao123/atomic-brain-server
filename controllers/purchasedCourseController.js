require("dotenv").config();
const PurchasedCourse = require("../models/purchasedCoursesModel");
const StudentClasses = require("../models/studentClassesModel");
const CourseSyllabus = require("../models/syllabusModel");
const mongoose = require("mongoose");
const courseModel = require("../models/courseModel");
const coursetutorModel = require("../models/coursetutorModel");
const studentClassesModel = require("../models/studentClassesModel");

module.exports = {
  coursePurchase: async (req, res) => {
    let body = req.body;
    let fetchAllSyllaybus = await CourseSyllabus.find({
      courseId: { $eq: body.courseId },
    });
    if (fetchAllSyllaybus.length <= 0 && fetchAllSyllaybus !== null) {
      res.status(200).send({
        err: 301,
        msg: "Classes are not available for this course you can not buy this course right now",
      });
    } else {
      let purchasedcourse = await PurchasedCourse.find({
        courseId: { $eq: mongoose.Types.ObjectId(body.courseId) },
        studentId: { $eq: mongoose.Types.ObjectId(body.studentId) },
        paymentStatus: { $eq: "success" },
      });
      if (purchasedcourse !== null && purchasedcourse.length > 0) {
        //checking if already bought course successfully
        return res
          .status(200)
          .send({ err: 302, msg: "data found no need to buy course" });
      } else {
        //course is not bought or payment failed
        // res.status(300).send({ err: 200, msg: "not bought" });
        //Then purchse course
        let year = new Date().getFullYear();
        let month = "" + (new Date().getMonth() + 1);
        let day = "" + new Date().getDate();
        let hour = "" + new Date().getHours();
        let minute = "" + new Date().getMinutes();
        let second = "" + new Date().getSeconds();
        let date = year + month + day + hour + minute + second;

        let randomNumber = Math.floor(Math.random() * (99 - 9 + 1)) + 9;

        var receiptId = date + randomNumber;

        const purchasedcourse = new PurchasedCourse({
          courseId: mongoose.Types.ObjectId(body.courseId),
          studentId: mongoose.Types.ObjectId(body.studentId),
          coursePrice: body.coursePrice,
          coursePriceIncludingGST: body.coursePrice * 0.18,
          tranactionDate: new Date(),
          receiptId: receiptId,
          paymentStatus: "success",
        });

        const result = await purchasedcourse.save();

        if (result) {
          var classes = [];
          fetchAllSyllaybus.map((data) => {
            courseId = data.courseId;
            tutorId = body.tutorId;
            studentId = body.studentId;
            syllabusCode = data.syllabusId;
            syllabusTitle = data.topicName;
            syllabusDescription = data.description;

            let datas = {
              courseId,
              tutorId,
              studentId,
              syllabusCode,
              syllabusTitle,
              syllabusDescription,
            };

            classes.push(datas);
          });

          classes.forEach(async (studentClass) => {
            await StudentClasses.insertMany({
              courseId: mongoose.Types.ObjectId(studentClass.courseId),
              tutorId: mongoose.Types.ObjectId(studentClass.tutorId),
              studentId: mongoose.Types.ObjectId(studentClass.studentId),
              syllabusCode: studentClass.syllabusCode,
              syllabusTitle: studentClass.syllabusTitle,
              syllabusDescription: studentClass.syllabusDescription,
            });
          });

          res.status(200).json({
            err: 200,
            msg: "Course Purchased And Classes Inserted Successfully",
            data: classes,
          });
        }
      }
    }
  },

  truncate: async (req, res) => {
    var result = await PurchasedCourse.deleteMany({});
    var result1 = await StudentClasses.deleteMany({});
    res.status(200).send({
      status: 200,
      data: result,
      data1: result1,
    });
  },

  fetchCoursePurchasedByStudent: async (req, res) => {
    let body = req.body;
    let purchasedcourse = await PurchasedCourse.find({
      courseId: { $eq: mongoose.Types.ObjectId(body.courseId) },
      studentId: { $eq: mongoose.Types.ObjectId(body.studentId) },
      paymentStatus: { $eq: "success" },
    });
    if (purchasedcourse !== null && purchasedcourse.length > 0) {
      return res
        .status(200)
        .send({ err: 302, msg: "data found no need to buy course" });
    } else {
      res.status(300).send({ err: 200, msg: "not bought" });
    }
  },

  getListCoursePurchasedByStudent: async (req, res) => {
    let body = req.body;
    let coursespurchasedByStudent = await PurchasedCourse.aggregate([
      {
        $match: {
          studentId: { $eq: mongoose.Types.ObjectId(body.studentId) },
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
          courseTitle: "$course.title",
          coursePriceIncludingGST: 1 ?? null,
          coursePrice: 1,
          tranactionDate: 1,
          receiptId: 1,
          paymentStatus: 1,
        },
      },
    ]);
    if (coursespurchasedByStudent !== null) {
      return res.status(200).send({
        err: 200,
        msg: "Data found",
        data: coursespurchasedByStudent,
      });
    } else {
      return res.status(200).send({ err: 300, msg: "No data found" });
    }
  },

  // fetchCourseSoldOftutor: async (req, res) => {
  //   let body = req.body;
  //   let data = await studentClassesModel.aggregate([
  //     {
  //       $match: {
  //         tutorId: mongoose.Types.ObjectId(req.params.tutorId),
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "courses",
  //         localField: "courseId",
  //         foreignField: "_id",
  //         as: "course",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$course",
  //         preserveNullAndEmptyArrays: false,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "studentId",
  //         foreignField: "_id",
  //         as: "student",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$student",
  //         preserveNullAndEmptyArrays: false,
  //       },
  //     },
  //     {
  //       $project: {
  //         courseId: 1,
  //         courseName: "$course.title",
  //         studentName: {
  //           $concat: ["$student.firstName", " ", "$student.lastName"],
  //         },
  //       },
  //     },
  //   ]);

  //   if (data !== null) {
  //     // let uniqueData = data.map((d) => d.courseId);

  //     return res.status(200).send({
  //       err: 200,
  //       msg: "Data found",
  //       data: uniqueData,
  //     });
  //   } else {
  //     return res.status(200).send({ err: 300, msg: "No data found" });
  //   }
  // },

};
