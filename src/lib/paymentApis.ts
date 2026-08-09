// src/lib/paymentApis.ts
//
// Payment status polling for the mobile-money push-prompt checkout.
//
// Checkout is asynchronous: the order service creates the invoice, asks the
// payment gateway to push an approval prompt to the buyer's phone, and returns
// immediately with the invoice_id. Nothing on the invoice is final at that
// point — the gateway finalises it later, either by POSTing the order service's
// callback URL or by the order service's own 2-minute status poller.
//
// The browser therefore watches the invoice until it settles. There is no
// dedicated status endpoint on the gateway, so we read the invoice itself and
// derive the payment state from it.
import apiClient from './axios';

export type PaymentState = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentSnapshot {
  state: PaymentState;
  invoice_id: string | null;
  total_amount: number | null;
  total_items: number | null;
  /** INVOICE_STATUS enum value from the backend, e.g. PENDING / FAILED. */
  statusMessage: string | null;
  /** 0 = not yet paid, 1 = paid, 10 = failed. */
  paymentStatus: number | null;
}

// How long the browser keeps watching before telling the buyer to check their
// invoices instead. The order service's own poller runs for 2 minutes, and the
// gateway callback can land after that, so we give it a little more room.
export const PAYMENT_POLL_INTERVAL_MS = 4000;
export const PAYMENT_POLL_TIMEOUT_MS = 3 * 60 * 1000;

const PAID = 1;
const PAYMENT_FAILED = 10;

// statusMessage values that mean the payment will never complete. Everything
// past PENDING on the happy path (RECEIVED, SHIPPED, DELIVERED…) implies the
// invoice was paid, so only the terminal-negative ones are listed here.
const TERMINAL_FAILURE_MESSAGES = new Set(['FAILED', 'CANCELLED']);

const toNumberOrNull = (value: unknown): number | null => {
  const n = typeof value === 'string' ? Number(value) : (value as number);
  return Number.isFinite(n) ? (n as number) : null;
};

/**
 * Derives the payment state from a raw invoice row.
 *
 * A freshly created invoice is `paymentStatus: 0, statusMessage: 'PENDING'`.
 * applyPaymentResult (order service) flips it to `paymentStatus: 1` +
 * `statusMessage: 'PENDING'` on success — success is signalled by
 * paymentStatus, NOT by statusMessage, which then goes on to track the
 * fulfilment lifecycle.
 */
export const derivePaymentState = (invoice: unknown): PaymentState => {
  if (!invoice || typeof invoice !== 'object') return 'PENDING';
  const row = invoice as Record<string, unknown>;

  const paymentStatus = toNumberOrNull(row.paymentStatus);
  const statusMessage =
    typeof row.statusMessage === 'string' ? row.statusMessage.toUpperCase() : null;

  if (paymentStatus === PAID) return 'SUCCESS';
  if (paymentStatus === PAYMENT_FAILED) return 'FAILED';
  if (statusMessage && TERMINAL_FAILURE_MESSAGES.has(statusMessage)) return 'FAILED';

  return 'PENDING';
};

/**
 * Reads the current payment state of an invoice.
 *
 * Throws on transport errors so callers can distinguish "the network blipped"
 * (keep polling) from "the gateway says this failed" (stop polling).
 */
export const getInvoicePaymentSnapshot = async (
  invoice_id: string
): Promise<PaymentSnapshot> => {
  const { data } = await apiClient.get(`/invoice/get-invoice-details/${invoice_id}`);
  const invoice = (data?.data ?? null) as Record<string, unknown> | null;

  return {
    state: derivePaymentState(invoice),
    invoice_id: typeof invoice?.invoice_id === 'string' ? invoice.invoice_id : invoice_id,
    total_amount: toNumberOrNull(invoice?.total_amount),
    total_items: toNumberOrNull(invoice?.total_items),
    statusMessage: typeof invoice?.statusMessage === 'string' ? invoice.statusMessage : null,
    paymentStatus: toNumberOrNull(invoice?.paymentStatus)
  };
};
