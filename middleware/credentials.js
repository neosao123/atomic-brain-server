const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if (allowedOrigins.length > 0) {
		if (allowedOrigins.includes(origin)) {
			res.header("Access-Control-Allow-Credentials", true);
		}
	} else {
        res.header("Access-Control-Allow-Credentials", true);
    }
	next();
};

module.exports = credentials;
