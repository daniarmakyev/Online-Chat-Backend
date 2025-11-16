import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";

export const createChannel = async (name, owner) => {
	const exist = await Channel.findOne({ name });
	if (exist) throw new Error("Channel already exist!");

	const channel = await Channel.create({
		name,
		owner,
		participants: [owner],
	});

	return {
		channel: {
			id: channel._id,
			name: channel.name,
			owner: channel.owner,
		},
	};
};

export const joinChannel = async (channelId, userId) => {
	const channel = await Channel.findById(channelId);
	if (!channel) throw new Error("Channel not found!");

	if (
		channel.owner.toString() === userId ||
		channel.participants.includes(userId)
	) {
		throw new Error("Already a participant!");
	}

	channel.participants.push(userId);
	await channel.save();

	return {
		message: "Successfully joined channel",
		channel: {
			id: channel._id,
			name: channel.name,
		},
	};
};

export const deleteChannel = async (channelId, userId) => {
	const channel = await Channel.findById(channelId);
	if (!channel) throw new Error("Channel not found!");

	if (channel.owner.toString() !== userId) {
		throw new Error("Only owner can delete channel!");
	}

	await Channel.findByIdAndDelete(channelId);

	return {
		message: "Channel deleted successfully",
	};
};

export const removeParticipant = async (channelId, ownerId, participantId) => {
	const channel = await Channel.findById(channelId);
	if (!channel) throw new Error("Channel not found!");

	if (channel.owner.toString() !== ownerId) {
		throw new Error("Only owner can remove participants!");
	}

	if (channel.owner.toString() === participantId) {
		throw new Error("Cannot remove owner from channel!");
	}

	const participantIndex = channel.participants.indexOf(participantId);
	if (participantIndex === -1) {
		throw new Error("Participant not found in channel!");
	}

	channel.participants.splice(participantIndex, 1);
	await channel.save();

	return {
		message: "Participant removed successfully",
		channel: {
			id: channel._id,
			name: channel.name,
		},
	};
};

export const leaveChannel = async (channelId, userId) => {
	const channel = await Channel.findById(channelId);
	if (!channel) throw new Error("Channel not found!");

	if (channel.owner.toString() === userId) {
		throw new Error("Owner cannot leave channel! Delete it instead.");
	}

	const participantIndex = channel.participants.indexOf(userId);
	if (participantIndex === -1) {
		throw new Error("You are not a participant of this channel!");
	}

	channel.participants.splice(participantIndex, 1);
	await channel.save();

	return {
		message: "Successfully left channel",
	};
};

export const getChannelMessages = async (channelId, userId) => {
	const channel = await Channel.findById(channelId);
	if (!channel) throw new Error("Channel not found!");

	const isParticipant =
		channel.participants.some((p) => p.toString() === userId) ||
		channel.owner.toString() === userId;

	if (!isParticipant) {
		throw new Error("You are not a participant of this channel!");
	}

	const messages = await Message.find({ channelId })
		.populate("sender", "username email")
		.sort({ createdAt: 1 })
		.limit(100);

	return { messages };
};

export const getChannelList = async () => {
	const channels = await Channel.find()
		.populate("owner", "username email _id")
		.populate("participants", "username email _id")
		.select("name owner participants createdAt");

	return { channels };
};

export const getChannelParticipants = async (channelId, userId) => {
	const channel = await Channel.findById(channelId)
		.populate("owner", "username email")
		.populate("participants", "username email");

	if (!channel) throw new Error("Channel not found!");

	const isParticipant =
		channel.participants.some((p) => p._id.toString() === userId) ||
		channel.owner._id.toString() === userId;

	if (!isParticipant) {
		throw new Error("You are not a participant of this channel!");
	}

	return {
		owner: channel.owner,
		participants: channel.participants,
	};
};
