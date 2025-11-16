import * as channelService from "../services/channel.service.js";

export const createChannel = async (req, res) => {
	try {
		const { name } = req.body;
		const owner = req.user.id;

		const result = await channelService.createChannel(name, owner);

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const joinChannel = async (req, res) => {
	try {
		const { channelId } = req.params;
		const userId = req.user.id;

		const result = await channelService.joinChannel(channelId, userId);

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteChannel = async (req, res) => {
	try {
		const { channelId } = req.params;
		const userId = req.user.id;

		const result = await channelService.deleteChannel(channelId, userId);

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const removeParticipant = async (req, res) => {
	try {
		const { channelId, participantId } = req.params;
		const userId = req.user.id;

		const result = await channelService.removeParticipant(
			channelId,
			userId,
			participantId,
		);

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const leaveChannel = async (req, res) => {
	try {
		const { channelId } = req.params;
		const userId = req.user.id;

		const result = await channelService.leaveChannel(channelId, userId);

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getChannelMessages = async (req, res) => {
	try {
		const { channelId } = req.params;
		const userId = req.user.id;

		const result = await channelService.getChannelMessages(channelId, userId);

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getChannelList = async (req, res) => {
	try {
		const result = await channelService.getChannelList();

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getChannelParticipants = async (req, res) => {
	try {
		const { channelId } = req.params;
		const userId = req.user.id;

		const result = await channelService.getChannelParticipants(
			channelId,
			userId,
		);

		res.json(result);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
