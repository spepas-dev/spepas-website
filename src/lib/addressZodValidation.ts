// src/lib/addressZodValidation.ts
import { z } from 'zod';

export const addAddressSchema = z.object({
  title: z.string().nonempty(),
  addressDetails: z.string().nonempty(),
  longitude: z.number(),
  latitude: z.number()
});

export const getAddressDetailsByIdParamsSchema = z.object({
  address_id: z.string().uuid()
});
