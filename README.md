# CodeSync – Real-Time Collaborative Code Editor ⚡

**CodeSync** is a full-stack real-time code collaboration platform inspired by Replit and CodePen. It allows multiple users to join a room and edit code together live — with seamless syncing and typing indicators.

> Built using React, Node.js, Socket.IO, and Monaco Editor.

---

## 🚀 Features

- 🧠 Real-time collaborative code editing (multi-user)
- 📡 Socket.IO-based live sync with WebSockets
- 👥 Room-based user joining/leaving
- ✍️ Typing indicators
- 💾 Clean backend + frontend code separation
- 🧩 Editor built with Monaco (same as VS Code)

---

## 🧑‍💻 Tech Stack

| Layer       | Technologies                     |
|-------------|----------------------------------|
| Frontend    | React, Tailwind, Monaco Editor   |
| Backend     | Node.js, Express, Socket.IO      |
| Real-Time   | WebSockets via Socket.IO         |
| Styling     | Tailwind CSS                     |
| Others      | UUID, dotenv, axios              |

---

## 📁 Project Structure

CodeSync/
├── backend/
│ ├── server.js
│ └── sockets/socket.js
├── frontend/
│ └── collabsync-frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── socket.js
│ │ └── pages/Room.jsx, Home.jsx
