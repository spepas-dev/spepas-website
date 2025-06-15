// src/lib/authZodValidation.ts
import { z } from 'zod';

/**
 * ============================
 * Request Payload Schemas
 * ============================
 */

// 1. Signup Request Schema
export const signupRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  user_type: z.literal('BUYER')
});

// 2. Signin Request Schema
export const signinRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

// 3. Activate Account Request Schema
export const activateAccountRequestSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  otpID: z.string().uuid('Invalid OTP ID')
});

// 4. Signout Request Schema
// This endpoint has no payload; use an empty object.
export const signoutRequestSchema = z.object({});

// 5. Forgot Password Request Schema
export const forgotPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address')
});

// 6. Reset Password Request Schema
export const resetPasswordRequestSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  otpID: z.string().uuid('Invalid OTP ID'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long')
});

// 7. Change Password Request Schema
export const changePasswordRequestSchema = z.object({
  oldPassword: z.string().min(8, 'Old password must be at least 8 characters long'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long')
});

// 8. Refresh Token Request Schema (GET request; no payload required)
export const refreshTokenRequestSchema = z.object({});

/**
 * ============================
 * (Optional) Response Payload Schemas
 * ============================
 * These can be used to validate API responses where applicable.
 */

// Example: Signup Response Schema
// export const signupResponseSchema = z.object({
//   status: z.number(),
//   message: z.string(),
//   data: z.string(),
// });

// Example: Signin Response Schema
// export const signinResponseSchema = z.object({
//   status: z.number(),
//   message: z.string(),
//   data: z.object({
//     token: z.string(),
//     user: z.object({
//       name: z.string(),
//       email: z.string().email(),
//       phoneNumber: z.string(),
//       verificationStatus: z.number(),
//       status: z.number(),
//       role: z.string(),
//       Seller_ID: z.any().nullable(),
//       createdAt: z.string(),
//       updatedAt: z.string(),
//     }),
//     refresh_token: z.string(),
//   }),
// });

// Reuse the Signin Response Schema for Activate Account & Reset Password responses,
// which appear to have a similar structure.
// export const activateAccountResponseSchema = signinResponseSchema;
// export const resetPasswordResponseSchema = signinResponseSchema;

// Example: Signout Response Schema
// export const signoutResponseSchema = z.object({
//   status: z.number(),
//   message: z.string(),
//   user: z.object({}).optional(),
// });

// Example: Forgot Password Response Schema
// export const forgotPasswordResponseSchema = z.object({
//   status: z.number(),
//   message: z.string(),
//   data: z.string(),
// });

// Example: Change Password Response Schema
// export const changePasswordResponseSchema = z.object({
//   status: z.number(),
//   message: z.string(),
// });

// Example: Refresh Token Response Schema
// export const refreshTokenResponseSchema = z.object({
//   status: z.number(),
//   message: z.string(),
// });
