// src/lib/gopaInvoiceApis.ts
import apiClient from './axios';
import {
  acceptInvoiceByGopaSchema,
  getGopaAcceptedInvoiceDetailsParamsSchema,
  getGopaAcceptedInvoiceItemDetailsParamsSchema,
} from './gopaInvoiceZodValidation';

// POST: Accept an invoice
export const acceptInvoiceByGopa = async (payload: {
  invoice_id: string;
}) => {
  acceptInvoiceByGopaSchema.parse(payload);
  console.log('Accept Invoice Payload:', payload);
  const { data } = await apiClient.post('/invoice/accept-invoice-by-gopa', payload);
  console.log('Accept Invoice Response:', data);
  return data;
};

// GET: list invoices for GOPA to accept
export const getInvoicesForGopaToAccept = async () => {
  // no request‐body schema
  const { data } = await apiClient.get('/invoice/get-invoice-for-gopa-to-accept');
  console.log('Invoices for GOPA to Accept:', data);
  return data;
};

// GET: list already accepted invoices
export const getGopaAcceptedInvoices = async () => {
  const { data } = await apiClient.get('/invoice/get-gopa-accepted-invoice');
  console.log('GOPA Accepted Invoices:', data);
  return data;
};

// GET: details of a single accepted invoice
export const getGopaAcceptedInvoiceDetails = async (invoice_id: string) => {
  getGopaAcceptedInvoiceDetailsParamsSchema.parse({ invoice_id });
  const { data } = await apiClient.get(
    `/invoice/get-gopa-accepted-invoice-details/${invoice_id}`
  );
  console.log('GOPA Accepted Invoice Details:', data);
  return data;
};

// GET: details of a single item in an accepted invoice
export const getGopaAcceptedInvoiceItemDetails = async (item_id: string) => {
  getGopaAcceptedInvoiceItemDetailsParamsSchema.parse({ item_id });
  const { data } = await apiClient.get(
    `/invoice/get-gopa-accepted-invoice-item-details/${item_id}`
  );
  console.log('GOPA Accepted Invoice Item Details:', data);
  return data;
};
