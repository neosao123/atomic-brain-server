require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;

const HandleRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;
	res.clearCookie("jwt", { httpOnly: true, secure: secureHttps });

	const foundUser = await UserModel.findOne({ refreshToken }).exec();
	console.log(foundUser);

	if (!foundUser) {
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
			if (err) return res.sendStatus(403); //Forbidden
			// Delete refresh tokens of hacked user
			const hackedUser = await UserModel.findOne({ email: decoded.id }).exec();
			hackedUser.refreshToken = [];
			const result = await hackedUser.save();
		});
		return res.sendStatus(403); //Forbidden
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
    
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
		if (err) {
			// expired refresh token
			foundUser.refreshToken = [...newRefreshTokenArray];
			const result = await foundUser.save();
		}

		console.log(decoded);

		if (err || foundUser.email !== decoded.id) return res.sendStatus(403);

		const expiry = "900s";
		const accessToken = jwt.sign({ id: foundUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiry });

		const newRefreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
		// Saving refreshToken with current user
		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
		const result = await foundUser.save();

		// Creates Secure Cookie with refresh token
		res.cookie("jwt", newRefreshToken, { httpOnly: true, secure: secureHttps, maxAge: 24 * 60 * 60 * 1000 });

		return res.json({ accessToken });
	});
};

module.exports = { HandleRefreshToken };
