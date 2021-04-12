const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// #post router
router.post("/", async (req, res) => {
	const { email, password, passwordVerify } = req.body;

	try {
		// empty email verify
		if (!email || !password || !passwordVerify)
			return res
				.status(400)
				.json({ errorMsg: "Please enter all required field." });

		// password length verify
		if (password.length < 6)
			return res.status(400).json({
				errorMsg: "Please enter a password at least 6 character.",
			});

		// confirm password verify
		if (password !== passwordVerify)
			return res
				.status(400)
				.json({ errorMsg: "Please enter the password twice" });

		// already exist
		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res
				.status(404)
				.json({ errorMsg: "Already an account with the account." });

		// Hash password
		const passwordHash = await bcrypt.hash(password, 12);

		// save to database
		const newUser = new User({ email, passwordHash });
		const savedUser = await newUser.save();

		// login the user
		const token = jwt.sign(
			{ user: savedUser._id, email: savedUser.email },
			process.env.mySecret,
			{
				expiresIn: "5h",
			}
		);
		// send to cookie
		res.cookie("token", token, { httpOnly: true }).send();
	} catch (err) {
		res.status(400).json({
			errorMsg: "internal server error.  " + err.message,
		});
	}
});

/// #login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		/// validation
		if (!email || !password)
			return res
				.status(400)
				.json({ errorMsg: "Please enter all required fields" });
		/// user find
		const existingUser = await User.findOne({ email });
		if (!existingUser)
			return res.status(401).json({ errorMsg: "Invalid credentials" });
		/// password matching
		const passwordCorrect = await bcrypt.compare(
			password,
			existingUser.passwordHash
		);
		if (!passwordCorrect)
			return res.status(401).json({ errorMsg: "Invalid credentials" });

		/// login to the user
		const token = jwt.sign(
			{ user: existingUser._id, email: existingUser.email },
			process.env.mySecret,
			{
				expiresIn: "5h",
			}
		);
		// send to cookie
		res.cookie("token", token, { httpOnly: true }).send();
	} catch (error) {
		console.log(error.message);
		res.status(500).send();
	}
});

// #logout
router.get("/logout", (req, res) => {
	res.cookie("token", "", { httpOnly: true, expires: new Date(0) }).send();
});

// login router

module.exports = router;
