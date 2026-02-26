// components/LocationPicker/MapComponent.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

// Component to handle map view updates
function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;
    console.log(center);
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// Component to handle map events
function MapEvents({ onLocationChange }) {
  const map = useMapEvents({
    mouseup: () => {
      const center = map.getCenter();

      onLocationChange(center.lat, center.lng);
    },
  });

  return null;
}

export default function Map({ center, onLocationChange }) {
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
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      <MapEvents onLocationChange={onLocationChange} />
      {/* <Marker position={center} icon={locationIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

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
