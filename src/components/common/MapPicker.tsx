import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, CircleMarker, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

// Simple click-capture component
function ClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Fly to center helper
function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 13));
  }, [center, map]);
  return null;
}

export type MapPickerProps = {
  /** Current value; pass nulls when unset */
  value?: { lat: number | null; lng: number | null };
  /** Called whenever the user picks a point */
  onChange: (lat: number, lng: number) => void;
  /** Map height (default 320) */
  height?: number | string;
  /** Optional className wrapper */
  className?: string;
  /** Initial center when no value exists */
  defaultCenter?: [number, number];
  /** Initial zoom */
  defaultZoom?: number;
  /** Show a "Use my location" button */
  showLocate?: boolean;
};

const MapPicker: React.FC<MapPickerProps> = ({
  value,
  onChange,
  height = 320,
  className,
  defaultCenter = [5.6037, -0.1870], // Accra as a reasonable default; change if you like
  defaultZoom = 12,
  showLocate = true,
}) => {
  const [center, setCenter] = useState<[number, number]>(() => {
    const lat = value?.lat ?? null;
    const lng = value?.lng ?? null;
    return lat != null && lng != null ? [lat, lng] : defaultCenter;
  });

  useEffect(() => {
    const lat = value?.lat ?? null;
    const lng = value?.lng ?? null;
    if (lat != null && lng != null) {
      setCenter([lat, lng]);
    }
  }, [value?.lat, value?.lng]);

  const containerStyle = useMemo(
    () => ({ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }),
    [height]
  );

  const handlePick = useCallback(
    (lat: number, lng: number) => {
      onChange(lat, lng);
    },
    [onChange]
  );

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter([lat, lng]);
        onChange(lat, lng);
      },
      () => {
        // silently ignore errors
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onChange]);

  const hasPoint = value?.lat != null && value?.lng != null;
  const point = hasPoint ? ([value!.lat!, value!.lng!] as LatLngExpression) : null;

  return (
    <div className={className}>
      {showLocate && (
        <div className="mb-2 flex items-center gap-2">
          <button
            type="button"
            onClick={locateMe}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
          >
            Use my location
          </button>
          <span className="text-xs text-gray-500">Click on the map to set a pin.</span>
        </div>
      )}

      <MapContainer center={center} zoom={defaultZoom} style={containerStyle}>
        {/* Free dev tiles. For production, switch to a key-based provider. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCapture onPick={handlePick} />
        <FlyTo center={center} />
        {point && (
          <CircleMarker center={point} radius={8} stroke={true} weight={2} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
