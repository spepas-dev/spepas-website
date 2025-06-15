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
  image_ob: z.any()
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
  images: z.array(imageSchema)
});

const carModelSchema = z.object({
  id: z.number(),
  CarModel_ID: z.string().uuid(),
  name: z.string(),
  yearOfMake: z.number(),
  carBrand_ID: z.string().uuid(),
  status: z.number(),
  createdAt: z.string(),
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
        createdAt: z.string()
      })
    })
    .optional()
});

const carBrandSchema = z.object({
  id: z.number(),
  CarBrand_ID: z.string().uuid(),
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
      createdAt: z.string()
    })
    .optional()
});

const manufacturerSchema = z.object({
  id: z.number(),
  Manufacturer_ID: z.string().uuid(),
  name: z.string(),
  country: z.string(),
  status: z.number(),
  createdAt: z.string(),
  brands: z.array(carBrandSchema)
});

export const carManufacturersResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(manufacturerSchema)
});

export const carBrandsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(carBrandSchema)
});

export const carModelsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(carModelSchema)
});

export const sparePartsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(sparePartSchema)
});
