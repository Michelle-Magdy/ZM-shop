"use client";

import { memo } from "react";
import { FaMapMarkerAlt, FaTrain, FaBus, FaHome } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";

const categoryIcons = {
  suburb: FaHome,
  hamlet: FaHome,
  village: FaHome,
  stop: FaBus,
  train_station: FaTrain,
  default: HiOutlineLocationMarker,
};

const categoryLabels = {
  suburb: "Suburb",
  hamlet: "Hamlet",
  village: "Village",
  stop: "Bus Stop",
  train_station: "Train Station",
  default: "Location",
};

function getCategoryIcon(category) {
  return categoryIcons[category] || categoryIcons.default;
}

function getCategoryLabel(category) {
  return categoryLabels[category] || categoryLabels.default;
}

function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

const SearchResultItem = memo(function SearchResultItem({
  place,
  onSelect,
  isSelected,
}) {
  const Icon = getCategoryIcon(place.category);
  const categoryLabel = getCategoryLabel(place.category);
  const isFar = place.distance_m > 10000;

  return (
    <button
      onClick={() => onSelect(place)}
      className={`
        group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left
        transition-all duration-150 sm:gap-4 sm:px-4 sm:py-3.5
        ${
          isSelected
            ? "bg-primary/10 ring-1 ring-primary"
            : "hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-800/50 dark:active:bg-gray-800"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
        flex h-9 w-9 shrink-0 items-center justify-center rounded-full
        sm:h-10 sm:w-10
        ${
          isSelected
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary dark:bg-gray-800 dark:text-gray-400"
        }
        transition-colors
      `}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`
            truncate text-sm font-semibold sm:text-base
            ${isSelected ? "text-primary" : "text-gray-900 dark:text-gray-100"}
          `}
          >
            {place.name}
          </h3>
          {isFar && (
            <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 sm:text-xs">
              Far
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          {place.locality}
          {place.region && place.region !== place.locality && (
            <span className="text-gray-400">, {place.region}</span>
          )}
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-gray-400 sm:text-xs">
          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="h-3 w-3" />
            {formatDistance(place.distance_m)}
          </span>
          <span className="uppercase tracking-wider text-gray-300 dark:text-gray-600">
            {place.country}
          </span>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="mt-1 hidden h-2 w-2 shrink-0 rounded-full bg-primary sm:block" />
      )}
    </button>
  );
});

export default function SearchResults({
  data,
  onLocationSelect,
  selectedPlaceId,
  isLoading,
  isError,
  error,
  query,
}) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-2 px-2 py-3 sm:px-3 sm:py-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5"
          >
            <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800 sm:h-10 sm:w-10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="px-4 py-8 text-center sm:py-12">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <HiOutlineLocationMarker className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-base">
          Search failed
        </h3>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {error?.message || "Something went wrong. Please try again."}
        </p>
      </div>
    );
  }

  // Empty / initial state
  if (!query || query.length <= 2) {
    return (
      <div className="px-4 py-8 text-center sm:py-12">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <HiOutlineLocationMarker className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base">
          Start typing to search
        </h3>
        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
          Enter at least 3 characters to find locations
        </p>
      </div>
    );
  }

  // No results
  if (!data?.places || data.places.length === 0) {
    return (
      <div className="px-4 py-8 text-center sm:py-12">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <HiOutlineLocationMarker className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base">
          No locations found
        </h3>
        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
          Try a different search term
        </p>
      </div>
    );
  }

  // Results list - LARGER HEIGHT
  return (
    <div className="h-full md:h-[60vh] lg:h-[70vh] overflow-y-auto px-2 py-2 sm:px-3 sm:py-3">
      <div className="mb-2 flex items-center justify-between px-1 sm:mb-3">
        <span className="text-xs font-medium text-gray-400 sm:text-sm">
          {data.count} result{data.count !== 1 ? "s" : ""}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-gray-300 dark:text-gray-600 sm:text-xs">
          {data.source?.replace("_", " ")}
        </span>
      </div>

      <div className="space-y-1 sm:space-y-1.5">
        {data.places.map((place) => (
          <SearchResultItem
            key={place.id}
            place={place}
            onSelect={onLocationSelect}
            isSelected={selectedPlaceId === place.id}
          />
        ))}
      </div>
    </div>
  );
}
