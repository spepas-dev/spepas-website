// src/lib/gopaInvoiceZodValidation.ts
import { z } from 'zod';

// 1. Accept Invoice By GOPA (POST body)
export const acceptInvoiceByGopaSchema = z.object({
  invoice_id: z.string().uuid(),
});

// 2. Get Invoice For GOPA To Accept (no body)

// 3. Get GOPA Accepted Invoice (no body)

// 4. Get Single GOPA Accepted Invoice Details (path param)
export const getGopaAcceptedInvoiceDetailsParamsSchema = z.object({
  invoice_id: z.string().uuid(),
});

// 5. Get Single Item Detail in GOPA Invoice (path param)
export const getGopaAcceptedInvoiceItemDetailsParamsSchema = z.object({
  item_id: z.string().uuid(),
});
