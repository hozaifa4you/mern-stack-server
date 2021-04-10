require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

// config
const app = express();
const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

// middleware
app.use(morgan("dev"));

app.listen(PORT, () => {
	console.log(`Server running on: http://localhost:${PORT}`);
});

// end points
app.get("/test", (req, res) => {
	console.log(req, res);
	res.send("Its works");
});
