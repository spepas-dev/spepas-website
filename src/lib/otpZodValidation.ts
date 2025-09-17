import { z } from 'zod';

/**
 * -----------------------------
 * Request Schemas
 * -----------------------------
 */
export const generateOtpRequestSchema = z.object({
  counterType: z.union([z.literal('MINUTE'), z.literal('HOUR'), z.literal('DAY')]).default('MINUTE'),
  sendSms: z.number().int().optional(),          // 0 | 1
  phoneNumber: z.string().optional(),
  sendEmail: z.number().int().optional(),        // 0 | 1
  emailMessage: z.string().optional().default(''),
  smsMessage: z.string().optional().default(''),
  expiryCounter: z.number().int().optional().default(10),
  User_ID: z.string().uuid(),
});

export const validateOtpRequestSchema = z.object({
  otp: z.string().min(1),
  otpID: z.string().uuid(),
});

/**
 * -----------------------------
 * Response Schemas
 * -----------------------------
 */

// /otp/generate -> { status, message, data: otpID }
export const otpGenerateResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.string().uuid(),
});

// OTP record returned by /otp/validate
export const otpRecordSchema = z.object({
  id: z.number(),
  otpID: z.string().uuid(),
  dateAdded: z.string(),          // ISO
  expiryDate: z.string(),         // ISO
  otpHarshed: z.string().optional().default(''),
  otpEncrypted: z.string().optional().default(''),
  sendSms: z.number().int(),
  smsMessage: z.string(),
  phoneNumber: z.string(),
  sendEmail: z.number().int(),
  emailMessage: z.string(),
  expiryCounter: z.number().int(),
  counterType: z.union([z.literal('MINUTE'), z.literal('HOUR'), z.literal('DAY')]),
  status: z.number().int(),
  dateValidated: z.string().nullable(),
  email: z.string().nullable(),
  extraData: z.any().nullable(),
  User_ID: z.string().uuid(),
});

export const otpValidateResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: otpRecordSchema,
});

/**
 * -----------------------------
 * Inferred Types
 * -----------------------------
 */
export type GenerateOtpRequest = z.infer<typeof generateOtpRequestSchema>;
export type ValidateOtpRequest = z.infer<typeof validateOtpRequestSchema>;
export type OtpGenerateResponse = z.infer<typeof otpGenerateResponseSchema>;
export type OtpRecord = z.infer<typeof otpRecordSchema>;
export type OtpValidateResponse = z.infer<typeof otpValidateResponseSchema>;
