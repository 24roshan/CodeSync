import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../socket";
import copy from "copy-to-clipboard";
import CodeEditor from "../components/CodeEditor";
import axios from "axios";
import AIHelperModal from "../components/AIHelperModal";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [code, setCode] = useState("// start coding ");
  const [username, setUsername] = useState(null);
  const hasJoinedRef = useRef(false);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const lastReceivedCode = useRef("");
  const [language, setLanguage] = useState("javascript");
  const [showAI, setShowAI] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
   let storedName = sessionStorage.getItem("username");

   if (!storedName) {
     const urlParams = new URLSearchParams(window.location.search);
     const fromUrl = urlParams.get("username");

     if (fromUrl && fromUrl.trim() !== "") {
       storedName = fromUrl.trim();
       sessionStorage.setItem("username", storedName);
     } else {
       let inputName = "";
       while (!inputName || inputName.trim() === "") {
         inputName = prompt("Enter your name to join the room:");
         if (inputName === null) {
           alert(" Username is required to join the room.");
           navigate("/");
           return;
         }
       }
       storedName = inputName.trim();
       sessionStorage.setItem("username", storedName);
     }
   }

   setUsername(storedName);

  }, [navigate]);

  useEffect(() => {
    if (!username || !roomId || hasJoinedRef.current) return;

    console.log(" Joining room:", { roomId, username });
    socket.emit("join-room", { roomId, username });
    hasJoinedRef.current = true;
    socket.on("loadCode", (code) => {
      setCode(code);
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
    socket.on("user-typing", (name) => {
      console.log("Typing from:", name);
      if (name !== username) setTypingUser(name);
    });
    socket.on("user-stop-typing", () => {
      console.log(" Typing stopped");
      setTypingUser(null);
    });
    socket.on("room-users", (activeUsers) => {
      setUsers(activeUsers.map((u) => u.username));
    });
    socket.emit("codeChange", { roomId, code });

    return () => {
      socket.off("code-update");
      socket.off("user-joined");
      socket.off("room-users");
    };
  }, [roomId, username]);
  const typingTimeout = useRef(null);

  const handleEditorChange = (value) => {
    lastReceivedCode.current = value;
    setCode(value);
    socket.emit("code-change", { roomId, code: value });

    socket.emit("typing", { roomId, username });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId });
    }, 1000);
  };
  const handleCopyJoinLink = () => {
    if (roomId) {
      copy(`http://localhost:3000/room/${roomId}`);
      setShowToast("🔗 Room link copied!");
      setTimeout(() => setShowToast(null), 3000);
    } else {
      setShowToast(" Room ID not found.");
      setTimeout(() => setShowToast(null), 3000);
    }
  };
  <select onChange={(e) => setLanguage(e.target.value)} value={language}>
    <option value="javascript">JavaScript</option>
    <option value="python">Python</option>
    <option value="cpp">C++</option>
    <option value="java">java</option>
  </select>;

    const generateInterviewQuestions=async()=>{
      try{
        setLoadingAI(true);
        const prompt=`Analyze this code:${code}
        Generate:
        1. 5 Technical Interview Questions
        2. Detailed Answers
        3. Time Complexity
        4. Space Complexity
        5. Optimization Suggestions

        Return response in a clean format.`;
        const res=await axios.post(
          "http://localhost:5000/api/ai/interview",
          {prompt}

        );
        setSuggestion(res.data.suggestion);
        setShowAI(true);
      }catch(err){
        console.error(err);
        alert("AI request failed");
      }finally{
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

          <div className="flex gap-3">
            <button
              onClick={handleCopyJoinLink}
              className="bg-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-700"
            >
              🔗 Share
            </button>

            <button
              onClick={generateInterviewQuestions}
              className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              🤖 AI Copilot
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem("username");
                window.location.href = "/";
              }}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Leave
            </button>
          </div>
        </div>
      </header>
      {showToast && (
        <div className="bg-green-600 text-white text-sm text-center py-1">
          {showToast}
        </div>
      )}
      {typingUser && (
        <div className="text-center text-sm text-gray-300 italic flex items-center justify-center gap-1">
          <div className="bg-slate-800 text-cyan-400 text-sm py-2 px-4 border-b border-slate-700">
            💻 {typingUser} is coding...
          </div>
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-200">.</span>
          <span className="animate-bounce delay-400">.</span>
        </div>
      )}

      <div className="bg-gray-800 p-2 text-sm text-white flex gap-4 justify-center">
        active:{users.join(",")}
      </div>
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-slate-900 border-r border-slate-700 p-4">
          <h2 className="text-xl font-bold mb-4">👥 Collaborators</h2>

          <ul className="space-y-2">
            {users.map((u, i) => (
              <li
                key={i}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  u === username
                    ? "bg-blue-600"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <span>{u === username ? `${u} (You)` : u}</span>

                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex gap-6 text-sm">
            <span>👥 {users.length} Online</span>
            <span>⚡ Live Sync Active</span>
            <span>🤖 AI Enabled</span>
            <span>🟢 Connected</span>
          </div>
          <CodeEditor
            roomId={roomId}
            username={username}
            code={code}
            setCode={setCode}
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
