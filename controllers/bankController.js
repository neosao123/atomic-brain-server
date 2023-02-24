require("dotenv").config();
const bankModel = require("../models/bankingDetailsModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
var IFSC = require("ifsc");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;

module.exports = {
  create: async (req, res) => {
    try {
      const { userId, bankName, accountName, ifsc, accountNumber } = req.body;
      // Validate userId
      if (!userId) {
        return res
          .status(200)
          .json({ err: 300, message: "User ID is required." });
      }

      // Validate bankName
      if (!bankName) {
        return res
          .status(200)
          .json({ err: 300, message: "Bank name is required." });
      }

      // Validate accountName
      if (!accountName) {
        return res
          .status(200)
          .json({ err: 300, message: "Account name is required." });
      }

      // Validate ifsc
      if (!ifsc) {
        return res.status(200).json({ err: 300, message: "IFSC is required." });
      }

      // account number validation regex
      let accountNumberRegex = /^\d{9,18}$/;
      // Validate accountNumber
      if (!accountNumber.match(accountNumberRegex)) {
        return res
          .status(200)
          .json({ err: 300, message: "Invalid account number format." });
      }
      let newDetails;
      let existAccounts = await bankModel.findOne({
        userId: mongoose.Types.ObjectId(userId),
        bankName: bankName,
        accountName: accountName,
        ifsc: ifsc,
        accountNumber: accountNumber,
      });

      if (existAccounts) {
        return res
          .status(200)
          .json({ err: 300, message: "Bank details already exist" });
      } else {
        newDetails = new bankModel({
          userId: mongoose.Types.ObjectId(userId),
          bankName: bankName,
          accountName: accountName,
          ifsc: ifsc,
          accountNumber: accountNumber,
        });
        await newDetails.save();
        return res.status(200).json({
          err: 200,
          message: "Bank details saved successfully",
          data: newDetails,
        });
      }
    } catch (err) {
      res.status(500).send({ err: err });
    }
  },

  getBankDetails: async (req, res) => {
    try {
      let { ifsc } = req.body;
      if (!ifsc) {
        res.status(200).send({ err: 300, data: "Ifsc code required" });
      }
      if (ifsc) {
        await IFSC.fetchDetails(ifsc).then(
          function (result) {
            return res.status(200).send({ err: 200, data: result });
          },
          (err) => {
            return res.status(200).send({ err: 300, data: err });
          }
        );
      }
    } catch (ex) {
      res.status(200).send({ err: 500, message: "server Error" });
    }
  },
};
