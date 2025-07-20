export default function AIHelperModal({ suggestion, onClose, onInsert }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-auto shadow-xl">
        <h2 className="text-xl font-bold mb-4">💡 AI Suggestion</h2>
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
          {suggestion}
        </pre>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onInsert}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Insert to Editor
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
