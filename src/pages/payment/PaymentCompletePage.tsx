// src/pages/payment/PaymentCompletePage.tsx
//
// PAYMENT_GATEWAY_COMPLETURL lands here. Reached two ways:
//   1. the gateway redirects the browser after a successful checkout, or
//   2. the processing page sees the invoice settle as paid and forwards here.
//
// Public on purpose — a gateway redirect can arrive in a tab whose session has
// lapsed, and a buyer who just paid should still get a confirmation.
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { getInvoicePaymentSnapshot, type PaymentSnapshot } from '@/lib/paymentApis';

const PaymentCompletePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // The order service stamps ?invoice=<invoice_id> onto the redirect URL.
  const invoiceId = searchParams.get('invoice');
  const [snapshot, setSnapshot] = useState<PaymentSnapshot | null>(null);

  // Only fetch when signed in — the API would answer 401 otherwise, and the
  // axios interceptor turns that into a redirect away from this page.
  useEffect(() => {
    if (!invoiceId || !isAuthenticated) return;
    let cancelled = false;
    getInvoicePaymentSnapshot(invoiceId)
      .then((next) => {
        if (!cancelled) setSnapshot(next);
      })
      .catch(() => {
        /* Confirmation does not depend on this; the summary is a nicety. */
      });
    return () => {
      cancelled = true;
    };
  }, [invoiceId, isAuthenticated]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Payment received</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Thank you — your payment went through and your order is now being processed. You'll be
            notified as your items move through pickup and delivery.
          </p>
        </div>

        {(snapshot?.total_amount != null || snapshot?.total_items != null) && (
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2 text-left">
            {snapshot.total_amount != null && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Amount paid</span>
                <span className="font-semibold text-gray-900">GH₵ {snapshot.total_amount.toFixed(2)}</span>
              </div>
            )}
            {snapshot.total_items != null && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Items</span>
                <span className="font-medium text-gray-900">{snapshot.total_items}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 pt-2">
          {invoiceId && (
            <Link
              to={`/95668339501103956045/buyer/invoices/${invoiceId}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:opacity-90 transition"
            >
              View order
            </Link>
          )}
          <Link
            to="/95668339501103956045/buyer/invoices"
            className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition"
          >
            My invoices
          </Link>
          <Link
            to="/95668339501103956045/shop"
            className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition"
          >
            Continue shopping
          </Link>
        </div>

        {invoiceId && (
          <p className="text-[11px] text-gray-400 break-all">Invoice reference: {invoiceId}</p>
        )}
      </div>
    </div>
  );
};

export default PaymentCompletePage;
