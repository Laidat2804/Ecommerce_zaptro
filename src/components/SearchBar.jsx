import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ search, setSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setSearch("");
  };

  return (
    <div className="w-full">
      <div
        className={`relative flex items-center bg-white rounded-lg border-2 transition-all ${
          isFocused ? "border-red-500 shadow-lg" : "border-gray-300"
        }`}
      >
        <Search className="ml-2 md:ml-3 text-gray-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base outline-none text-gray-800"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 md:mr-3 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
