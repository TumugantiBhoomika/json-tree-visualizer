import React from "react";

export default function SearchBar({ searchPath, setSearchPath, onSearch }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={searchPath}
        onChange={(e) => setSearchPath(e.target.value)}
        placeholder="$.user.address.city"
        className="border rounded-lg p-2 w-64 dark:bg-gray-700 dark:text-white"
      />
      <button
        onClick={onSearch}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Search
      </button>
    </div>
  );
}
