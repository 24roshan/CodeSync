import React, { useEffect, useRef, useState } from "react"; // ✅ Added useState
import Editor from "@monaco-editor/react";
import socket from "../socket";
import { sendCursorUpdate, renderRemoteCursor } from "../utils/cursorSync";
import axios from "axios";

const CodeEditor = ({ roomId, username, code, setCode }) => {
  const editorRef = useRef(null);
  const remoteCursorMap = useRef({});
  const typingTimeoutRef = useRef(null);
  const [output, setOutput] = useState(""); // 👈 output state

  const [language, setLanguage] = useState("javascript"); 

  const handleMount = (editor) => {
    editorRef.current = editor;

    // Start sending cursor updates
    sendCursorUpdate(editor, socket, roomId, username);

    // Listen for others' cursors
    socket.on("cursor_update", ({ username: otherUser, selection }) => {
      if (otherUser === username || !editor) return;

      if (!remoteCursorMap.current[otherUser]) {
        remoteCursorMap.current[otherUser] = {};
      }

      remoteCursorMap.current[otherUser].selection = selection;
      renderRemoteCursor(editor, remoteCursorMap.current);
    });
  };
  const runCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/run", {
        code,
        language,
      });
      setOutput(res.data.output);
    } catch (err) {
      console.error(err);
      setOutput(" Error running code");
    }
  };


  const handleChange = (value) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });

    socket.emit("typing", { roomId, username });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      socket.off("cursor_update");
    };
  }, []);

  return (
    <div>
      {/*  Language Selector */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "8px" }}>Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      {/*  Run Button */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={runCode}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: "#00b894",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Run Code
        </button>
      </div>

      {/* Output Panel */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          color: "#00ff95",
          padding: "10px",
          borderRadius: "8px",
          minHeight: "100px",
        }}
      >
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>

      <Editor
        height="80vh"
        language={language} 
        theme="vs-dark"
        value={code}
        onMount={handleMount}
        onChange={handleChange}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
