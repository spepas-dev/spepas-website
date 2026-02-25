//src/lib/inventoryApis.ts
import apiClient from './axios';
import {
  carManufacturersResponseSchema,
  carBrandsResponseSchema,
  carModelsResponseSchema,
  sparePartsResponseSchema,
  sparePartDetailResponseSchema,
  sparePartCategoriesResponseSchema,
  carYearsResponseSchema,
} from './inventoryZodValidation';

// Filter interfaces — query params forwarded to the API (see docs/issue-tracking.md INV-3..5)
export interface SparePartsFilter {
  brandId?: string;
  categoryId?: string;
  fuelType?: string;
  bodyType?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryFilter {
  brandId?: string;
  fuelType?: string;
  bodyType?: string;
}

function cacheBusterParams() {
  return { params: { ts: Date.now() } };
}

// GET: distinct manufacture years — local mock only until INV-2 lands on real API
export const getCarYears = async () => {
  const { data } = await apiClient.get('/inventry/car-years-all', cacheBusterParams());
  return carYearsResponseSchema.parse(data);
};

// GET: list car manufacturers (optionally scoped by year)
export const getCarManufacturers = async (filters?: { year?: string }) => {
  const { data } = await apiClient.get('/inventry/car-manufacturers-all', {
    params: { ts: Date.now(), ...filters },
  });
  return carManufacturersResponseSchema.parse(data);
};

// GET: list car brands (optionally scoped by year + manufacturer)
export const getCarBrands = async (filters?: { year?: string; manufacturerId?: string }) => {
  const { data } = await apiClient.get('/inventry/car-brands-all', {
    params: { ts: Date.now(), ...filters },
  });
  return carBrandsResponseSchema.parse(data);
};

// GET: list all car models
export const getCarModels = async () => {
  const { data } = await apiClient.get(
    '/inventry/car-models-all',
    cacheBusterParams()
  );
  // console.log('Response from car-models-all:', data);
  return carModelsResponseSchema.parse(data);
};

// GET: list all spare parts (filters forwarded as query params — see INV-3)
export const getSpareParts = async (filters?: SparePartsFilter) => {
  const { data } = await apiClient.get('/inventry/sparepart-all', {
    params: { ts: Date.now(), ...filters },
  });
  return sparePartsResponseSchema.parse(data);
};

// GET: spare part detail by code (numeric code)
export const getSparePartDetailByCode = async (spare_part_code: string | number) => {
  const code = encodeURIComponent(String(spare_part_code));
  const { data } = await apiClient.get(
    `/inventry/sparepart-detail/${code}`,
    cacheBusterParams()
  );
  // console.log('Response from sparepart-detail:', data);
  return sparePartDetailResponseSchema.parse(data);
};

// GET: list all spare part categories (filters scope part counts — see INV-4)
export const getSparePartCategories = async (filters?: CategoryFilter) => {
  const { data } = await apiClient.get('/inventry/category-all', {
    params: { ts: Date.now(), ...filters },
  });
  return sparePartCategoriesResponseSchema.parse(data);
};
