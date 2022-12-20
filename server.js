const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const console = require("console");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const routes = require("./routes");
const app = express();

// require db connection
require("./models");

// set port
const PORT = process.env.PORT || 5000;

//allow credentials
app.use(credentials);

//set cors options
app.use(cors(corsOptions));

// configure body parser for requests
app.use(bodyParser.json());

// built-in middleware to handle urlencoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// configure cookie parser
app.use(cookieParser());
// console.log(process.env) 

//check for production environment
if (process.env.NODE_ENV == "production") {
	app.use(express.static(path.resolve(__dirname, "../server/client/build")));
	app.get("/*", function (req, res) {
		res.sendFile(path.resolve(__dirname, "../server/client/build", "index.html"));
	});
}

// uploads folder
app.use("/uploads", express.static("./uploads"));	

// set routes
app.get("/", (req, res) => res.send("Hello World"));
app.use(routes);

// init server
app.listen(PORT, () => {
	console.log(`Server listening on port http://localhost:${PORT}`);
});
