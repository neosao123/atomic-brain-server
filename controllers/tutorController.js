require("dotenv").config();
const UserModel = require("../models/userModel");
const SecureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;

module.exports = {
  FetchTutorById: async (req, res) => {
    UserModel.findById(req.params.TutorId, (err, tutor) => {
      if (err) res.status(400).send({ ErrorOccured: err });
      if (tutor)
        res.status(200).send({ err: 200, msg: "Data Found", data: tutor });
      else res.status(200).send({ err: 300, msg: "No data found" });
    });
  },

  UpdateProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const user = await UserModel.find({
        email: { $eq: userData.email },
        _id: { $ne: userId },
      }).limit(1);
      if (user.length > 0) {
        return res.status(200).send({
          err: 300,
          message:
            "This email-id has already been used. Please try with another email-id",
        });
      }

      const updateData = {
        $set: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          dob: userData.dob,
          gender: userData.gender,
          about: userData.about,
          email: userData.email,
          phone: userData.phone,
          about: userData.about,
          facebookUrl: userData.facebookUrl,
          instagramUrl: userData.instagramUrl,
          linkedinUrl: userData.linkedinUrl,
          youtubeUrl: userData.youtubeUrl,
          isApproved: userData.isApproved,
        },
      };

      if (req.file != undefined) {
        let { filename } = req.file;
        updateData.profilePic = filename;
      }

      const updateResult = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
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
};
