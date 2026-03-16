// src/lib/inventoryZodValidation.ts
import { z } from 'zod';

const imageSchema = z.object({
  id: z.number(),
  image_ID: z.string(),
  SparePart_ID: z.string(),
  createdAt: z.string(),
  status: z.number(),
  // loosened: accept any string or undefined
  image_url: z.string().optional(),
  image_ob: z.any(),
});

const sparePartSchema = z.object({
  id: z.number(),
  SparePart_ID: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  status: z.number(),
  discount_ID: z.string().nullable(),
  category_ID: z.string().nullable(),
  carModel_ID: z.string().nullable().optional(),
  seller_ID: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  externalID: z.number().nullable().optional(),
  // article number: live API returns articleNo (camelCase) + article_no alias; local mock returns article_no
  articleNo: z.string().nullable().optional(),
  article_no: z.string().nullable().optional(),
  typeEngineName: z.string().nullable().optional(),
  supplier_name: z.string().nullable().optional(),
  images: z.array(imageSchema),
});

const carModelSchema = z.object({
  id: z.number(),
  CarModel_ID: z.string(),
  name: z.string(),
  yearOfMake: z.number(),
  carBrand_ID: z.string(),
  externalID: z.number().nullable().optional(),
  status: z.number(),
  createdAt: z.string(),
  // singular strings: local mock format
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  driveType: z.string().optional(),
  // arrays: live API format (INV-6 — schema migration added fuelTypes/bodyTypes/driveTypes)
  fuelTypes: z.array(z.string()).optional(),
  bodyTypes: z.array(z.string()).optional(),
  driveTypes: z.array(z.string()).optional(),
  spareParts: z.array(sparePartSchema).optional().default([]),
  carBrand: z
    .object({
      id: z.number(),
      CarBrand_ID: z.string(),
      name: z.string(),
      status: z.number(),
      manufacturer_ID: z.string(),
      externalID: z.number().nullable().optional(),
      createdAt: z.string(),
      type: z.string(),
      manufacturer: z.object({
        id: z.number(),
        Manufacturer_ID: z.string(),
        name: z.string(),
        country: z.string(),
        externalID: z.number().nullable().optional(),
        status: z.number(),
        createdAt: z.string(),
      }),
    })
    .optional(),
});

const carBrandSchema = z.object({
  id: z.number(),
  // loosened from .uuid(): local mock returns pipe-separated UUIDs for grouped brand variants (pending INV-2)
  CarBrand_ID: z.string(),
  name: z.string(),
  status: z.number(),
  manufacturer_ID: z.string(),
  externalID: z.number().nullable().optional(),
  createdAt: z.string(),
  type: z.string(),
  models: z.array(carModelSchema).optional().default([]),
  manufacturer: z
    .object({
      id: z.number(),
      Manufacturer_ID: z.string(),
      name: z.string(),
      country: z.string(),
      externalID: z.number().nullable().optional(),
      status: z.number(),
      createdAt: z.string(),
    })
    .optional(),
});

const manufacturerSchema = z.object({
  id: z.number(),
  Manufacturer_ID: z.string(),
  name: z.string(),
  country: z.string(),
  externalID: z.number().nullable().optional(),
  status: z.number(),
  createdAt: z.string(),
  brands: z.array(carBrandSchema).optional().default([]),
});

// Pagination metadata returned by the live API (absent in local mock)
const paginationMeta = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
}).optional();

export const carManufacturersResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(manufacturerSchema),
  meta: paginationMeta,
});

export const carBrandsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(carBrandSchema),
  meta: paginationMeta,
});

export const carModelsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(carModelSchema),
  meta: paginationMeta,
});

export const sparePartsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  total: z.number().optional(), // local mock compat — live API uses meta.total
  data: z.array(sparePartSchema),
  meta: paginationMeta,
});

/**
 * Detail response (adds nested carModel → carBrand → manufacturer)
 */
export const sparePartDetailResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: sparePartSchema.extend({
    carModel: z.object({
      id: z.number(),
      CarModel_ID: z.string(),
      name: z.string(),
      yearOfMake: z.number(),
      carBrand_ID: z.string(),
      status: z.number(),
      createdAt: z.string(),
      fuelType: z.string().optional(),
      bodyType: z.string().optional(),
      driveType: z.string().optional(),
      fuelTypes: z.array(z.string()).optional(),
      bodyTypes: z.array(z.string()).optional(),
      driveTypes: z.array(z.string()).optional(),
      carBrand: z.object({
        id: z.number(),
        CarBrand_ID: z.string(),
        name: z.string(),
        status: z.number(),
        manufacturer_ID: z.string(),
        createdAt: z.string(),
        type: z.string(),
        manufacturer: z.object({
          id: z.number(),
          Manufacturer_ID: z.string(),
          name: z.string(),
          country: z.string(),
          status: z.number(),
          createdAt: z.string(),
        }),
      }),
    }).optional(),
  }),
});

// Pending INV-2: real API does not yet have this endpoint; served by local mock only
export const carYearsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(z.number()),
});

export const sparePartCategoriesResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.number(),
      Category_ID: z.string(),
      name: z.string(),
      parent_ID: z.string().nullable(),
      count: z.number().optional(),
    })
  ),
});
