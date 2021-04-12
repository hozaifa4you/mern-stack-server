require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// custom module

// config
const app = express();
const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", require("./routers/userRouter"));
app.use("/customer", require("./routers/customerRouter"));

app.listen(PORT, () => {
	console.log(`Server running on: http://localhost:${PORT}`);
});

// end points
app.get("/test", (req, res) => {
	console.log(req, res);
	res.send("Its works");
});

// db connection
mongoose.connect(
	DB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	() => console.log(`Database connected at: ${mongoose.connection.host}`)
);
