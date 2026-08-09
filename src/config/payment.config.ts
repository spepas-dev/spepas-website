// src/config/payment.config.ts
//
// Landing paths for the payment gateway's browser redirects.
//
// These must stay in sync with PAYMENT_GATEWAY_COMPLETURL and
// PAYMENT_GATEWAY_CANCELTURL in sporderservices/.env — the order service hands
// those URLs to CalPay as `datacompleteurl` / `datacancelurl`, and stamps
// `?invoice=<invoice_id>` on the end so the landing page knows which order it
// is looking at.
//
// They are deliberately public routes: the gateway redirect can arrive in a
// tab that has lost its session, and a buyer who just paid should still see a
// confirmation instead of being bounced to sign-in.
const APP_BASE = '/95668339501103956045';

export const PAYMENT_ROUTES = {
  COMPLETE: `${APP_BASE}/payment/complete`,
  CANCELLED: `${APP_BASE}/payment/cancelled`,
  /** Built per-invoice; the buyer waits here for the push prompt to be approved. */
  processing: (invoiceId: string) => `${APP_BASE}/buyer/payment/processing/${invoiceId}`
};
