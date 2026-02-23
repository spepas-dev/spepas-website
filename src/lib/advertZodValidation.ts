// src/lib/advertZodValidation.ts
import { z } from 'zod';

export const sliderDataSchema = z.object({
  id: z.number(),
  slider_id: z.string().uuid(),
  added_By: z.string().uuid(),
  updated_By: z.string().uuid().nullable(),
  image_details: z.object({
    url: z.string().optional(),
    secure_url: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    format: z.string().optional(),
    original_filename: z.string().optional(),
  }).passthrough().optional(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  date_added: z.string(),
  status: z.number(),
});

export const activeSliderResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(sliderDataSchema),
});

export type SliderData = z.infer<typeof sliderDataSchema>;
export type ActiveSliderResponse = z.infer<typeof activeSliderResponseSchema>;
