import React, { useState } from "react";
import JsonTree from "./components/JsonTree";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [data, setData] = useState(null);
  const [searchPath, setSearchPath] = useState("");
  const [highlightPath, setHighlightPath] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");

  const handleParse = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setData(parsed);
      setError("");
      setHighlightPath(null);
    } catch {
      setData(null);
      setError("Invalid JSON format ❌");
    }
  };

  // ✅ Search function that matches a JSON path (like $.user.address.city)
  const handleSearch = () => {
    if (!searchPath.trim() || !data) {
      setHighlightPath(null);
      return;
    }

    const cleanedPath = searchPath
      .trim()
      .replace(/^\$?\.*\.?/, "$.") // ensure starts with "$."
      .replace(/\.\./g, "."); // clean double dots

    const parts = cleanedPath.split(".").slice(1);
    let current = data;
    let validPath = "$";

    for (const key of parts) {
      if (current && Object.prototype.hasOwnProperty.call(current, key)) {
        validPath += `.${key}`;
        current = current[key];
      } else if (Array.isArray(current) && !isNaN(parseInt(key))) {
        validPath += `.${key}`;
        current = current[parseInt(key)];
      } else {
        alert("Path not found in JSON data ❌");
        return;
      }
    }

    setHighlightPath(validPath);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex flex-col items-center justify-start p-6 dark:bg-gray-900 transition-colors duration-500">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🧩 JSON Tree Visualizer
            </h1>

            {/* Search bar + Dark mode toggle */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="$.user.address.city"
                value={searchPath}
                onChange={(e) => setSearchPath(e.target.value)}
                className="border p-2 rounded-lg text-sm w-64 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSearch}
                className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
              >
                Search
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="border px-3 py-2 rounded-lg dark:hover:bg-gray-700"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>

          {/* Input + Output grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">
                Paste or type JSON data
              </h2>
              <textarea
                rows="14"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 border rounded-lg font-mono text-sm dark:bg-gray-700 dark:text-white"
                placeholder={`{\n  "user": {\n    "id": 1,\n    "name": "John Doe",\n    "address": { "city": "New York", "country": "USA" },\n    "items": [ { "name": "item1" }, { "name": "item2" } ]\n  }\n}`}
              />
              <button
                onClick={handleParse}
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Generate Tree
              </button>
              {error && (
                <p className="text-red-500 mt-2 font-semibold">{error}</p>
              )}
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <JsonTree data={data} highlightPath={highlightPath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
