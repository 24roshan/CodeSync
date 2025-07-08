import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(cors());
app.get("/", (req, res) => res.send("CollabSync Backend Running ✅"));

// ✅ Shared data store
let currentCode = "// shared collab code";
const usersInRoom = {};

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  // 🧠 Join Room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    socket.username = username;
    socket.roomId = roomId;

    // Initialize room
    if (!usersInRoom[roomId]) usersInRoom[roomId] = [];

    const alreadyInRoom = usersInRoom[roomId].some(
      (u) => u.socketId === socket.id
    );

    if (!alreadyInRoom) {
      usersInRoom[roomId].push({ username, socketId: socket.id });
      console.log(`✅ SERVER LOG: ${username} joined room ${roomId}`);
      socket.to(roomId).emit("user-joined", username);
    }
    io.to(roomId).emit("room-users",usersInRoom[roomId]);

    // Send latest code to the new user
    socket.emit("code-update", currentCode);
  });

  // 🔄 Code Change
  socket.on("code-change", ({ roomId, code }) => {
    currentCode = code;
    socket.to(roomId).emit("code-update", code);
  });

  // ❌ Handle Disconnect
  socket.on("disconnect", () => {
    const { username, roomId } = socket;

    if (username && roomId && usersInRoom[roomId]) {
      // Remove this socket from list
      usersInRoom[roomId] = usersInRoom[roomId]?.filter(
        (u) => u.socketId !== socket.id
      );
      io.to(roomId).emit("room-users", usersInRoom[roomId]);

      console.log(`👋 ${username} left room ${roomId}`);
      socket.to(roomId).emit("user-left", username);
    }

    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
