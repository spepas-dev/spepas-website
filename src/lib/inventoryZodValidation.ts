// src/lib/inventoryZodValidation.ts
import { z } from 'zod';

const imageSchema = z.object({
  id: z.number(),
  image_ID: z.string().uuid(),
  SparePart_ID: z.string().uuid(),
  createdAt: z.string(),
  status: z.number(),
  // loosened: accept any string or undefined
  image_url: z.string().optional(),
  image_ob: z.any(),
});

const sparePartSchema = z.object({
  id: z.number(),
  SparePart_ID: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  status: z.number(),
  discount_ID: z.string().nullable(),
  category_ID: z.string().nullable(),
  carModel_ID: z.string().uuid(),
  seller_ID: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  images: z.array(imageSchema),
});

const carModelSchema = z.object({
  id: z.number(),
  CarModel_ID: z.string().uuid(),
  name: z.string(),
  yearOfMake: z.number(),
  carBrand_ID: z.string().uuid(),
  status: z.number(),
  createdAt: z.string(),
  // fuelType + bodyType: returned by local mock (TecDoc data); pending INV-1 on real API
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  spareParts: z.array(sparePartSchema),
  carBrand: z
    .object({
      id: z.number(),
      CarBrand_ID: z.string().uuid(),
      name: z.string(),
      status: z.number(),
      manufacturer_ID: z.string().uuid(),
      createdAt: z.string(),
      type: z.string(),
      manufacturer: z.object({
        id: z.number(),
        Manufacturer_ID: z.string().uuid(),
        name: z.string(),
        country: z.string(),
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
  manufacturer_ID: z.string().uuid(),
  createdAt: z.string(),
  type: z.string(),
  models: z.array(carModelSchema),
  manufacturer: z
    .object({
      id: z.number(),
      Manufacturer_ID: z.string().uuid(),
      name: z.string(),
      country: z.string(),
      status: z.number(),
      createdAt: z.string(),
    })
    .optional(),
});

const manufacturerSchema = z.object({
  id: z.number(),
  Manufacturer_ID: z.string().uuid(),
  name: z.string(),
  country: z.string(),
  status: z.number(),
  createdAt: z.string(),
  brands: z.array(carBrandSchema),
});

export const carManufacturersResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(manufacturerSchema),
});

export const carBrandsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(carBrandSchema),
});

export const carModelsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(carModelSchema),
});

export const sparePartsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(sparePartSchema),
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
      CarModel_ID: z.string().uuid(),
      name: z.string(),
      yearOfMake: z.number(),
      carBrand_ID: z.string().uuid(),
      status: z.number(),
      createdAt: z.string(),
      carBrand: z.object({
        id: z.number(),
        CarBrand_ID: z.string().uuid(),
        name: z.string(),
        status: z.number(),
        manufacturer_ID: z.string().uuid(),
        createdAt: z.string(),
        type: z.string(),
        manufacturer: z.object({
          id: z.number(),
          Manufacturer_ID: z.string().uuid(),
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
      Category_ID: z.string().uuid(),
      name: z.string(),
      parent_ID: z.string().uuid().nullable(),
    })
  ),
});
