//src/lib/inventoryApis.ts
import apiClient from './axios';
import {
  carManufacturersResponseSchema,
  carBrandsResponseSchema,
  carModelsResponseSchema,
  sparePartsResponseSchema,
  sparePartDetailResponseSchema,
  sparePartCategoriesResponseSchema,
} from './inventoryZodValidation';

export type InventoryQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
};

function buildParams(extra?: InventoryQueryParams) {
  const p: Record<string, unknown> = { ts: Date.now() };
  if (extra?.page) p.page = extra.page;
  if (extra?.limit) p.limit = extra.limit;
  if (extra?.search) p.search = extra.search;
  if (extra?.startDate) p.startDate = extra.startDate;
  if (extra?.endDate) p.endDate = extra.endDate;
  return { params: p };
}

// GET: list car manufacturers (paginated, searchable)
export const getCarManufacturers = async (params?: InventoryQueryParams) => {
  const { data } = await apiClient.get('/inventry/car-manufacturers-all', buildParams(params));
  return carManufacturersResponseSchema.parse(data);
};

// GET: list car brands (paginated, searchable)
export const getCarBrands = async (params?: InventoryQueryParams) => {
  const { data } = await apiClient.get('/inventry/car-brands-all', buildParams(params));
  return carBrandsResponseSchema.parse(data);
};

// GET: list car models (paginated, searchable)
export const getCarModels = async (params?: InventoryQueryParams) => {
  const { data } = await apiClient.get('/inventry/car-models-all', buildParams(params));
  return carModelsResponseSchema.parse(data);
};

// GET: list spare parts (paginated, searchable)
export const getSpareParts = async (params?: InventoryQueryParams) => {
  const { data } = await apiClient.get('/inventry/sparepart-all', buildParams(params));
  return sparePartsResponseSchema.parse(data);
};

// GET: spare part detail by code
export const getSparePartDetailByCode = async (spare_part_code: string | number) => {
  const code = encodeURIComponent(String(spare_part_code));
  const { data } = await apiClient.get(`/inventry/sparepart-detail/${code}`, buildParams());
  return sparePartDetailResponseSchema.parse(data);
};

// GET: list spare part categories (paginated, searchable)
// NOTE: this endpoint nests data as { data: { categories: [...], meta: {...} } }
// We normalize to { data: [...], meta: {...} } for consistent consumer usage
export const getSparePartCategories = async (params?: InventoryQueryParams) => {
  const { data } = await apiClient.get('/inventry/category-all', buildParams(params));
  const parsed = sparePartCategoriesResponseSchema.parse(data);
  return {
    status: parsed.status,
    message: parsed.message,
    data: parsed.data.categories,
    meta: parsed.data.meta,
  };
};
