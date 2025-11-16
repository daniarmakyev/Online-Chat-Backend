import * as userService from "../services/user.service.js";

export const searchUsers = async (req, res) => {
	try {
		const { q } = req.query;

		const result = await userService.searchUsers(q);

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
