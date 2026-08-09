// src/pages/payment/PaymentCancelledPage.tsx
//
// PAYMENT_GATEWAY_CANCELTURL lands here. Reached when the buyer abandons the
// gateway checkout, declines the push prompt, or the payment is declined — and
// also when the processing page sees the invoice settle as failed.
//
// Public on purpose, for the same reason as the completion page: the redirect
// may arrive in a tab whose session has lapsed.
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentCancelledPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoice');

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Payment not completed</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            The payment was cancelled or declined, so nothing has been charged. Your items are still
            in your cart — you can try again with the same or a different mobile money number.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
          <p className="text-xs text-amber-900 leading-relaxed">
            Common causes: the prompt timed out before it was approved, insufficient wallet balance,
            or the wrong network was selected for the number.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            to="/95668339501103956045/buyer/cart"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:opacity-90 transition"
          >
            Back to cart
          </Link>
          <Link
            to="/95668339501103956045/buyer/invoices"
            className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition"
          >
            My invoices
          </Link>
          <Link
            to="/95668339501103956045/contact"
            className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition"
          >
            Contact support
          </Link>
        </div>

        {invoiceId && (
          <p className="text-[11px] text-gray-400 break-all">Invoice reference: {invoiceId}</p>
        )}
      </div>
    </div>
  );
};

export default PaymentCancelledPage;
