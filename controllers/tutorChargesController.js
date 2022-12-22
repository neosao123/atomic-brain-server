require("dotenv").config();
const TutorChargesModel = require("../models/tutorchargesModel");

module.exports = {
  fetchTutorChargesById: (req, res) => {
    TutorChargesModel.findOne(
      {
        tutorId: { $eq: req.body.tutorId },
      },
      (err, tutor) => {
        if (err) res.status(400).send({ ErrorOccured: err });
        if (tutor) res.status(200).send({ msg: "Data Found", data: tutor });
        else res.status(300).send({ msg: "No data Found" });
      }
    );
  },

  saveAndUpdateTutorCharges: async (req, res) => {
    try {
      let body = req.body;

      const tutorCharge = await TutorChargesModel.findOne({
        tutorId: { $eq: body.tutorId },
      }).limit(1);
      if (tutorCharge === null) {
        const tutorCharges = new TutorChargesModel({
          tutorId: body.tutorId,
          paidClassCharge: body.paidClassCharge,
          freeClassCharge: body.freeClassCharge,
          paidClassPenalty: body.paidClassPenalty,
          freeClassPenalty: body.freeClassPenalty,
          maxPaidSkipCount: body.maxPaidSkipCount,
          maxFreeSkipCount: body.maxFreeSkipCount,
        });
        tutorCharges.save().then((result) => {
          return res.status(200).send({
            err: 200,
            message: "Charges Saved SuccessFully",
            data: result,
          });
        });
      } else {
        let body = req.body;
        const updateData = {
          $set: {
            paidClassCharge: body.paidClassCharge,
            freeClassCharge: body.freeClassCharge,
            paidClassPenalty: body.paidClassPenalty,
            freeClassPenalty: body.freeClassPenalty,
            maxPaidSkipCount: body.maxPaidSkipCount,
            maxFreeSkipCount: body.maxFreeSkipCount,
          },
        };

        const tutorCharges = await TutorChargesModel.findByIdAndUpdate(
          tutorCharge._id,
          updateData,
          { new: true }
        );

        return res.status(200).send({
          err: 200,
          message: "Chrages Updated successfully",
          data: tutorCharges,
        });
      }
    } catch (ex) {
      return res.status(500).send({ err: 500, message: ex.message });
    }
  },
};
