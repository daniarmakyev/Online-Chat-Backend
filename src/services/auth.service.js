import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (username, email, password) => {
	const exist = await User.findOne({ email });
	if (exist) throw new Error("Email already exist");

	const hashed = await bcrypt.hash(password, 10);

	const user = await User.create({
		username,
		email,
		password: hashed,
	});

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
	return {
		user: {
			id: user._id,
			username: user.username,
			email: user.email,
		},
		token,
	};
};

export const login = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error("User not found");

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) throw new Error("Wrong password");

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});

	return {
		user: {
			id: user._id,
			username: user.username,
			email: user.email,
		},
		token,
	};
};
