// src/lib/walletZodValidation.ts
import { z } from 'zod';

export const walletDetailsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    walletID: z.string().uuid(),
    date_created: z.string().refine(s => !Number.isNaN(Date.parse(s)), 'Invalid date'),
    status: z.number(),
    wallet_type: z.string(),
    User_ID: z.string().nullable(),
    WalletNumber: z.string().nonempty(),
    balance: z.number(),
  })
});
