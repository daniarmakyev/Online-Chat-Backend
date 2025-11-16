import Message from "../models/message.model.js";
import Channel from "../models/channel.model.js";

export const setupSocketHandlers = (io) => {
	io.on("connection", (socket) => {
		console.log(`User connected: ${socket.userId}`);

		socket.on("join_channel", async (channelId) => {
			try {
				const channel = await Channel.findById(channelId);

				if (!channel) {
					socket.emit("error", { message: "Channel not found" });
					return;
				}

				const isParticipant =
					channel.participants.includes(socket.userId) ||
					channel.owner.toString() === socket.userId;

				if (!isParticipant) {
					socket.emit("error", {
						message: "You are not a participant of this channel",
					});
					return;
				}

				socket.join(channelId);
				console.log(`User ${socket.userId} joined channel ${channelId}`);

				socket.to(channelId).emit("user_joined_channel", {
					userId: socket.userId,
					channelId,
				});

				socket.emit("joined_channel", { channelId });
			} catch (error) {
				socket.emit("error", { message: error.message });
			}
		});

		socket.on("leave_channel", (channelId) => {
			socket.leave(channelId);
			console.log(`User ${socket.userId} left channel ${channelId}`);

			socket.to(channelId).emit("user_left_channel", {
				userId: socket.userId,
				channelId,
			});
		});

		socket.on("send_message", async ({ channelId, text }) => {
			try {
				const channel = await Channel.findById(channelId);

				if (!channel) {
					socket.emit("error", { message: "Channel not found" });
					return;
				}

				const isParticipant =
					channel.participants.includes(socket.userId) ||
					channel.owner.toString() === socket.userId;

				if (!isParticipant) {
					socket.emit("error", {
						message: "You are not a participant of this channel",
					});
					return;
				}

				const message = await Message.create({
					channelId,
					sender: socket.userId,
					text,
				});

				const populatedMessage = await Message.findById(message._id).populate(
					"sender",
					"username email",
				);

				io.to(channelId).emit("new_message", {
					message: populatedMessage,
				});

				console.log(
					`Message sent in channel ${channelId} by user ${socket.userId}`,
				);
			} catch (error) {
				socket.emit("error", { message: error.message });
			}
		});

		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.userId}`);
		});
	});
};
