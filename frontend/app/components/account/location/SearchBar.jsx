// components/LocationPicker/SearchBar.tsx
"use client";

import { useCurrentLocation } from "@/lib/hooks/useCurrentLocation";
import { useEffect, useState } from "react";
import { IoSearch, IoLocate } from "react-icons/io5";

export default function SearchBar({ onLocationSelect, query, setQuery }) {
  // const [query, setQuery] = useState("");
  const { latitude, longitude, loading, error, getLocation } =
    useCurrentLocation();

  const handleUseCurrentLocation = () => {
    getLocation();
  };
  useEffect(() => {
    if (!loading && !error && latitude && longitude) {
      onLocationSelect({
        lat: latitude,
        lng: longitude,
        address: "Current Location",
        details: "Using GPS coordinates",
      });
    }
  }, [latitude, longitude, loading, error, onLocationSelect]);

  return (
    <div className="flex gap-3">
      <form className="flex-1">
        <div className="relative dark:bg-primary-hover bg-button-label rounded-xl ">
          <IoSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for your national address, building..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 py-3 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 bg-transparent focus:border-cyan-800 focus:ring-cyan-600 dark:focus:border-secondary-text  focus:ring-1 dark:focus:ring-secondary-text"
          />
        </div>
      </form>

      <button
        onClick={handleUseCurrentLocation}
        className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-gray-200 dark:border-0 bg-background px-4 py-2 text-sm font-medium text-primary-text transition-colors hover:bg-blue-50 hover:text-cyan-700 dark:bg-primary dark:hover:bg-primary-hover dark:hover:text-primary-text"
      >
        <IoLocate size={18} />
        {<span className="hidden lg:block">Use current location</span>}
      </button>
    </div>
  );
}
