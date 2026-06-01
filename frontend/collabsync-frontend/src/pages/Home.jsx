import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Users,
  Key,
  Sparkles,
  LogIn,
  Code,
  Brain,
  Zap,
} from "lucide-react";

const Home = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert("Please enter your name before creating a room.");
      return;
    }

    const newRoomId = crypto.randomUUID();
    navigate(`/room/${newRoomId}?username=${username.trim()}`);
  };

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      alert("Please enter username and room ID.");
      return;
    }

    navigate(`/room/${roomId.trim()}?username=${username.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white flex items-center justify-center px-6 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      
      <div className="relative z-10 max-w-5xl w-full">

     
        <div className="text-center mb-10">

          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Rocket size={45} />
            CodeSync AI
          </h1>

          <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
            Real-time collaborative coding platform with AI-powered code review,
            interview preparation, debugging assistance and live team coding.
          </p>

        </div>

      
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">

          <div className="grid md:grid-cols-2 gap-10">

            <div>

              <h2 className="text-2xl font-bold mb-6">
                Start Coding Together 🚀
              </h2>

           
              <div className="mb-4">
                <label className="text-sm text-gray-300 block mb-2">
                  Username
                </label>

                <div className="flex items-center bg-white/10 rounded-xl px-3">
                  <Users className="text-cyan-400" size={18} />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />
                </div>
              </div>

             
              <div className="mb-6">
                <label className="text-sm text-gray-300 block mb-2">
                  Room ID
                </label>

                <div className="flex items-center bg-white/10 rounded-xl px-3">
                  <Key className="text-pink-400" size={18} />

                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">

                <button
                  onClick={handleCreateRoom}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-all py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} />
                  Start Coding
                </button>

                <button
                  onClick={handleJoinRoom}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Join Room
                </button>

              </div>

            </div>

            <div className="grid grid-cols-1 gap-4">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Code className="text-cyan-400 mb-2" />
                <h3 className="font-semibold text-lg">Live Collaboration</h3>
                <p className="text-sm text-gray-400">
                  Multiple developers coding together in real-time.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Brain className="text-purple-400 mb-2" />
                <h3 className="font-semibold text-lg">AI Copilot</h3>
                <p className="text-sm text-gray-400">
                  Explain code, optimize logic and fix bugs instantly.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Zap className="text-yellow-400 mb-2" />
                <h3 className="font-semibold text-lg">Interview Mode</h3>
                <p className="text-sm text-gray-400">
                  Generate coding interview questions directly from your code.
                </p>
              </div>

            </div>

          </div>

        </div>

        <div className="text-center mt-8 text-sm text-gray-400">
          © 2025 CodeSync AI • Built with React, Socket.IO, Monaco Editor &
          Gemini AI
        </div>

      </div>

    </div>
  );
};

export default Home;
