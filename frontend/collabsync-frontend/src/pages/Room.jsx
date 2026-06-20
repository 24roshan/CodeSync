import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import copy from "copy-to-clipboard";
import CodeEditor from "../components/CodeEditor";
import axios from "axios";
import AIHelperModal from "../components/AIHelperModal";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState("// Start coding...");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [language, setLanguage] = useState("javascript");

  const [showAI, setShowAI] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const hasJoinedRef = useRef(false);
  const lastReceivedCode = useRef("");

  useEffect(() => {
    let storedName = sessionStorage.getItem("username");

    if (!storedName) {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get("username");

      if (urlName) {
        storedName = urlName;
        sessionStorage.setItem("username", storedName);
      } else {
        let input = "";

        while (!input) {
          input = prompt("Enter your name");

          if (input === null) {
            navigate("/");
            return;
          }

          input = input.trim();
        }

        storedName = input;
        sessionStorage.setItem("username", storedName);
      }
    }

    setUsername(storedName);
  }, [navigate]);

  useEffect(() => {
    if (!username || hasJoinedRef.current) return;

    hasJoinedRef.current = true;

    socket.emit("join-room", {
      roomId,
      username,
    });

    socket.on("loadCode", (savedCode) => {
      setCode(savedCode);
    });

    socket.on("code-update", (newCode) => {
      if (newCode !== lastReceivedCode.current) {
        lastReceivedCode.current = newCode;
        setCode(newCode);
      }
    });

    socket.on("user-joined", (name) => {
      setShowToast(`${name} joined`);
      setTimeout(() => setShowToast(null), 3000);
    });

    socket.on("room-users", (activeUsers) => {
      setUsers(activeUsers.map((u) => u.username));
    });

    socket.on("user-typing", (name) => {
      if (name !== username) {
        setTypingUser(name);
      }
    });

    socket.on("user-stop-typing", () => {
      setTypingUser(null);
    });

    socket.emit("codeChange", { roomId, code });

    return () => {
      socket.off("loadCode");
      socket.off("code-update");
      socket.off("user-joined");
      socket.off("room-users");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [roomId, username, code]);

  const handleCopyJoinLink = () => {
    copy(`${window.location.origin}/room/${roomId}`);

    setShowToast("🔗 Room link copied!");

    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  const generateInterviewQuestions = async () => {
    try {
      setLoadingAI(true);

      const prompt = `
Analyze this code:

${code}

Generate:

1. Five Technical Interview Questions
2. Detailed Answers
3. Time Complexity
4. Space Complexity
5. Optimization Suggestions
`;

      const res = await axios.post(
        "https://codesync-1-d3cy.onrender.com/api/ai/interview",
        { prompt },
      );

      setSuggestion(res.data.suggestion);
      setShowAI(true);
    } catch (err) {
      console.error(err);
      alert("AI request failed");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="h-screen bg-[#0B1120] text-white flex flex-col">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">⚡ CollabSync</h1>

            <p className="text-sm text-slate-400">Room: {roomId}</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 px-3 py-2 rounded"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>

            <button
              onClick={handleCopyJoinLink}
              className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700"
            >
              🔗 Share
            </button>

            <button
              onClick={generateInterviewQuestions}
              disabled={loadingAI}
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
            >
              {loadingAI ? "Generating..." : "🤖 AI Copilot"}
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem("username");
                navigate("/");
              }}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Leave
            </button>
          </div>
        </div>
      </header>

      {showToast && (
        <div className="bg-green-600 text-center py-2">{showToast}</div>
      )}

      {typingUser && (
        <div className="bg-slate-800 text-cyan-400 text-center py-2">
          💻 {typingUser} is coding...
        </div>
      )}

      <div className="bg-gray-800 text-center py-2">
        👥 Active Users: {users.join(", ")}
      </div>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-slate-900 border-r border-slate-700 p-4">
          <h2 className="text-xl font-bold mb-4">👥 Collaborators</h2>

          <ul className="space-y-2">
            {users.map((user, index) => (
              <li
                key={index}
                className={`px-3 py-2 rounded flex justify-between items-center ${
                  user === username ? "bg-blue-600" : "bg-slate-800"
                }`}
              >
                <span>{user === username ? `${user} (You)` : user}</span>

                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex gap-6 text-sm">
            <span>👥 {users.length} Online</span>
            <span>⚡ Live Sync</span>
            <span>🤖 AI Enabled</span>
            <span>🟢 Connected</span>
          </div>

          <CodeEditor
            roomId={roomId}
            username={username}
            code={code}
            setCode={setCode}
            language={language}
          />
        </div>
      </main>

      {showAI && (
        <AIHelperModal
          suggestion={suggestion}
          onClose={() => setShowAI(false)}
          onInsert={() => {
            setCode(suggestion);
            setShowAI(false);
          }}
        />
      )}
    </div>
  );
};

export default Room;
