import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const LIBRARIES: ('places')[] = ['places'];

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
  defaultCenter?: { lat: number; lng: number };
  /** Initial zoom */
  defaultZoom?: number;
  /** Show a "Use my location" button */
  showLocate?: boolean;
  /** Show the Places Autocomplete search box */
  showSearch?: boolean;
  /** Read-only mode — shows a marker but disables clicking */
  readOnly?: boolean;
};

const MapPicker: React.FC<MapPickerProps> = ({
  value,
  onChange,
  height = 320,
  className,
  defaultCenter = { lat: 5.6037, lng: -0.1870 },
  defaultZoom = 12,
  showLocate = true,
  showSearch = true,
  readOnly = false,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [locating, setLocating] = useState(false);

  const center = useMemo(() => {
    const lat = value?.lat ?? null;
    const lng = value?.lng ?? null;
    return lat != null && lng != null ? { lat, lng } : defaultCenter;
  }, [value?.lat, value?.lng, defaultCenter]);

  const containerStyle = useMemo(
    () => ({ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }),
    [height]
  );

  // Pan map when value changes externally
  useEffect(() => {
    if (mapRef.current && value?.lat != null && value?.lng != null) {
      mapRef.current.panTo({ lat: value.lat, lng: value.lng });
    }
  }, [value?.lat, value?.lng]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (readOnly) return;
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat != null && lng != null) {
        onChange(lat, lng);
      }
    },
    [onChange, readOnly]
  );

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onChange(lat, lng);
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(15);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onChange]);

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onChange(lat, lng);
      mapRef.current?.panTo({ lat, lng });
      mapRef.current?.setZoom(15);
    }
  }, [onChange]);

  const hasPoint = value?.lat != null && value?.lng != null;

  if (!isLoaded) {
    return (
      <div className={className}>
        <div style={containerStyle} className="rounded-lg bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-sm text-gray-400">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Controls row */}
      {!readOnly && (showLocate || showSearch) && (
        <div className="mb-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {showSearch && (
            <Autocomplete
              onLoad={(ac) => { autocompleteRef.current = ac; }}
              onPlaceChanged={onPlaceChanged}
              options={{ componentRestrictions: { country: 'gh' } }}
            >
              <input
                type="text"
                placeholder="Search for a location..."
                className="w-full sm:flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)] focus:border-[var(--color-primary-400)] transition"
              />
            </Autocomplete>
          )}
          {showLocate && (
            <button
              type="button"
              onClick={locateMe}
              disabled={locating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition shrink-0 disabled:opacity-50"
            >
              {locating ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              )}
              Use my location
            </button>
          )}
        </div>
      )}

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={defaultZoom}
          onClick={handleMapClick}
          onLoad={(map) => { mapRef.current = map; }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
            gestureHandling: readOnly ? 'none' : 'greedy',
          }}
        >
          {hasPoint && (
            <Marker position={{ lat: value!.lat!, lng: value!.lng! }} />
          )}
        </GoogleMap>
      </div>

      {!readOnly && (
        <p className="mt-1.5 text-xs text-gray-400">Click on the map or search to set your location.</p>
      )}
    </div>
  );
};

export default MapPicker;
