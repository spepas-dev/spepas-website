// src/lib/inventoryApis.ts
import apiClient from './axios';
import {
  carBrandsResponseSchema,
  carManufacturersResponseSchema,
  carModelsResponseSchema,
  sparePartsResponseSchema
} from './inventoryZodValidation';

function cacheBusterParams() {
  return { params: { ts: Date.now() } };
}

// GET: list all car manufacturers
export const getCarManufacturers = async () => {
  const { data } = await apiClient.get('/inventry/car-manufacturers-all', cacheBusterParams());
  console.log('Response from car-manufacturers-all:', data);
  return carManufacturersResponseSchema.parse(data);
};

// GET: list all car brands
export const getCarBrands = async () => {
  const { data } = await apiClient.get('/inventry/car-brands-all', cacheBusterParams());
  console.log('Response from car-brands-all:', data);
  return carBrandsResponseSchema.parse(data);
};

// GET: list all car models
export const getCarModels = async () => {
  const { data } = await apiClient.get('/inventry/car-models-all', cacheBusterParams());
  console.log('Response from car-models-all:', data);
  return carModelsResponseSchema.parse(data);
};

// GET: list all spare parts
export const getSpareParts = async () => {
  const { data } = await apiClient.get('/inventry/sparepart-all', cacheBusterParams());
  console.log('Response from sparepart-all:', data);
  return sparePartsResponseSchema.parse(data);
};
