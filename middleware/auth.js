const cookieParser = require("cookie-parser");

cookieParser;
module.exports.checkToken = async (req, res, next) => {
    console.log(req.headers);
  if (!req.headers.cookie) {
    return res.send({ code: 404, Message: "Unauthorised user" });
  }
  const checkUserExist = () => {

  };
  next();
};
