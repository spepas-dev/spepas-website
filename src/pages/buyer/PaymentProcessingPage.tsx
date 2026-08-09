// src/pages/buyer/PaymentProcessingPage.tsx
//
// Landing screen for the mobile-money push-prompt checkout. The order service
// has already asked the gateway to push an approval prompt to the buyer's
// phone; this page watches the invoice until the payment settles, then sends
// the buyer to the same complete/cancel pages the gateway would redirect to.
import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import usePaymentStatus from '@/hooks/usePaymentStatus';
import { PAYMENT_ROUTES } from '@/config/payment.config';

const PaymentProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const location = useLocation() as { state?: { amountLabel?: string; walletNumber?: string; network?: string } };

  const { amountLabel, walletNumber, network } = location.state ?? {};

  const { state, snapshot, secondsRemaining, error, restart } = usePaymentStatus(invoiceId);

  const amountText = useMemo(() => {
    if (amountLabel) return amountLabel;
    if (snapshot?.total_amount != null) return `GH₵ ${snapshot.total_amount.toFixed(2)}`;
    return null;
  }, [amountLabel, snapshot?.total_amount]);

  // Terminal states hand off to the dedicated result pages so a buyer who
  // lands there via the gateway's own redirect sees exactly the same screen.
  useEffect(() => {
    if (!invoiceId) return;
    if (state === 'SUCCESS') {
      navigate(`${PAYMENT_ROUTES.COMPLETE}?invoice=${encodeURIComponent(invoiceId)}`, {
        replace: true
      });
    } else if (state === 'FAILED') {
      navigate(`${PAYMENT_ROUTES.CANCELLED}?invoice=${encodeURIComponent(invoiceId)}`, {
        replace: true
      });
    }
  }, [state, invoiceId, navigate]);

  if (!invoiceId) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 pt-28 pb-16 text-center space-y-4">
        <p className="text-sm text-gray-500">No payment to track. Head back to your cart to check out.</p>
        <button
          onClick={() => navigate('/95668339501103956045/buyer/cart')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  const timedOut = state === 'TIMED_OUT';

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center space-y-6">
        {timedOut ? (
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          </div>
        ) : (
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-7 h-7 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">
            {timedOut ? 'Still waiting for confirmation' : 'Approve the prompt on your phone'}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {timedOut ? (
              <>
                We haven't had confirmation from the payment provider yet. If you approved the prompt,
                the order will complete on its own — check your invoices in a moment.
              </>
            ) : (
              <>
                A payment request {amountText ? <>for <span className="font-semibold text-gray-900">{amountText}</span> </> : null}
                has been sent to {walletNumber ? <span className="font-semibold text-gray-900">{walletNumber}</span> : 'your mobile money number'}
                {network ? ` (${network})` : ''}. Enter your mobile money PIN on your phone to authorise it.
              </>
            )}
          </p>
        </div>

        {!timedOut && (
          <div className="rounded-xl bg-blue/5 border border-blue/15 p-4 text-left space-y-2">
            <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Waiting for confirmation</p>
            <p className="text-xs text-gray-500">
              Keep this page open. It updates automatically — no need to refresh.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
              <span className="text-xs text-gray-500">
                Checking… {Math.floor(secondsRemaining / 60)}:
                {String(secondsRemaining % 60).padStart(2, '0')} left
              </span>
            </div>
          </div>
        )}

        {error && !timedOut && <p className="text-xs text-amber-600">{error}</p>}

        <div className="pt-2 space-y-2">
          {timedOut && (
            <button
              onClick={restart}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:opacity-90 transition"
            >
              Check again
            </button>
          )}
          <button
            onClick={() => navigate('/95668339501103956045/buyer/invoices')}
            className={
              timedOut
                ? 'w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition'
                : 'w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition'
            }
          >
            View my invoices
          </button>
        </div>

        <p className="text-[11px] text-gray-400 break-all">Invoice reference: {invoiceId}</p>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;
