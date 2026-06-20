import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import socket from "../socket";
import { sendCursorUpdate, renderRemoteCursor } from "../utils/cursorSync";
import axios from "axios";

const CodeEditor = ({ roomId, username, code, setCode }) => {
  const editorRef = useRef(null);
  const remoteCursorMap = useRef({});
  const typingTimeoutRef = useRef(null);

  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleMount = (editor) => {
    editorRef.current = editor;

    sendCursorUpdate(editor, socket, roomId, username);

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
      const res = await axios.post(
        "https://codesync-1-d3cy.onrender.com/api/run",
        {
          code,
          language,
        },
      );

      setOutput(res.data.output);
    } catch (err) {
      console.error(err);
      setOutput("❌ Error running code");
    }
  };

  const handleChange = (value) => {
    const updatedCode = value || "";

    setCode(updatedCode);

    socket.emit("code-change", {
      roomId,
      code: updatedCode,
    });

    socket.emit("typing", {
      roomId,
      username,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        roomId,
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      socket.off("cursor_update");
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-3 p-3 bg-slate-800 border-b border-slate-700">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-700 text-white px-3 py-2 rounded-lg outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <button
          onClick={runCode}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ▶ Run Code
        </button>

        <div className="ml-auto text-sm text-green-400">● Connected</div>
      </div>

      <div className="flex-1">
        <Editor
          height="70vh"
          language={language}
          theme="vs-dark"
          value={code}
          onMount={handleMount}
          onChange={handleChange}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      <div className="bg-black border-t border-slate-700 p-4 min-h-[150px]">
        <h3 className="text-green-400 font-bold mb-2">Console Output</h3>

        <pre className="text-green-300 whitespace-pre-wrap">
          {output || "Run your code to see output..."}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
