require("dotenv").config();
const secureHttps = process.env.SITE_HTTPS == "TRUE" ? true : false || false;

module.exports = {
	list: async (req, res) => {
		try {
			const classes = [];
			return res.status(200).send({ data: classes });
		} catch (error) {
			res.status(400).send("Failed to get Syllabus list.");
		}
	},
};
