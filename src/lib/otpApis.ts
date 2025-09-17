import apiClient from './axios';
import {
  generateOtpRequestSchema,
  validateOtpRequestSchema,
  otpGenerateResponseSchema,
  otpValidateResponseSchema,
  type GenerateOtpRequest,
  type ValidateOtpRequest,
  type OtpGenerateResponse,
  type OtpValidateResponse,
} from './otpZodValidation';

/**
 * POST /otp/generate
 * Returns { status, message, data: otpID }
 */
export const generateOtp = async (
  payload: GenerateOtpRequest
): Promise<OtpGenerateResponse> => {
  const body = generateOtpRequestSchema.parse(payload);
  const { data } = await apiClient.post('/otp/generate', body);
  // console.log('Response from /otp/generate:', data);
  return otpGenerateResponseSchema.parse(data);
};

/**
 * POST /otp/validate
 * Returns { status, message, data: OTP Record }
 */
export const validateOtp = async (
  payload: ValidateOtpRequest
): Promise<OtpValidateResponse> => {
  const body = validateOtpRequestSchema.parse(payload);
  const { data } = await apiClient.post('/otp/validate', body);
  // console.log('Response from /otp/validate:', data);
  return otpValidateResponseSchema.parse(data);
};
