import { Router } from "express";
import {
	createChannel,
	joinChannel,
	deleteChannel,
	removeParticipant,
	leaveChannel,
	getChannelMessages,
	getChannelList,
	getChannelParticipants,
} from "../controllers/channel.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, createChannel);
router.get("/list", authMiddleware, getChannelList);
router.post("/:channelId/join", authMiddleware, joinChannel);
router.delete("/:channelId", authMiddleware, deleteChannel);
router.delete(
	"/:channelId/participants/:participantId",
	authMiddleware,
	removeParticipant,
);
router.post("/:channelId/leave", authMiddleware, leaveChannel);
router.get("/:channelId/messages", authMiddleware, getChannelMessages);
router.get("/:channelId/participants", authMiddleware, getChannelParticipants);

export default router;
