import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import socket from "../socket";
import { sendCursorUpdate, renderRemoteCursor } from "../utils/cursorSync";

const CodeEditor = ({ roomId, username, code, setCode }) => {
  const editorRef = useRef(null);
  const remoteCursorMap = useRef({});
  const typingTimeoutRef = useRef(null);

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
    <Editor
      height="80vh"
      defaultLanguage="javascript"
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
  );
};

export default CodeEditor;
