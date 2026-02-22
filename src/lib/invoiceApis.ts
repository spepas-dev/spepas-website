// src/lib/invoiceApis.ts
import apiClient from './axios';

// ─── Buyer ───────────────────────────────────────────────

export const getMyPendingInvoices = async () => {
  const { data } = await apiClient.get('/invoice/get-my-pending-invoices');
  return data;
};

export const getMyHistoryInvoices = async () => {
  const { data } = await apiClient.get('/invoice/get-my-history-invoices');
  return data;
};

// ─── Seller ──────────────────────────────────────────────

export const getSellerPendingInvoices = async (seller_id: string) => {
  const { data } = await apiClient.get(`/invoice/get-seller-pending-invoices/${seller_id}`);
  return data;
};

export const getSellerHistoryInvoices = async (seller_id: string) => {
  const { data } = await apiClient.get(`/invoice/get-seller-history-invoices/${seller_id}`);
  return data;
};

export const setOrderItemReadyForPickup = async (payload: { items: string[] }) => {
  const { data } = await apiClient.post('/invoice/set-orderitem-ready-for-pickup', payload);
  return data;
};

export const sellerDeliverToRider = async (payload: { items: string[] }) => {
  const { data } = await apiClient.post('/invoice/seller-deliver-orderitem-to-rider', payload);
  return data;
};

// ─── Rider ───────────────────────────────────────────────

export const getInvoicePendingRiderAcceptance = async () => {
  const { data } = await apiClient.get('/invoice/get-invoice-pending-rider-acceptance');
  return data;
};

export const getInvoicePendingRiderPickup = async () => {
  const { data } = await apiClient.get('/invoice/get-invoice-pending-rider-pickup');
  return data;
};

export const acceptOrderItemPickup = async (payload: { items: string[] }) => {
  const { data } = await apiClient.post('/invoice/accept-orderitem-pickup', payload);
  return data;
};

export const getInvoiceItemByQr = async (qr_value: string) => {
  const { data } = await apiClient.get(`/invoice/get-invoice-item-by-qr/${qr_value}`);
  return data;
};

export const getReadyToShipInvoiceItems = async () => {
  const { data } = await apiClient.get('/invoice/get-readytoship-invoice-items');
  return data;
};

export const setItemReadyForShipment = async (payload: { items: string[] }) => {
  const { data } = await apiClient.post('/invoice/set-item-ready-for-shipment', payload);
  return data;
};

export const deliverItemToBuyer = async (payload: { items: string[] }) => {
  const { data } = await apiClient.post('/invoice/deliver-item-to-buyer', payload);
  return data;
};

// ─── Shared (already in gopaInvoiceApis.ts, re-exported for convenience) ──

export { getGopaAcceptedInvoiceDetails as getInvoiceDetails } from './gopaInvoiceApis';
export { getGopaAcceptedInvoiceItemDetails as getInvoiceItemDetails } from './gopaInvoiceApis';
