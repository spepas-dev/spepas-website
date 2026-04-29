// src/lib/addressApis.ts
import apiClient from './axios';
import {
  addAddressSchema,
  getAddressDetailsByIdParamsSchema
} from './addressZodValidation';

// `userAddress.location` is a Json column on the backend, so historic rows ship
// in inconsistent shapes:
//   - GeoJSON: { type: 'Point', coordinates: [lng, lat] }
//   - Legacy:  { lat, lng, address? }
//   - null / missing
// Normalising on the client keeps the renderer simple.
export interface AddressLocation {
  lat: number | null;
  lng: number | null;
  raw: unknown;
}

export interface Address {
  address_id: string;
  title: string;
  addressDetails: string;
  date_added: string;
  status: number;
  location: AddressLocation;
}

const toFiniteNumber = (val: unknown): number | null => {
  const n = typeof val === 'string' ? parseFloat(val) : (val as number);
  return Number.isFinite(n) ? (n as number) : null;
};

export const normaliseLocation = (raw: unknown): AddressLocation => {
  if (!raw || typeof raw !== 'object') {
    return { lat: null, lng: null, raw };
  }
  const r = raw as Record<string, unknown>;

  // GeoJSON / order-service shape: { type: 'Point', coordinates: [lng, lat] }
  if (Array.isArray(r.coordinates) && r.coordinates.length >= 2) {
    return {
      lat: toFiniteNumber(r.coordinates[1]),
      lng: toFiniteNumber(r.coordinates[0]),
      raw
    };
  }

  // Legacy shape: { lat, lng, address? }
  if ('lat' in r || 'lng' in r) {
    return {
      lat: toFiniteNumber(r.lat),
      lng: toFiniteNumber(r.lng),
      raw
    };
  }

  return { lat: null, lng: null, raw };
};

const normaliseAddress = (raw: unknown): Address | null => {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.address_id === 'string' ? r.address_id : null;
  if (!id) return null;
  return {
    address_id: id,
    title: typeof r.title === 'string' ? r.title : '',
    addressDetails: typeof r.addressDetails === 'string' ? r.addressDetails : '',
    date_added: typeof r.date_added === 'string' ? r.date_added : '',
    status: typeof r.status === 'number' ? r.status : 1,
    location: normaliseLocation(r.location)
  };
};

// POST: Add New Address
export const addAddress = async (payload: {
  title: string;
  addressDetails: string;
  longitude: number;
  latitude: number;
}) => {
  addAddressSchema.parse(payload);
  const { data } = await apiClient.post('/address/add-address', payload);
  return data;
};

// GET: Get User's Addresses
//
// Returns the standard backend wrapper { status, message, data } unchanged so
// callers can read the status code, but normalises `data` to a clean
// `Address[]` (never undefined) and parses each row's location shape.
export const getMyAddresses = async (): Promise<{
  status: number;
  message?: string;
  data: Address[];
}> => {
  const { data } = await apiClient.get('/address/get-my-addresses');
  const status = typeof data?.status === 'number' ? data.status : 0;
  const message = typeof data?.message === 'string' ? data.message : undefined;
  const list = Array.isArray(data?.data)
    ? data.data.map(normaliseAddress).filter((x: Address | null): x is Address => x !== null)
    : [];
  return { status, message, data: list };
};

// GET: Get Address Detail By ID
export const getAddressDetailsById = async (address_id: string) => {
  getAddressDetailsByIdParamsSchema.parse({ address_id });
  const { data } = await apiClient.get(`/address/get-details-by-id/${address_id}`);
  return data;
};
