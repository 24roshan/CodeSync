import { X } from "lucide-react";

export default function AIHelperModal({ suggestion, onClose, onInsert }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white w-[800px] max-h-[80vh] rounded-xl shadow-2xl overflow-hidden">
  
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">🤖 AI Interview Mode</h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-auto max-h-[55vh]">
          <pre className="whitespace-pre-wrap text-sm">{suggestion}</pre>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onInsert}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            Insert
          </button>

          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
