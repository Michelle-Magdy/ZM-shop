"use client";

import { IoLocationSharp } from "react-icons/io5";

export default function LocationDetails({
  state,
  village,
  suburb,
  displayName,
}) {
  return (
    <div className="flex items-center gap-4 border-t border-gray-100 bg-card pt-6 px-6">
      <div className="flex flex-1 items-start gap-3">
        <div className="flex h-10 max-w-10  items-center justify-center rounded-full bg-gray-100">
          <IoLocationSharp className="text-primary" size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Current Location
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-primary-text">
            {village || suburb} {(village || suburb) && ", "} {state}
          </h3>
          {displayName && (
            <p className="mt-0.5 truncate text-sm text-secondary">
              {displayName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
