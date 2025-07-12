import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../socket";
import copy from "copy-to-clipboard";
import CodeEditor from "../components/CodeEditor";

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

  // 🔒 Ask for username and store safely
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

  // 🔁 Join room and setup listeners
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
  // ✏️ Code change handler
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


  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <header className="py-4 text-center text-xl font-semibold bg-gray-800">
         CollabSync – Room: {roomId}
        <div className="space-x-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              setShowToast("Room ID copied!");
              setTimeout(() => setShowToast(null), 2000);
            }}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
          >
            Copy Room id
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem("username");
              window.location.href = "/";
            }}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Leave
          </button>
          <button
            onClick={handleCopyJoinLink}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm ml-4"
          >
             Copy Room Link
          </button>
        </div>
      </header>
      {showToast && (
        <div className="bg-green-600 text-white text-sm text-center py-1">
          {showToast}
        </div>
      )}
      {typingUser && (
        <div className="text-center text-sm text-gray-300 italic flex items-center justify-center gap-1">
           {typingUser} is typing
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-200">.</span>
          <span className="animate-bounce delay-400">.</span>
        </div>
      )}

      <div className="bg-gray-800 p-2 text-sm text-white flex gap-4 justify-center">
        active:{users.join(",")}
      </div>
      <main className="flex-1 px-4 pb-4">
        <aside className="w-60 bg-gray-800 p-4 border-r border-gray-700">
          <h2 className="text-lg font-semibold mb-2">👥 Users</h2>
          <ul className="space-y-1 text-sm">
            {users.map((u, i) => (
              <li
                key={i}
                className={`px-2 py-1 rounded flex justify-between items-center ${
                  u === username ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <span>{u === username ? `${u} (You)` : u}</span>
                {u === typingUser && (
                  <span className="text-xs italic text-gray-300 animate-pulse ml-2">
                    typing...
                  </span>
                )}
              </li>
            ))}
          </ul>
        </aside>
        <CodeEditor
          roomId={roomId}
          username={username}
          code={code}
          setCode={setCode}
        />
      </main>
    </div>
  );
};

export default Room;
