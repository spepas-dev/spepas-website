// src/lib/profiling.ts

import apiClient from './axios';
import {
  addIdentificationSchema,
  gopaRegistrationSchema,
  mepaRegistrationSchema,
  paymentAccountCreationSchema,
  riderRegistrationSchema,
  riderVehicleRegistrationSchema,
  sellerRegistrationSchema,
  uploadRiderLicenseBackSchema,
  uploadRiderLicenseFrontSchema,
  uploadRiderVehicleFrontSchema,
  uploadSellerDocSchema
} from './profilingZodValidation';

/**
 * 1. Add Identification (Self)
 */
export const addIdentificationSelf = async (payload: { idType: string; idN_number: string; issue_date: string; expiry_date: string }) => {
  addIdentificationSchema.parse(payload);
  const { data } = await apiClient.post('/user/add-identification-self', payload);
  return data;
};

/**
 * 2. Create GOPA Profile (Self)
 */
export const createGopaProfileSelf = async (payload: { Specialties: string[] }) => {
  gopaRegistrationSchema.parse(payload);
  console.log(payload);
  const { data } = await apiClient.post('/user/gopa-registration-self', payload);
  console.log('GOPA ', data);
  console.log('GOPA ', payload);
  return data;
};

/**
 * 3. Create Seller Profile (Self)
 */
export const createSellerProfileSelf = async (payload: { storeName: string; longitude: number; latitude: number }) => {
  sellerRegistrationSchema.parse(payload);
  const { data } = await apiClient.post('/user/seller-registration-self', payload);
  return data;
};

/**
 * 4. Create MEPA Profile (Self)
 */
export const createMepaProfileSelf = async (payload: { shop_name: string; longitude: number; latitude: number; address: string }) => {
  mepaRegistrationSchema.parse(payload);
  const { data } = await apiClient.post('/user/mepa-registration-self', payload);
  return data;
};

/**
 * 5. Create Rider Profile (Self)
 */
export const createRiderProfileSelf = async (payload: { licenseNumber: string; longitude: number; latitude: number }) => {
  riderRegistrationSchema.parse(payload);
  const { data } = await apiClient.post('/user/rider-registration-self', payload);
  return data;
};

/**
 * 6. Add Rider Vehicle (Self)
 */
export const addRiderVehicleSelf = async (payload: {
  Deliver_ID: string;
  type: string;
  model: string;
  color: string;
  registrationNumber: string;
}) => {
  riderVehicleRegistrationSchema.parse(payload);
  const { data } = await apiClient.post('/user/rider-vehicle-registration-self', payload);
  return data;
};

/**
 * 7. Create Payment Account (Self)
 */
export const createPaymentAccountSelf = async (payload: { mode: string; accountNumber: string; provider: string; name: string }) => {
  paymentAccountCreationSchema.parse(payload);
  const { data } = await apiClient.post('/user/payment-account-creation-self', payload);
  return data;
};

/**
 * 8. Upload Seller Documents (Self)
 */
export const uploadSellerDocSelf = async (form: FormData) => {
  // form must include: file(s) + Seller_ID
  uploadSellerDocSchema.parse({
    Seller_ID: form.get('Seller_ID'),
    files: form.getAll('file')
  });
  const { data } = await apiClient.post('/user/upload-seller-doc', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

/**
 * 9. Upload Rider License Front (Self)
 */
export const uploadRiderLicenseFrontSelf = async (form: FormData) => {
  uploadRiderLicenseFrontSchema.parse({
    Deliver_ID: form.get('Deliver_ID'),
    Image_Type: form.get('Image_Type'),
    file: form.get('file')
  });
  const { data } = await apiClient.post('/user/upload-rider-license-front', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

/**
 * 10. Upload Rider License Back (Self)
 */
export const uploadRiderLicenseBackSelf = async (form: FormData) => {
  uploadRiderLicenseBackSchema.parse({
    Deliver_ID: form.get('Deliver_ID'),
    Image_Type: form.get('Image_Type'),
    file: form.get('file')
  });
  const { data } = await apiClient.post('/user/upload-rider-license-back', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

/**
 * 11. Upload Rider Vehicle Front (Self)
 */
export const uploadRiderVehicleFrontSelf = async (form: FormData) => {
  uploadRiderVehicleFrontSchema.parse({
    Vehicle_ID: form.get('Vehicle_ID'),
    Image_Type: form.get('Image_Type'),
    file: form.get('file')
  });
  const { data } = await apiClient.post('/user/upload-rider-vehicle-front', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

/**
 * GET Rider Vehicle Information (Self)
 */
export const getRiderVehiclesSelf = async () => {
  const { data } = await apiClient.get('/user/rider-vehicles-self');
  return data;
};

/**
 * GET User Identification Information (Self)
 */
export const getUserIdentificationSelf = async () => {
  const { data } = await apiClient.get('/user/user-identification-self');
  return data;
};
