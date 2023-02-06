require("dotenv").config();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;

const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");

module.exports = {
  SendVerificationEmail: async (req, res) => {
    try {
      console.log("Sending Verification Email From backend");
      console.log(req.body);
      const { email } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) return res.status(400).send("User not found");

      if (user.isVerified) return res.status(409).send("User already verified");

      const token = crypto.randomBytes(32).toString("hex");

      const newToken = new Token({
        userId: user._id,
        token: token,
      });
      await newToken.save();
      const url = `<a href="${secureHttps ? "https://" : "http://"}${
        process.env.BASE_URL
      }/verify?token=${token}&UserId=${user._id}">Verify your email</a>`;
      console.log(url);
      await sendEmail(email, "Please Verify your email", url);
      res.status(200).send("Email sent");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  VerifyEmail: async (req, res) => {
    console.log("Verifying Email From backend");
    try {
      const UserId = req.query.UserId;
      const tokenFromLink = req.query.token;
      const user = await userModel.findOne({ _id: UserId });
      if (!user) {
        return res.status(400).send({
          message: "Invalid Link",
        });
      }
      const token = await Token.findOne({
        userId: UserId,
        token: tokenFromLink,
      });

      if (!token) {
        return res.status(400).send({
          message: "Invalid Link",
        });
      }
      await userModel.updateOne(
        { _id: UserId },
        { $set: { emailVerified: "1" } }
      );
      await token.remove();
      return res.status(200).send({
        message: "Email Verified",
      });
      console.log("Email Verified");
    } catch (err) {
      res.status(500).send(err);
    }
  },

  CheckUser: (req, res) => {},

  LoginUser: async (req, res) => {
    try {
      let hash = bcrypt.hashSync(req.body.password, 10);
      const { username, password } = req.body;
      if (!username || !password)
        return res
          .status(400)
          .json({ msg: "Username and password are required" });

      var query = {};
      query.email = username;

      userModel.findOne(query, async (err, user) => {
        if (err)
          return res
            .status(200)
            .send({ err: 400, message: "No user found or exists." });

        if (user !== null) {
          if (user.isBlocked !== null && user.isBlocked === 1) {
            // check user is blocked

            return res.status(200).send({
              err: 400,
              message: "Your account has been blocked by system authors",
            });
          } else {
            // when unblocked
            bcrypt.compare(password, user.password, (err, data) => {
              if (err) throw err;
              if (data) {
                // generate access and refresh tokens
                const expiry = "900s";
                const accessToken = jwt.sign(
                  { id: user.email },
                  process.env.ACCESS_TOKEN_SECRET,
                  { expiresIn: expiry }
                ); //30s
                const expriylong = "1d";
                const refreshToken = jwt.sign(
                  { id: user.email },
                  process.env.REFRESH_TOKEN_SECRET,
                  { expiresIn: expriylong }
                ); //1dy
                // update token back to database
                userModel.findOneAndUpdate(query, {
                  refreshToken: refreshToken,
                  lastLoginDate: Date.now(),
                });
                // set cookie
                res.cookie("jwt", refreshToken, {
                  httpOnly: true,
                  secure: secureHttps,
                  maxAge: 24 * 60 * 60 * 1000,
                });
                var userData = {
                  id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  role: user.role,
                  profilePic: user.profilePic,
                  about: user.about,
                  email: user.email,
                  emailVerified: user.emailVerified,
                };
                return res.status(200).json({
                  err: 200,
                  message: "Login successfully",
                  userData: userData,
                  accessToken,
                });
              } else {
                return res.status(401).json({ msg: "Invalid credencial" });
              }
            });
          }
        } else {
          return res
            .status(200)
            .send({ err: 300, message: "No user found for these credentials" });
        }
      });
    } catch (ex) {
      return res.status(500).send({ message: ex.message });
    }
  },

  CreateUser: async (req, res) => {
    try {
      let hash = bcrypt.hashSync(req.body.password, 10);

      userModel.find({ email: req.body.email }, function (err, users) {
        console.log(users);
        if (err)
          return res.status(400).send({
            err: 400,
            message: "Error Creating User",
            ErrorOccured: err,
          });
        if (users.length > 0)
          return res.status(200).send({
            err: 300,
            message: "Account with same details are not allowed",
            data: users,
          });

        userModel.find({ phone: req.body.phone }, function (err, users) {
          console.log(users);
          if (err)
            return res.status(400).send({
              err: 400,
              message: "Error Creating User",
              ErrorOccured: err,
            });
          if (users.length > 0)
            return res.status(200).send({
              err: 300,
              message: "Account with same details are not allowed",
              data: users,
            });

          const User = new userModel({
            ...req.body,
            password: hash,
            isBlocked: 0,
            emailVerified: 0,
          });
          User.save()
            .then((result) => {
              var userData = {
                id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                role: result.role,
                profilePic: result.profilePic,
                about: result.about,
                emailVerified: result.emailVerified,
              };
              const accessToken = "";

              // update token back to database
              setTimeout(() => {
                return res.status(200).send({
                  err: 200,
                  message: "Account created successfully",
                  userData: userData,
                  accessToken,
                });
              }, 200);

              // set cookie
            })
            .catch((error) => {
              return res.status(400).send({
                err: 400,
                message: "Error Creating User",
                ErrorOccured: error,
              });
            });
        });
      });
    } catch (ex) {
      return res.status(500).send({ msg: ex.message });
    }
  },

  DeleteUser: (req, res) => {
    try {
      userModel.findByIdAndDelete(req.params.UserId, (err, data) => {
        if (err) res.status(400).send({ ErrorOccured: err });
        if (data)
          res
            .status(200)
            .send({ err: 200, msg: "Removed Successfully", data: data });
        else res.status(200).send({ err: 300, msg: "No record exists" });
      });
    } catch (ex) {
      return res.status(500).send({ msg: ex.message });
    }
  },

  // approve reject user
  ApproveUser: (req, res) => {
    try {
      const { isApproved } = req.body;
      if (!isApproved)
        return res.status(400).json({ msg: "isApproved is missing" });

      const update = {
        $set: {
          isApproved: req.body.isApproved,
          approvedDate: Date.now(),
        },
      };

      userModel.findByIdAndUpdate(
        req.params.UserId,
        update,
        { new: false },
        (err, data) => {
          if (err) res.status(400).send({ ErrorOccured: error });
          if (data) {
            const msg =
              isApproved === 1
                ? "Tutor requset approved successfully"
                : "Tutor request rejected successfully";
            res.status(200).send({ err: 200, msg: msg });
          } else res.status(300).send({ msg: "No changes were updated" });
        }
      );
    } catch (ex) {
      return res.status(500).send({ message: ex.message });
    }
  },

  // fetch user by id
  FetchUserById: (req, res) => {
    userModel.findById(req.params.UserId, (err, user) => {
      if (err) res.status(400).send({ ErrorOccured: err });
      if (user)
        res.status(200).send({ err: 200, msg: "Data found", data: user });
      else res.status(200).send({ err: 300, msg: "No user found" });
    });
  },

  // Fetch uses by role type
  FetchUsers: (req, res) => {
    var query = { role: req.query.role };
    userModel.find(query, (err, users) => {
      if (err) return res.status(400).send({ ErrorOccured: error });
      if (users)
        return res.status(200).send({ msg: "Data found", data: users });
      else return res.status(300).send({ msg: "No user found", data: [] });
    });
  },

  // updates user profile
  UpdateProfile: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, about, userId } = req.body;

      let query = {};
      query.email = req.body.email;
      query.phone = req.body.phone;

      let foundUser = await userModel.findOne({
        $or: [{ email: query.email }, { phone: query.phone }],
      });

      if (foundUser) {
        return res.send({
          err: 300,
          message: "User with same details already exists",
        });
      }

      const update = {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          about: about,
        },
      };

      const newUser = await userModel.findByIdAndUpdate(userId, update, {
        new: true,
      });
      return res.send({
        err: 200,
        message: "Profile updated successfully",
        userData: newUser,
      });
    } catch (ex) {
      return res.status(500).send({ err: 500, message: ex.message });
    }
  },

  UpdatePassword: async (req, res) => {
   
    try {
      const { userId, oldPassword, newPassword } = req.body;

      let foundUser = await userModel.findById(userId);
      if (!foundUser) {
        return res.send({ err: 300, message: "User does not exist" });
      }

      const isMatch = await bcrypt.compare(oldPassword, foundUser.password);

      if (!isMatch) {
        return res.send({ err: 300, message: "Old password is incorrect" });
      }

      const hash = bcrypt.hashSync(newPassword, 10);

      const update = {
        $set: {
          password: hash,
        },
      };

      await userModel.findByIdAndUpdate(userId, update, { new: true });

      return res.send({ err: 200, message: "Password updated successfully" });
    } catch (err) {
      return res.status(500).send({ err: 500, message: err.message });
    }
  },
};
