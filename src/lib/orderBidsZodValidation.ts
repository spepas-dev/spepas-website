// src/lib/orderBidsZodValidation.ts
import { z } from 'zod';

/** used for empty-body GETs */
export const emptySchema = z.object({});

/** 1. Inventory Spare Part Request */
export const inventorySparePartRequestSchema = z.object({
  SparePart_ID: z.string().uuid('Invalid SparePart_ID'),
  require_image: z.number().int().min(0),
  quantity: z.number().int().min(1)
});

/** 2. Non-Inventory Spare Part Request */
export const nonInventorySparePartRequestSchema = z.object({
  require_image: z.number().int().min(0),
  quantity: z.number().int().min(1),
  sparePartDetail: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    carModel_ID: z.string().uuid('Invalid carModel_ID')
  })
});

/** 3. Assign Request To Seller */
export const assignRequestToSellerSchema = z.object({
  request_id: z.string().uuid('Invalid request_id'),
  sellerIDs: z.array(z.string().uuid())
});

/** 4. Submit Bid */
export const submitBidSchema = z.object({
  bidding_ID: z.string().uuid('Invalid bidding_ID'),
  price: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  discount: z.number()
});

/** 5. Add Bid To Cart */
export const addBidToCartSchema = z.object({
  bidding_ID: z.string().uuid('Invalid bidding_ID')
});

/** 6. Remove Bid From Cart */
export const removeBidFromCartSchema = z.object({
  cart_ID: z.string().uuid('Invalid cart_ID')
});

/** 7. Upload Spare Part Images */
export const uploadSparePartImagesSchema = z.object({
  bidding_ID: z.string().uuid('Invalid bidding_ID'),
  files: z.array(z.instanceof(File))
});

/* ————————————— GET params schemas ————————————— */

/** /request/request-datail/{request_id} */
export const requestDetailParamsSchema = z.object({
  request_id: z.string().uuid('Invalid request_id')
});

/** /request/GOPA-seller-for-request/{gopa_id}/{request_id} */
export const gopaSellerForRequestParamsSchema = z.object({
  gopa_id: z.string().uuid('Invalid gopa_id'),
  request_id: z.string().uuid('Invalid request_id')
});

/** any endpoint taking a single user_id */
export const userIdParamsSchema = z.object({
  user_id: z.string().uuid('Invalid user_id')
});

/** /bid/request-bids-all/{request_id} */
export const requestIdParamsSchema = z.object({
  request_id: z.string().uuid('Invalid request_id')
});

/** any endpoint taking a single seller_id */
export const sellerIdParamsSchema = z.object({
  seller_id: z.string().uuid('Invalid seller_id')
});
