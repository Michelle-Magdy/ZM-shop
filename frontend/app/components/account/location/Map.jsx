// components/LocationPicker/MapComponent.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default markers in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Component to handle map view updates
function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// Component to handle map events
function MapEvents({ onLocationChange }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      // In production, reverse geocode the center coordinates
      onLocationChange({
        lat: center.lat,
        lng: center.lng,
        address: "Selected Location",
        details: `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`,
      });
    },
  });

  return null;
}

export default function MapComponent({ center, onLocationChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={true}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      <MapEvents onLocationChange={onLocationChange} />

      {/* Custom zoom controls */}
      <div className="absolute right-4 top-4 z-1000 flex flex-col gap-2">
        <button
          onClick={() => {
            const map = document.querySelector(".leaflet-container");
            if (map && map._leaflet_map) {
              map._leaflet_map.zoomIn();
            }
          }}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 shadow-lg transition-colors hover:bg-gray-50"
        >
          +
        </button>
        <button
          onClick={() => {
            const map = document.querySelector(".leaflet-container");
            if (map && map._leaflet_map) {
              map._leaflet_map.zoomOut();
            }
          }}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 shadow-lg transition-colors hover:bg-gray-50"
        >
          −
        </button>
      </div>
    </MapContainer>
  );
}
