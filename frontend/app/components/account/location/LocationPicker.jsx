// components/LocationPicker/LocationPicker.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import SearchBar from "./SearchBar";
import MapComponent from "./Map";
import LocationDetails from "./LocationDetails";
import { useCurrentLocation } from "@/lib/hooks/useCurrentLocation";

export default function LocationPicker({ isOpen, onClose, onConfirm }) {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 30.0444, // Default to Cairo
    lng: 31.2357,
    address: "",
    details: "",
  });
  const { latitude, longitude, loading, error, getLocation } =
    useCurrentLocation();

  //   useEffect(() => {
  //     getLocation();
  //     if (!loading) {
  //       setSelectedLocation((prev) => {
  //         return {
  //           ...prev,
  //           lat: latitude,
  //           lng: longitude,
  //         };
  //       });
  //     }
  //   }, []);

  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirm = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-primary-text">
            Add new address
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-primary-text transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-primary dark:text-primary-text"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4">
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>

        {/* Map */}
        <div className="relative h-100 w-full">
          <MapComponent
            center={[selectedLocation.lat, selectedLocation.lng]}
            onLocationChange={handleLocationSelect}
          />

          {/* Center Pin Overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="flex h-8 w-8 -translate-y-4 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-gray-900"></div>
            </div>
          </div>

          {/* Delivery Label */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-16">
            <div className="whitespace-nowrap rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
              Your order will be delivered here
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <LocationDetails
          address={selectedLocation.address}
          details={selectedLocation.details}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}
