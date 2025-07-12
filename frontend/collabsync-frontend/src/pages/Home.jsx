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
    const newRoomId = crypto.randomUUID();
    navigate(`/room/${newRoomId}?username=${username}`);
  };

  const handleJoinRoom = () => {
    if (roomId && username) navigate(`/room/${roomId}?username=${username}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 max-w-md w-full text-center transition-all">
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex justify-center items-center gap-2">
          <Rocket className="w-6 h-6" /> CollabSync
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Real-time Code Collaboration Platform
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring focus:ring-blue-300 text-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID to join"
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-300 text-black"
            />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCreateRoom}
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 px-4 py-2 rounded-md font-semibold text-white shadow hover:scale-105 transition-transform"
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

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          💡 Collaborate. Code. Ship faster.
        </p>
      </div>

      <footer className="mt-6 text-xs text-white opacity-70">
        © 2025 CollabSync — Made with 💖 by Roshan Jha
      </footer>
    </div>
  );
};

export default Home;
