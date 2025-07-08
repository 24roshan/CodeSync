import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../socket";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [code, setCode] = useState("// start coding 💻");
  const [username, setUsername] = useState(null);
  const hasJoinedRef = useRef(false);
  const [users,setUsers]=useState([]);

  // 🔒 Ask for username and store safely
  useEffect(() => {
    let storedName = sessionStorage.getItem("username");

    if (!storedName) {
      let inputName = "";

      while (!inputName || inputName.trim() === "") {
        inputName = prompt("Enter your name to join the room:");
        if (inputName === null) {
          alert("❌ Username is required to join the room.");
          navigate("/"); // 🔁 Redirect to homepage
          return;
        }
      }

      storedName = inputName.trim();
      sessionStorage.setItem("username", storedName);
    }

    setUsername(storedName);
  }, [navigate]);

  // 🔁 Join room and setup listeners
  useEffect(() => {
    if (!username || !roomId || hasJoinedRef.current) return;

    console.log("⚡ Joining room:", { roomId, username });
    socket.emit("join-room", { roomId, username });
    hasJoinedRef.current = true;

    socket.on("code-update", (newCode) => {
      if (newCode !== editorRef.current) {
        setCode(newCode);
      }
    });

    socket.on("user-joined", (name) => {
      console.log(`📥 ${name} joined the room.`);
    });
    socket.on("room-users",(activeUsers)=>{
      setUsers(activeUsers.map(u=>u.username));
    });

    return () => {
      socket.off("code-update");
      socket.off("user-joined");
      socket.off("room-users");
    };
  }, [roomId, username]);

  // ✏️ Code change handler
  const handleEditorChange = (value) => {
    editorRef.current = value;
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <header className="py-4 text-center text-xl font-semibold bg-gray-800">
        🧠 CollabSync – Room: {roomId}
      </header>
      <div ClassName="bg-gray-800 p-2 text-sm text-white flex gap-4 justify-center">
        active:{users.join(",")}
      </div>
      <main className="flex-1 px-4 pb-4">
        <Editor
          height="80vh"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </main>
    </div>
  );
};

export default Room;
