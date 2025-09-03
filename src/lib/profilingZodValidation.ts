// src/lib/profilingZodValidation.ts
import { z } from 'zod'

// 1. Add Identification (Self)
export const addIdentificationSchema = z.object({
  idType: z.string().nonempty(),
  idN_number: z.string().nonempty(),
  issue_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD'),
  expiry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD'),
})

// 2. Create GOPA Profile (Self)
export const gopaRegistrationSchema = z.object({
  Specialties: z.array(z.string()).nonempty(),
})

// 3. Create Seller Profile (Self)
export const sellerRegistrationSchema = z.object({
  storeName: z.string().nonempty(),
  longitude: z.number(),
  latitude: z.number(),
})

// 4. Create MEPA Profile (Self)
export const mepaRegistrationSchema = z.object({
  shop_name: z.string().nonempty(),
  longitude: z.number(),
  latitude: z.number(),
  address: z.string().nonempty(),
})

// 5. Create Rider Profile (Self)
export const riderRegistrationSchema = z.object({
  licenseNumber: z.string().nonempty(),
  longitude: z.number(),
  latitude: z.number(),
})

// 6. Add Rider Vehicle (Self)
export const riderVehicleRegistrationSchema = z.object({
  Deliver_ID: z.string().uuid(),
  type: z.string().nonempty(),
  model: z.string().nonempty(),
  color: z.string().nonempty(),
  registrationNumber: z.string().nonempty(),
})

// 7. Create Payment Account (Self)
export const paymentAccountCreationSchema = z.object({
  mode: z.string().nonempty(),
  accountNumber: z.string().nonempty(),
  provider: z.string().nonempty(),
  name: z.string().nonempty(),
})

// 8. Upload Seller Documents (Self)
// We validate that we got a UUID and at least one file blob.
export const uploadSellerDocSchema = z.object({
  Seller_ID: z.string().uuid(),
  files: z.array(z.any()).nonempty(),
})

// 9. Upload Rider License Front (Self)
export const uploadRiderLicenseFrontSchema = z.object({
  Deliver_ID: z.string().uuid(),
  Image_Type: z.string().nonempty(),
  file: z.any(),
})

// 10. Upload Rider License Back (Self)
// Same shape as front
export const uploadRiderLicenseBackSchema = uploadRiderLicenseFrontSchema

// 11. Upload Rider Vehicle Front (Self)
export const uploadRiderVehicleFrontSchema = z.object({
  Vehicle_ID: z.string().uuid(),
  Image_Type: z.string().nonempty(),
  file: z.any(),
})

// 12. Get Single User Information (Admin-only) param schema                   // *adjusted*
export const getUserDetailsParamSchema = z.object({                            // *adjusted*
  user_id: z.string().uuid(),                                                 // *adjusted*
});  