'use client';

import * as L from 'leaflet';
import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

interface Location {
  latitude: number;
  longitude: number;
}

interface MapPickerProps {
  onLocationSelect: (coords: Location) => void;
}

function LocationMarker({ onLocationSelect }: MapPickerProps) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    }
  });
  return null;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number]>([40.7831, -73.9712]);

  const handleLocationSelect = (coords: Location) => {
    setPosition([coords.latitude, coords.longitude]);
    onLocationSelect(coords);
  };

  return (
    <MapContainer center={position as L.LatLngExpression} zoom={13} scrollWheelZoom={false} style={{ height: '300px', width: '100%' }}>
      <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Selected Location</Popup>
      </Marker>
      <LocationMarker onLocationSelect={handleLocationSelect} />
    </MapContainer>
  );
};

export default MapPicker;
