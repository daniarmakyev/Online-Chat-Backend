import User from "../models/user.model.js";

export const searchUsers = async (query) => {
	if (!query || query.trim().length === 0) {
		throw new Error("Search query is required!");
	}

	const users = await User.find({
		username: { $regex: query, $options: "i" },
	})
		.select("username email")
		.limit(20);

	return { users };
};
