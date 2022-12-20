const mongoose = require("mongoose");
var colors = require("colors");
const MONGODB_URI = require("../config/index");
colors.enable();

const mongooseConnect = () => {
	let connecting = setTimeout(() => console.log("Connecting to DB...".green), 1000);
	mongoose
		.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			clearTimeout(connecting);
			console.log("Connected to DB".green);
		})
		.catch((err) => {
			console.log(err);
			clearTimeout(connecting);
			console.log("Unable to connect to DB".yellow);
			console.log("Retrying in 10 seconds".blue);
			setTimeout(mongooseConnect, 10 * 1000);
		});
};

mongooseConnect();
