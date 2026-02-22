// src/lib/invoiceZodValidation.ts
import { z } from 'zod';

export const invoiceItemSchema = z.object({
  id: z.number(),
  item_id: z.string(),
  total_items: z.number(),
  total_amount: z.number(),
  createdAt: z.string(),
  status: z.number(),
  statusMessage: z.string().optional(),
  qr_value: z.string().optional(),
  invoice_id: z.string(),
  user_id: z.string(),
  aggregate: z.number().optional(),
  cart_ID: z.string().optional(),
  received_by: z.string().nullable().optional(),
  date_received: z.string().nullable().optional(),
  expectedDeliveryDate: z.string().nullable().optional(),
  readyForPickup: z.number().optional(),
  riderAccepted: z.number().optional(),
  date_rider_accepted: z.string().nullable().optional(),
  rider_user_id: z.string().nullable().optional(),
  delivered_by: z.string().nullable().optional(),
  date_delivered: z.string().nullable().optional(),
  cart: z.any().optional(),
  tracker: z.array(z.any()).optional(),
  rider: z.any().optional(),
});

export const invoiceDataSchema = z.object({
  id: z.number(),
  invoice_id: z.string(),
  total_items: z.number(),
  total_amount: z.number(),
  amount: z.number().optional(),
  service_charge: z.number().optional(),
  delivery_charge: z.number().optional(),
  tax: z.number().optional(),
  createdAt: z.string(),
  status: z.number(),
  paymentStatus: z.number().optional(),
  paymentMode: z.string().optional(),
  paymentNumber: z.string().optional(),
  paymentProvider: z.string().optional(),
  statusMessage: z.string().optional(),
  aggregate: z.number().optional(),
  gopa_accepted_status: z.number().optional(),
  qr_value: z.string().optional(),
  User_ID: z.string().optional(),
  gopa_user_id: z.string().nullable().optional(),
  address_id: z.string().optional(),
  dateGopaAccepted: z.string().nullable().optional(),
  address: z.any().optional(),
  user: z.any().optional(),
  gopa: z.any().optional(),
  items: z.array(invoiceItemSchema).optional(),
});

export const invoiceListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(invoiceDataSchema),
});

export const itemActionPayloadSchema = z.object({
  items: z.array(z.string().uuid()),
});

export type InvoiceData = z.infer<typeof invoiceDataSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
