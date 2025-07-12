// utils/cursorSync.js

// 🎨 Color map based on username hash
const getColorForUser = (username) => {
  const colors = [
    "rgba(255, 99, 132, 0.3)", // red
    "rgba(54, 162, 235, 0.3)", // blue
    "rgba(255, 206, 86, 0.3)", // yellow
    "rgba(75, 192, 192, 0.3)", // teal
    "rgba(153, 102, 255, 0.3)", // purple
    "rgba(255, 159, 64, 0.3)", // orange
  ];
  const index =
    username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// 📤 Emit cursor position
export const sendCursorUpdate = (editor, socket, roomId, username) => {
  editor.onDidChangeCursorSelection((e) => {
    const selection = e.selection;
    socket.emit("cursor_update", {
      roomId,
      username,
      selection: {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn,
      },
    });
  });
};

// 🎯 Render remote cursors with decorations
export const renderRemoteCursor = (editor, remoteCursorMap) => {
  Object.entries(remoteCursorMap).forEach(
    ([user, { selection, decorationIds }]) => {
      const userColor = getColorForUser(user);

      const newDecorations = editor.deltaDecorations(decorationIds || [], [
        {
          range: new window.monaco.Range(
            selection.startLineNumber,
            selection.startColumn,
            selection.endLineNumber,
            selection.endColumn
          ),
          options: {
            className: "foreign-cursor",
            hoverMessage: { value: `**${user}**` },
            backgroundColor: userColor,
            after: {
              content: `⬅ ${user}`,
              inlineClassName: "cursor-label",
            },
          },
        },
      ]);

      remoteCursorMap[user].decorationIds = newDecorations;
    }
  );
};
