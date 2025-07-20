import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import axios from "axios";
import aiRoutes from "./routes/aiRoutes.js";

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
app.use("/api", aiRoutes);
app.use(express.json()); // <-- Ensure you can parse JSON POST bodies

app.post("/api/run", async (req, res) => {
  const { code, language } = req.body;

  const langMap = {
    javascript: "nodejs",
    python: "python3",
    cpp: "cpp17",
  };

  const lang = langMap[language];
  if (!lang) return res.status(400).json({ output: "Unsupported language" });

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      language: lang,
      versionIndex: "0",
    });

    return res.json({ output: response.data.output });
  } catch (error) {
    console.error("JDoodle Error:", error.response?.data || error.message);
    return res.status(500).json({ output: "Error executing code." });
  }
});

//  Shared data store
const usersInRoom = {};
const roomCodeMap={};

io.on("connection", (socket) => {
  console.log(` Client connected: ${socket.id}`);
socket.on("cursor_update", ({ roomId, username, selection }) => {
  console.log("Cursor Update:", username, selection);
  socket.to(roomId).emit("cursor_update", { username, selection });
});

  // Join Room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    socket.emit("loadCode",roomCodeMap[roomId]|| "");
    socket.username = username;
    socket.roomId = roomId;

    // Initialize room
    if (!usersInRoom[roomId]) usersInRoom[roomId] = [];

    const alreadyInRoom = usersInRoom[roomId].some(
      (u) => u.socketId === socket.id
    );
    const sameUsernameExists=usersInRoom[roomId].some((u)=>u.username===username);
  
    

    if (!alreadyInRoom &&!sameUsernameExists) {
      usersInRoom[roomId].push({ username, socketId: socket.id });
      console.log(`SERVER LOG: ${username} joined room ${roomId}`);
      socket.to(roomId).emit("user-joined", username);
    }
    io.to(roomId).emit("room-users",usersInRoom[roomId]);

    // Send latest code to the new user
    socket.emit("code-update", roomCodeMap[roomId]);
  });

  // 🔄 Code Change
  socket.on("code-change", ({ roomId, code }) => {
     if(!roomId)return;
    roomCodeMap[roomId]=code;
    socket.to(roomId).emit("code-update", code);
  });
  socket.on("typing",({roomId,username})=>{
    socket.to(roomId).emit("user-typing",username);
  });
  socket.on("stop-typing", ({ roomId }) => {
    socket.to(roomId).emit("user-stop-typing");
  });

  //  Handle Disconnect
  socket.on("disconnect", () => {
    const { username, roomId } = socket;

    if (username && roomId ) {
      // Remove this socket from list
      usersInRoom[roomId] = usersInRoom[roomId]?.filter(
        (u) => u.socketId !== socket.id
      );
      socket.to(roomId).emit("user-left", username);
      io.to(roomId).emit("room-users", usersInRoom[roomId]);
      console.log(` ${username} left room ${roomId}`);

    }

    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
