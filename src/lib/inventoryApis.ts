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
  driveType?: string;
  engineType?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface CategoryFilter {
  brandId?: string;
  fuelType?: string;
  bodyType?: string;
  driveType?: string;
  engineType?: string;
}

function cacheBusterParams() {
  return { params: { ts: Date.now() } };
}

// GET: distinct manufacture years — local mock only until INV-2 lands on real API
export const getCarYears = async () => {
  console.log('[inventoryApis] GET /inventry/car-years-all');
  try {
    const { data } = await apiClient.get('/inventry/car-years-all', cacheBusterParams());
    console.log('[inventoryApis] car-years-all — raw response:', data);
    return carYearsResponseSchema.parse(data);
  } catch (err: any) {
    console.error('[inventoryApis] car-years-all — FAILED:', {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    });
    throw err;
  }
};

// GET: list car manufacturers
// Live API caps at 100 per page (712 total) — fetch all pages and merge
// Note: API does not support year filtering — only page, limit, search, startDate, endDate
export const getCarManufacturers = async () => {
  return fetchAllPages('/inventry/car-manufacturers-all', { limit: 100 }, carManufacturersResponseSchema);
};

// Generic helper: fetch all pages from a paginated endpoint and merge data arrays
async function fetchAllPages<T>(
  url: string,
  params: Record<string, unknown>,
  schema: { parse: (d: unknown) => T & { data?: unknown[]; meta?: { totalPages?: number } } },
): Promise<T> {
  console.log(`[inventoryApis] fetchAllPages → GET ${url}`, params);
  let first;
  try {
    const res = await apiClient.get(url, { params });
    first = res.data;
    console.log(`[inventoryApis] ${url} — raw response:`, first);
  } catch (err: any) {
    console.error(`[inventoryApis] ${url} — request FAILED:`, {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    });
    throw err;
  }
  const parsed = schema.parse(first);
  const totalPages = parsed.meta?.totalPages ?? 1;
  if (totalPages > 1 && parsed.data) {
    const pageNums = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const results = await Promise.allSettled(
      pageNums.map((page) => apiClient.get(url, { params: { ...params, page } }))
    );
    for (const result of results) {
      if (result.status === 'fulfilled') {
        const page = schema.parse(result.value.data);
        if (page.data?.length) {
          (parsed.data as unknown[]).push(...page.data);
        }
      }
    }
  }
  return parsed;
}

// GET: list car brands (optionally scoped by year + manufacturer)
// Live API paginates at 100 max — fetch all pages
export const getCarBrands = async (filters?: { year?: string; manufacturerId?: string }) => {
  return fetchAllPages('/inventry/car-brands-all', { limit: 100, ...filters }, carBrandsResponseSchema);
};

// GET: list all car models (optionally scoped by brandId)
// Live API paginates at 100 max — fetch all pages
export const getCarModels = async (filters?: { brandId?: string }) => {
  return fetchAllPages('/inventry/car-models-all', { limit: 100, ...filters }, carModelsResponseSchema);
};

// GET: list all spare parts (filters forwarded as query params — see INV-3)
export const getSpareParts = async (filters?: SparePartsFilter) => {
  console.log('[inventoryApis] GET /inventry/sparepart-all', filters);
  try {
    const { data } = await apiClient.get('/inventry/sparepart-all', {
      params: { ts: Date.now(), ...filters },
    });
    console.log('[inventoryApis] sparepart-all — raw response:', data);
    return sparePartsResponseSchema.parse(data);
  } catch (err: any) {
    console.error('[inventoryApis] sparepart-all — FAILED:', {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    });
    throw err;
  }
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
  console.log('[inventoryApis] GET /inventry/category-all', filters);
  try {
    const { data } = await apiClient.get('/inventry/category-all', {
      params: { ts: Date.now(), ...filters },
    });
    console.log('[inventoryApis] category-all — raw response:', data);
    return sparePartCategoriesResponseSchema.parse(data);
  } catch (err: any) {
    console.error('[inventoryApis] category-all — FAILED:', {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    });
    throw err;
  }
};
