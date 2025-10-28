import React, { useState } from "react";

export default function JsonInput({ onParse, error }) {
  const [input, setInput] = useState("");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Paste or type JSON data</h2>
      <textarea
        rows="14"
        placeholder='{\n  "user": { "id": 1, "name": "John Doe" }\n}'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
      />
      <button
        onClick={() => onParse(input)}
        className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Generate Tree
      </button>
      {error && <p className="text-red-500 mt-2 font-semibold">{error}</p>}
    </div>
  );
}
