require("dotenv").config();
const UserModel = require("../models/userModel");

module.exports = {
	HandleLogout: async (req, res) => {
		const secureHttps = process.env.SITE_HTTPS || false;
		// On client, also delete the accessToken
		const cookies = req.cookies;
		if (!cookies?.jwt) return res.sendStatus(204); //No content
		const refreshToken = cookies.jwt;

		var query = { refreshToken: refreshToken };

		// Is refreshToken in db?
		UserModel.findOne(query, async (err, data) => {
			if (err) {
				res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: secureHttps });
				return res.sendStatus(204);
			}
			await UserModel.findOneAndUpdate(query, { resfreshToken: null });
			res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: secureHttps });
			return res.sendStatus(204);
		});
	},
};
