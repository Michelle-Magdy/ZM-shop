// components/LocationPicker/LocationDetails.tsx
"use client";

import { IoLocationSharp } from "react-icons/io5";

export default function LocationDetails({ address, details, onConfirm }) {
  return (
    <div className="flex items-center gap-4 border-t border-gray-100 bg-white p-6">
      <div className="flex flex-1 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <IoLocationSharp className="text-gray-700" size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Current Location
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-gray-900">
            {address}
          </h3>
          {details && (
            <p className="mt-0.5 truncate text-sm text-gray-500">{details}</p>
          )}
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="shrink-0 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95"
      >
        CONFIRM LOCATION
      </button>
    </div>
  );
}
