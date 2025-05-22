// src/lib/addressApis.ts
import { addAddressSchema, getAddressDetailsByIdParamsSchema } from './addressZodValidation';
import apiClient from './axios';

// POST: Add New Address
export const addAddress = async (payload: { title: string; addressDetails: string; longitude: number; latitude: number }) => {
  addAddressSchema.parse(payload);
  const { data } = await apiClient.post('/address/add-address', payload);
  return data;
};

// GET: Get User's Addresses
export const getMyAddresses = async () => {
  const { data } = await apiClient.get('/address/get-my-addresses');
  return data;
};

// GET: Get Address Detail By ID
export const getAddressDetailsById = async (address_id: string) => {
  getAddressDetailsByIdParamsSchema.parse({ address_id });
  const { data } = await apiClient.get(`/address/get-details-by-id/${address_id}`);
  return data;
};
