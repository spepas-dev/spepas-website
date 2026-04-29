// src/lib/auth.ts
import apiClient from './axios';
import {
  signupRequestSchema,
  signinRequestSchema,
  activateAccountRequestSchema,
  signoutRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  changePasswordRequestSchema,
  refreshTokenRequestSchema,
} from './authZodValidation';

/**
 * 1. User Registration (Signup)
 */
export const signupAPI = async (payload: {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  user_type: string;
}) => {
  // Validate payload using Zod
  signupRequestSchema.parse(payload);
  const response = await apiClient.post('/auth/signup', payload);
  // console.log('Response from Signup API:', response.data);
  return response.data;
};

/**
 * 2. User Sign-In
 *
 * The backend accepts an `identifier` (phone or email) plus the password and
 * auto-detects which side it is. Callers pass either an email or a digit-only
 * phone number — anything else is rejected by the Zod validator.
 */
export const signinAPI = async (payload: {
  identifier: string;
  password: string;
}) => {
  signinRequestSchema.parse(payload);
  const response = await apiClient.post('/auth/signin', payload);
  // console.log('Response from Signin API:', response.data);
  return response.data;
};


/**
 * 3. Activate Account
 */
export const activateAccountAPI = async (payload: {
  otp: string;
  otpID: string;
}) => {
  activateAccountRequestSchema.parse(payload);
  const response = await apiClient.post('/auth/activate-account', payload);
  // console.log('Response from Activate Account API:', response.data);
  return response.data;
};

/**
 * 4. User Sign-Out
 *    (This endpoint does not require a request payload.)
 */
export const signoutAPI = async () => {
  // Validate an empty payload.
  signoutRequestSchema.parse({});
  const response = await apiClient.post('/auth/signout');
  // console.log('Response from Signout API:', response.data);
  return response.data;
};

/**
 * 5. Forgot Password
 */
export const forgotPasswordAPI = async (payload: { email: string }) => {
  forgotPasswordRequestSchema.parse(payload);
  const response = await apiClient.post('/auth/forgot-password', payload);
    // console.log('Response from Forgot Password API:', response.data);
  return response.data;
};

/**
 * 6. Reset Password
 */
export const resetPasswordAPI = async (payload: {
  otp: string;
  otpID: string;
  newPassword: string;
}) => {
  resetPasswordRequestSchema.parse(payload);
  const response = await apiClient.post('/auth/reset-password', payload);
  // console.log('Response from Reset Password API:', response.data);
  return response.data;
};

/**
 * 7. Change Password
 */
export const changePasswordAPI = async (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  changePasswordRequestSchema.parse(payload);
  const response = await apiClient.post('/auth/change-password', payload);
    // console.log('Response from Change Password API:', response.data);
  return response.data;
};

/**
 * 8. Refresh Token (GET Request)
 */
export const refreshTokenAPI = async () => {
  // Validate an empty payload.
  refreshTokenRequestSchema.parse({});
  const response = await apiClient.get('/auth/refresh-token');
  // console.log('Response from Refresh Token API:', response.data);
  return response.data;
};

/**
 * 9. Resend Activation OTP
 *    Used to (a) re-send the OTP after self-signup, and (b) let admin-onboarded
 *    users obtain an OTP from just their phone or email.
 */
export const resendActivationAPI = async (payload: {
  phoneNumber?: string;
  email?: string;
  identifier?: string;
}) => {
  const response = await apiClient.post('/auth/resend-activation', payload);
  return response.data;
};

/**
 * 10. Set Transaction PIN
 */
export const setupPinAPI = async (payload: {
  pin: string;
  confirmPin: string;
}) => {
  const response = await apiClient.post('/auth/setup-pin', payload);
  return response.data;
};

/**
 * 11. Verify Transaction PIN
 */
export const verifyPinAPI = async (payload: { pin: string }) => {
  const response = await apiClient.post('/auth/verify-pin', payload);
  return response.data;
};

/**
 * 12. Transaction PIN Status
 */
export const pinStatusAPI = async () => {
  const response = await apiClient.get('/auth/pin-status');
  return response.data;
};

/**
 * 13. Set Initial Password (admin-onboarded users)
 *     Refuses if the user already has a password — use changePasswordAPI
 *     instead.
 */
export const setPasswordAPI = async (payload: { newPassword: string }) => {
  const response = await apiClient.post('/auth/set-password', payload);
  return response.data;
};
