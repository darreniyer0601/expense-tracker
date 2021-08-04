const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");

exports.getUser = async (req, res) => {
	// Return logged in user
	try {
		// Get the user from the database
		// Do not return the password
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ msg: "Server error" });
	}
};

exports.login = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(400).send({ msg: "User does not exist" });
		}

		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) {
			return res.status(400).send({ msg: "Password does not match" });
		}

		// JWT sign in

		// Create payload
		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			"jwtSecret",
			{
				expiresIn: 3600,
			},
			(err, token) => {
				if (err) throw err;
				res.json({ token, user });
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ msg: "Server Error" });
	}
};

exports.register = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password } = req.body;

	try {
		// Check if a user with the given email
		// already exists
		let user = await User.findOne({ email: email });

		if (user) {
			return res.status(401).json({ msg: "User already exists" });
		}

		// Generate hashed password
		const hashedPassword = await bcrypt.hash(password, 12);

		user = new User({
			name,
			email,
			password: hashedPassword,
		});

		await user.save();

		// JWT authentication

		// Create payload with user id
		const payload = {
			user: {
				id: user.id,
			},
		};

		// Generate a token using jwt
		jwt.sign(
			payload,
			"jwtSecret",
			{
				// keep the secret in a config file
				expiresIn: 3600, // 1 hour
			},
			(err, token) => {
				if (err) throw err;
				res.json({ token, user });
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
};
