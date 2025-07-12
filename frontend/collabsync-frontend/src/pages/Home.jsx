// Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { Rocket, Users, Key, Sparkles, LogIn } from "lucide-react";

const Home = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert("⚠️ Please enter your name before creating a room.");
      return;
    }
    const newRoomId = crypto.randomUUID();
    navigate(`/room/${newRoomId}?username=${username.trim()}`);
  };

  const handleJoinRoom = () => {
    if (!roomId.trim() || !username.trim()) {
      alert("⚠️ Enter both username and room ID to join a room.");
      return;
    }
    navigate(`/room/${roomId.trim()}?username=${username.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-30 absolute -top-10 -left-10 animate-pulse"></div>
        <div className="w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-30 absolute bottom-0 right-0 animate-pulse"></div>
      </div>

      <div className="relative z-10 bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-xl p-10 max-w-md w-full text-center transition-all border border-white/10">
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex justify-center items-center gap-2">
          <Rocket className="w-6 h-6 animate-bounce" /> CollabSync
        </h1>
        <p className="text-gray-300 mb-6 text-sm tracking-wide">
          🚀 Real-time Code Collaboration Platform for Teams
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-pink-500" />
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID to join"
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCreateRoom}
              disabled={!username.trim()}
              className={`flex items-center gap-1 px-4 py-2 rounded-md font-semibold shadow transition-transform duration-200 ${
                !username.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:scale-105 text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" /> Create Room
            </button>
            <button
              onClick={handleJoinRoom}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold text-white shadow"
            >
              <LogIn className="w-4 h-4" /> Join Room
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-300">
          💡 Collaborate. Code. Ship faster.
        </p>
      </div>

      <footer className="mt-6 text-xs text-white opacity-70 z-10">
        © 2025 CollabSync — Made with 💖 by Roshan Jha
      </footer>
    </div>
  );
};

export default Home;
