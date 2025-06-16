// src/lib/orderBidsApis.ts
import apiClient from './axios';
import {
  addBidToCartSchema,
  assignRequestToSellerSchema,
  emptySchema,
  gopaSellerForRequestParamsSchema,
  inventorySparePartRequestSchema,
  nonInventorySparePartRequestSchema,
  removeBidFromCartSchema,
  // param schemas for GETs
  requestDetailParamsSchema,
  requestIdParamsSchema,
  sellerIdParamsSchema,
  submitBidSchema,
  uploadSparePartImagesSchema,
  userIdParamsSchema
} from './orderBidsZodValidation';

/**
 * 1. Request Spare Part (Inventory)
 */
export const requestInventorySparePartAPI = async (payload: { SparePart_ID: string; require_image: number; quantity: number }) => {
  inventorySparePartRequestSchema.parse(payload);
  const response = await apiClient.post('/request/inventory-spare-part-request', payload);
  console.log('Response from inventory-spare-part-request:', response.data);
  return response.data;
};

/**
 * 2. Request Spare Part (Non-Inventory) buyer post-a-request- screen
 */
export const requestNonInventorySparePartAPI = async (payload: {
  require_image: number;
  quantity: number;
  sparePartDetail: {
    name: string;
    description: string;
    carModel_ID: string;
  };
}) => {
  nonInventorySparePartRequestSchema.parse(payload);
  const response = await apiClient.post('/request/non-inventory-spare-part-request', payload);
  console.log('Response from non-inventory-spare-part-request:', response.data);
  return response.data;
};

/**
 * 3. Assign Request To Seller GOPA Screen
 */
export const assignRequestToSellerAPI = async (payload: { request_id: string; sellerIDs: string[] }) => {
  assignRequestToSellerSchema.parse(payload);
  const response = await apiClient.post('/request/assign-request-to-seller', payload);
  console.log('Response from assign-request-to-seller:', response.data);
  return response.data;
};

/**
 * 4. Submit A Bid -bids-submitBids page
 */
export const submitBidAPI = async (payload: {
  bidding_ID: string;
  price: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}) => {
  submitBidSchema.parse(payload);
  const response = await apiClient.post('/bid/submit-bid', payload);
  console.log('Response from submit-bid:', response.data);
  return response.data;
};

/**
 * 5. Add Bid To Cart buyer-my-requests-button on cart page
 */
export const addBidToCartAPI = async (payload: { bidding_ID: string }) => {
  addBidToCartSchema.parse(payload);
  const response = await apiClient.post('/cart/add-bid-to-cart', payload);
  console.log('Response from add-bid-to-cart:', response.data);
  return response.data;
};

/**
 * 6. Remove Bid From Cart button on cart page
 */
export const removeBidFromCartAPI = async (payload: { cart_ID: string }) => {
  removeBidFromCartSchema.parse(payload);
  const response = await apiClient.post('/cart/remove-bid-from-cart', payload);
  console.log('Response from remove-bid-from-cart:', response.data);
  return response.data;
};

/**
 * 7. Upload Spare Part Images seller submit-bid
 */
export const uploadSparePartImagesAPI = async (payload: { bidding_ID: string; files: File[] }) => {
  uploadSparePartImagesSchema.parse(payload);
  const formData = new FormData();
  formData.append('bidding_ID', payload.bidding_ID);
  payload.files.forEach((f) => formData.append('file', f));
  const response = await apiClient.post('/bid/upload-sparepart-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  console.log('Response from upload-sparepart-images:', response.data);
  return response.data;
};

/* ————————————— GET Requests ————————————— */

/**
 * 1. Buyer Active Requests buyer my-requests active-screen
 */
export const getBuyerActiveRequestsAll = async () => {
  emptySchema.parse({});
  const response = await apiClient.get('/request/buyer-active-request-all');
  console.log('Response from buyer-active-request-all:', response.data);
  return response.data;
};

/**
 * 2. Buyer Request History buyer my-requests history-screen
 */
export const getBuyerRequestHistoryAll = async () => {
  emptySchema.parse({});
  const response = await apiClient.get('/request/buyer-request-history-all');
  console.log('Response from buyer-request-history-all:', response.data);
  return response.data;
};

/**
 * 3. Bids For Buyer Request my requests offers screen
 */
export const getBidsForBuyerRequestAll = async () => {
  emptySchema.parse({});
  const response = await apiClient.get('/bid/bids-for-buyer-request-all');
  console.log('Response from bids-for-buyer-request-all:', response.data);
  return response.data;
};

/**
 * 4. Items In Cart buyer-cart page
 */
export const getItemsInCartAll = async () => {
  emptySchema.parse({});
  const response = await apiClient.get('/cart/items-in-cart-all');
  console.log('Response from items-in-cart-all:', response.data);
  return response.data;
};

/**
 * 5. Request Detail on sellers bids-requestdetails page
 */
export const getRequestDetailAPI = async (params: { request_id: string }) => {
  requestDetailParamsSchema.parse(params);
  const response = await apiClient.get(`/request/request-datail/${params.request_id}`);
  console.log('Response from request-datail:', response.data);
  return response.data;
};

/**
 * 6. GOPA Sellers For Request GOPA Screen
 */
export const getGOPASellerForRequestAPI = async (params: { gopa_id: string; request_id: string }) => {
  gopaSellerForRequestParamsSchema.parse(params);
  const response = await apiClient.get(`/request/GOPA-seller-for-request/${params.gopa_id}/${params.request_id}`);
  console.log('Response from GOPA-seller-for-request:', response.data);
  return response.data;
};

/**
 * 7. GOPA Assigned Active Requests GOPA Screen
 */
export const getGOPAAssignedActiveRequestsAPI = async (params: { user_id: string }) => {
  userIdParamsSchema.parse(params);
  const response = await apiClient.get(`/request/GOPA-assigned-active-request/${params.user_id}`);
  console.log('Response from GOPA-assigned-active-request:', response.data);
  return response.data;
};

/**
 * 8. GOPA Assigned Request History Gopa Screen
 */
export const getGOPAAssignedRequestHistoryAPI = async (params: { user_id: string }) => {
  userIdParamsSchema.parse(params);
  const response = await apiClient.get(`/request/GOPA-assigned-request-history/${params.user_id}`);
  console.log('Response from GOPA-assigned-request-history:', response.data);
  return response.data;
};

/**
 * 9. GOPA Unassigned Active Requests GOPA Screen
 */
export const getGOPAUnassignedActiveRequestsAPI = async (params: { user_id: string }) => {
  userIdParamsSchema.parse(params);
  const response = await apiClient.get(`/request/GOPA-unassigned-active-request/${params.user_id}`);
  console.log('Response from GOPA-unassigned-active-request:', response.data);
  return response.data;
};

/**
 * 10. GOPA Unassigned Request History GOPA Screen
 */
export const getGOPAUnassignedRequestHistoryAPI = async (params: { user_id: string }) => {
  userIdParamsSchema.parse(params);
  const response = await apiClient.get(`/request/GOPA-unassigned-request-history/${params.user_id}`);
  console.log('Response from GOPA-unassigned-request-history:', response.data);
  return response.data;
};

/**
 * 11. All Bids For A Request on buyer screen - my-requests-offers page
 */
export const getRequestBidsAllAPI = async (params: { request_id: string }) => {
  requestIdParamsSchema.parse(params);
  const response = await apiClient.get(`/bid/request-bids-all/${params.request_id}`);
  console.log('Response from request-bids-all:', response.data);
  return response.data;
};

/**
 * 12. Seller Bids For Active Requests on bids-all seller screen
 */
export const getSellerBidsForActiveRequestsAPI = async (params: { seller_id: string }) => {
  sellerIdParamsSchema.parse(params);
  const response = await apiClient.get(`/bid/seller-bids-for-active-requests-all/${params.seller_id}`);
  console.log('Response from seller-bids-for-active-requests-all:', response.data);
  return response.data;
};

/**
 * 13. Seller Bids For Requests History bids-all-submitted seller screen
 */
export const getSellerBidsForRequestsHistoryAPI = async (params: { seller_id: string }) => {
  sellerIdParamsSchema.parse(params);
  const response = await apiClient.get(`/bid/seller-bids-for-requests-history-all/${params.seller_id}`);
  console.log('Response from seller-bids-for-requests-history-all:', response.data);
  return response.data;
};
