require("dotenv").config();
const userModel = require("../models/userModel");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;
const { deleteFile } = require("../utils/fileOperations");
const fs = require("fs");

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
      console.log(userData);
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
      return res
        .status(200)
        .send({
          err: 300,
          message: "No changes where found to update.",
          data: updateResult,
        });
    } catch (ex) {
      return res.status(500).send({ err: 500, message: ex.message });
    }
  },
};
