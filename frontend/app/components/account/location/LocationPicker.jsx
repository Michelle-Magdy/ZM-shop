"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import SearchBar from "./SearchBar";
import Map from "./Map";
import LocationDetails from "./LocationDetails";
import { useCurrentLocation } from "@/lib/hooks/useCurrentLocation";
import { FaLocationDot } from "react-icons/fa6";
import useDebounced from "@/lib/hooks/useDebounced";
import { getAddressFromLocation } from "@/lib/api/address";
import AddressForm from "./AddressForm";

export default function LocationPicker({
  isOpen,
  onClose,
  onConfirm,
  defaultValues,
}) {
  const [selectedLocation, setSelectedLocation] = useState(defaultValues);
  const [query, setQuery] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const { latitude, longitude, loading, error, getLocation } =
    useCurrentLocation();

  const prevIsOpenRef = useRef(false);
  const abortControllerRef = useRef(null);
  const { lat, lng } = selectedLocation;
  const debouncedLat = useDebounced(lat);
  const debouncedLng = useDebounced(lng);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      getLocation();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, getLocation]);

  useEffect(() => {
    if (!loading && !error && latitude && longitude) {
      setSelectedLocation((prev) => ({
        ...prev,
        lat: latitude,
        lng: longitude,
      }));
    }
  }, [latitude, longitude, loading, error]);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (debouncedLat == null || debouncedLng == null) return;

    const fetchAddress = async () => {
      try {
        const data = await getAddressFromLocation(
          lat,
          lng,
          abortControllerRef.current?.signal,
        );
        if (!data) return;

        setSelectedLocation((prev) => ({
          ...prev,
          state: data.address.state,
          village: data.address.village,
          displayName: data.display_name,
          suburb: data.address.suburb,
        }));
      } catch (err) {
        if (err.name === "AbortError" || err.name === "CanceledError") {
          console.log("Request was cancelled");
          return;
        }

        setSelectedLocation((prev) => ({
          ...prev,
          state: "Current Location",
          village: "",
          suburb: "",
          displayName: `${debouncedLat.toFixed(4)}, ${debouncedLng.toFixed(4)}`,
        }));
      }
    };
    fetchAddress();
    return () => abortControllerRef.current?.abort();
  }, [debouncedLng, debouncedLat]);

  const handleLocationSelect = useCallback((lat, lng) => {
    setSelectedLocation((prev) => ({ ...prev, lat, lng }));
  }, []);

  // Validation function for mobile button
  const validateForm = () => {
    const errors = {};

    if (!selectedLocation.label?.trim()) {
      errors.label = "Label is required";
    }

    // Validate lat/lng if needed
    if (selectedLocation.lat == null) {
      errors.lat = "Latitude is required";
    }
    if (selectedLocation.lng == null) {
      errors.lng = "Longitude is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = () => {
    // Validate before confirming
    if (!validateForm()) {
      return;
    }

    onConfirm?.(selectedLocation);
    onClose();
  };

  // Handle form submit from desktop button
  const handleFormConfirm = (label, isDefault) => {
    onConfirm?.({
      ...selectedLocation,
      label,
      isDefault,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:w-[95%] sm:max-w-4xl h-[85vh] sm:h-auto sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-card shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 shrink-0 bg-card">
          <h2 className="text-lg sm:text-xl font-semibold text-primary-text truncate pr-4">
            Add new address
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-primary-text transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-primary dark:text-primary-text shrink-0"
            aria-label="Close"
          >
            <IoClose size={24} className="sm:w-6 sm:h-6 w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-20 sm:pb-0">
          {/* Search Bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-card z-10 shadow-sm sm:shadow-none">
            <SearchBar
              onLocationSelect={handleLocationSelect}
              query={query}
              setQuery={setQuery}
            />
          </div>
          {/* Details & Form Sections */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
            <AddressForm
              label={selectedLocation?.label}
              isDefault={selectedLocation?.isDefault}
              setSelectedLocation={setSelectedLocation}
              onConfirm={handleFormConfirm}
              errors={formErrors}
              setErrors={setFormErrors}
            />
            <LocationDetails
              state={selectedLocation.state}
              village={selectedLocation.village}
              suburb={selectedLocation.suburb}
              displayName={selectedLocation.displayName}
            />
          </div>

          {/* Map */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <Map
              center={[selectedLocation.lat, selectedLocation.lng]}
              onLocationChange={handleLocationSelect}
            />

            {/* Center Pin Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-1000">
              <div className="relative -translate-y-4 sm:-translate-y-5">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-primary drop-shadow-lg">
                  <FaLocationDot className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
            </div>

            {/* Delivery Label */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-1000 -translate-x-1/2 -translate-y-16 sm:-translate-y-20">
              <div className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white shadow-lg">
                Your order will be delivered here
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-primary"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Fixed Bottom Button */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 border-t border-gray-100 p-4 bg-card z-50">
          <button
            onClick={handleConfirm}
            className="w-full rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white active:scale-95 transition-transform shadow-lg"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
