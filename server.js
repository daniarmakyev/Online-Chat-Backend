import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes.js";
import channelRoute from "./src/routes/channel.route.js";
import userRoutes from "./src/routes/user.routes.js";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./src/middlewares/socket.auth.js";
import { setupSocketHandlers } from "./src/socket/chat.socket.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/channel", channelRoute);
app.use("/users", userRoutes);

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.use(socketAuthMiddleware);
setupSocketHandlers(io);

mongoose.connect(process.env.DB_URL);

server.listen(process.env.PORT, () =>
	console.log(`Server running on port ${process.env.PORT}`),
);

export { io };
