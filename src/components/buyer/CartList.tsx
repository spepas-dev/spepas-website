// src/components/buyer/CartList.tsx
import Lottie from 'lottie-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import emptyCartAnimation from '@/assets/lottie/empty-cart.json';
import SpepasLoader from '@/components/common/SpepasLoader';
import { PAYMENT_ROUTES } from '@/config/payment.config';
import { MOMO_NETWORKS, normaliseMsisdn } from '@/lib/msisdn';
import { useAccountType } from '@/features/accountTypeContext';
import {
  generateInvoiceAPI,
  getInvoicesGeneratedForMeAPI,
  getItemsInCartAll,
  getUserChargesAPI,
  payGeneratedInvoiceAPI,
  removeBidFromCartAPI,
} from '@/lib/orderBidsApis';

import CartItem from './CartItem';

interface GeneratedInvoiceItem {
  cart?: {
    bid?: {
      totalPrice?: number;
      orderRequest?: {
        quantity?: number;
        sparePart?: {
          name?: string;
          images?: { url?: string }[];
        };
      };
    };
  };
}

interface GeneratedInvoice {
  invoice_id: string;
  total_amount: number;
  total_items: number;
  generator?: { User_ID: string; name: string; phoneNumber: string };
  paymentStatus?: number;
  items?: GeneratedInvoiceItem[];
}

// Walks the eager-loaded items[].cart.bid.orderRequest.sparePart chain to
// produce a short, user-friendly summary like "2× Brake Pad, 1× Oil Filter".
// Falls back gracefully when the relation chain is partially populated.
const summariseInvoiceParts = (inv: GeneratedInvoice): string => {
  const parts = (inv.items || [])
    .map((it) => {
      const qty = it.cart?.bid?.orderRequest?.quantity ?? 1;
      const name = it.cart?.bid?.orderRequest?.sparePart?.name?.trim();
      return name ? `${qty}× ${name}` : null;
    })
    .filter(Boolean) as string[];
  if (parts.length === 0) return '';
  if (parts.length <= 2) return parts.join(', ');
  return `${parts.slice(0, 2).join(', ')} +${parts.length - 2} more`;
};

interface PayState {
  invoice_id: string;
  // Matches cart checkout — the invoice's paymentMode is stored as WALLET
  // across every mobile-money payment path (web and USSD).
  paymentMode: 'WALLET';
  walletNumber: string;
  network: string;
  pin: string;
}

const CartList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [generatedInvoices, setGeneratedInvoices] = useState<GeneratedInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genPhone, setGenPhone] = useState('');
  const [genPin, setGenPin] = useState('');
  const [genAgg, setGenAgg] = useState<'1' | '0'>('1');
  const [genSubmitting, setGenSubmitting] = useState(false);
  const [payTarget, setPayTarget] = useState<PayState | null>(null);
  const [paySubmitting, setPaySubmitting] = useState(false);
  const navigate = useNavigate();
  // Generate-invoice is Mepa-only — only buyers with the Mepa profile can
  // create an invoice for someone else to pay.
  const { availableRoles } = useAccountType();
  const canGenerateInvoice = availableRoles.includes('MEPA');

  useEffect(() => {
    // Two parallel reads: own cart + invoices a Mepa-buyer generated for
    // me to pay. Both surfaces are rendered together — the recipient sees
    // their pending invoices in the same cart screen.
    Promise.all([
      getItemsInCartAll().catch(() => ({ data: [] })),
      getInvoicesGeneratedForMeAPI().catch(() => ({ data: [] })),
    ])
      .then(([cartRes, genRes]) => {
        setItems(cartRes?.data || []);
        setGeneratedInvoices(genRes?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (cartId: string) => {
    removeBidFromCartAPI({ cart_ID: cartId })
      .then(() => setItems((prev) => prev.filter((i) => i.cart_ID !== cartId)))
      .catch(console.error);
  };

  const handleCheckout = () => {
    toast(
      (t) => (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Aggregate cart items?</p>
              <p className="text-xs text-gray-500 mt-0.5">Combine items for a single delivery</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmAggregate('0');
              }}
            >
              No
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue to-blue-500 rounded-xl hover:opacity-90 transition"
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmAggregate('1');
              }}
            >
              Yes, Aggregate
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: { marginTop: '4rem', zIndex: 10000, padding: '1rem', borderRadius: '1rem' }
      }
    );
  };

  const confirmAggregate = async (agg: '1' | '0') => {
    setCheckingOut(true);
    try {
      const charges = await getUserChargesAPI({ aggeagate: agg });
      navigate('/95668339501103956045/buyer/checkout', { state: { charges, aggeagate: agg } });
    } catch {
      toast.error('Failed to fetch charges.');
    } finally {
      setCheckingOut(false);
    }
  };

  const total = items.reduce((sum, i) => sum + (i.bid.totalPrice || 0), 0);

  if (loading) {
    return <SpepasLoader size="lg" label="Loading cart..." />;
  }

  // Only render the empty-cart screen when BOTH the user's own cart AND
  // their pending generated invoices are empty — a recipient with no items
  // of their own but a pending invoice still needs to reach the cart.
  if (items.length === 0 && generatedInvoices.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center space-y-4">
        <Lottie animationData={emptyCartAnimation} loop autoplay className="w-48 h-48 sm:w-56 sm:h-56" />
        <div className="space-y-1">
          <p className="text-base font-semibold text-gray-900">Your cart is empty</p>
          <p className="text-sm text-gray-500">Browse parts and add them to your cart.</p>
        </div>
        <button
          onClick={() => navigate('/95668339501103956045/Shop')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-6 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z"
            />
          </svg>
          Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items (only when the user has their own items). */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {items.map((i) => (
            <CartItem key={i.cart_ID} item={i} onRemove={handleRemove} />
          ))}
        </div>
      )}

      {/* Summary + own-cart checkout actions. Hidden when the cart is empty
          but the user has generated invoices waiting — there's no own-cart
          total to settle in that case. */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">
                Total ({items.length} {items.length === 1 ? 'item' : 'items'}):
              </span>
              <span className="text-2xl font-bold text-gray-900">GH₵ {total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {canGenerateInvoice && (
                <button
                  onClick={() => setShowGenerate(true)}
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue border border-blue/30 text-sm font-medium py-3 px-6 rounded-xl shadow-sm hover:bg-blue/5 transition"
                >
                  Generate Invoice
                </button>
              )}
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-3 px-8 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
              >
                {checkingOut ? <SpepasLoader size="sm" className="inline-flex" /> : null}
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoices another buyer (with Mepa profile) generated FOR me to
          pay. Shown alongside (or instead of) the user's own cart items so
          a recipient with no items of their own still finds them here. */}
      {generatedInvoices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Invoices generated for you</h3>
            <span className="text-xs text-gray-500">
              {generatedInvoices.length} pending
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {generatedInvoices.map((inv) => {
              const partsSummary = summariseInvoiceParts(inv);
              return (
                <div key={inv.invoice_id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {partsSummary && (
                      <p className="font-medium text-sm text-gray-900 truncate">{partsSummary}</p>
                    )}
                    <p className={`${partsSummary ? 'text-base mt-1' : 'text-lg'} font-semibold text-gray-900`}>
                      GH₵ {Number(inv.total_amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {inv.total_items} item{inv.total_items !== 1 ? 's' : ''}
                    </p>
                    {inv.generator && (
                      <p className="text-xs text-blue mt-1">
                        From {inv.generator.name} ({inv.generator.phoneNumber})
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setPayTarget({
                        invoice_id: inv.invoice_id,
                        paymentMode: 'WALLET',
                        walletNumber: '',
                        network: '',
                        pin: ''
                      })
                    }
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium hover:opacity-90 flex-shrink-0"
                  >
                    Pay
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Generate Invoice</h3>
              <p className="text-xs text-gray-500 mt-1">
                Create an invoice from your cart for another buyer to pay. Your Mepa
                commission will apply when the order is delivered.
              </p>
            </div>

            <label className="block text-xs font-medium text-gray-700">
              Recipient phone number
              <input
                type="tel"
                value={genPhone}
                onChange={(e) => setGenPhone(e.target.value)}
                placeholder="e.g. 0241234567"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
              />
            </label>

            <label className="block text-xs font-medium text-gray-700">
              Aggregate items into a single delivery?
              <select
                value={genAgg}
                onChange={(e) => setGenAgg(e.target.value as '1' | '0')}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
              >
                <option value="1">Yes, aggregate</option>
                <option value="0">No, separate</option>
              </select>
            </label>

            <label className="block text-xs font-medium text-gray-700">
              Your transaction PIN
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={genPin}
                onChange={(e) => setGenPin(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 tracking-widest"
              />
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={genSubmitting}
                onClick={() => {
                  setShowGenerate(false);
                  setGenPhone('');
                  setGenPin('');
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                disabled={genSubmitting || !genPhone || genPin.length < 4}
                onClick={async () => {
                  setGenSubmitting(true);
                  try {
                    const resp = await generateInvoiceAPI({
                      pin: genPin,
                      recipientPhone: genPhone.trim(),
                      aggeagate: Number(genAgg)
                    });
                    if (resp?.status === 1) {
                      toast.success('Invoice generated. Recipient can now pay.');
                      setShowGenerate(false);
                      setGenPhone('');
                      setGenPin('');
                    } else {
                      toast.error(resp?.message || 'Failed to generate invoice');
                    }
                  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                    toast.error(err?.response?.data?.message || 'Failed to generate invoice');
                  } finally {
                    setGenSubmitting(false);
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-gradient-to-r from-blue to-blue-500 rounded-xl hover:opacity-90 disabled:opacity-40"
              >
                {genSubmitting ? 'Submitting…' : 'Generate Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {payTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Pay Generated Invoice</h3>
            <p className="text-xs text-gray-500 -mt-2">Invoice {payTarget.invoice_id}</p>

            <label className="block text-xs font-medium text-gray-700">
              Mobile money number
              <input
                type="tel"
                value={payTarget.walletNumber}
                onChange={(e) => setPayTarget({ ...payTarget, walletNumber: e.target.value })}
                placeholder="0241234567"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
              />
              {payTarget.walletNumber && !normaliseMsisdn(payTarget.walletNumber) && (
                <p className="mt-1.5 text-xs font-normal text-red-600">
                  Enter a valid Ghana number, e.g. 0241234567.
                </p>
              )}
            </label>

            <label className="block text-xs font-medium text-gray-700">
              Network
              <select
                value={payTarget.network}
                onChange={(e) => setPayTarget({ ...payTarget, network: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
              >
                <option value="">Select network…</option>
                {MOMO_NETWORKS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-gray-700">
              Your transaction PIN
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={payTarget.pin}
                onChange={(e) => setPayTarget({ ...payTarget, pin: e.target.value.replace(/\D/g, '') })}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 tracking-widest"
              />
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={paySubmitting}
                onClick={() => setPayTarget(null)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                disabled={
                  paySubmitting ||
                  !normaliseMsisdn(payTarget.walletNumber) ||
                  !payTarget.network ||
                  payTarget.pin.length < 4
                }
                onClick={async () => {
                  // Guarded by `disabled` above, so this always resolves.
                  const msisdn = normaliseMsisdn(payTarget.walletNumber) as string;
                  setPaySubmitting(true);
                  try {
                    const resp = await payGeneratedInvoiceAPI({
                      pin: payTarget.pin,
                      invoice_id: payTarget.invoice_id,
                      paymentDetails: {
                        paymentMode: payTarget.paymentMode,
                        walletNumber: msisdn,
                        network: payTarget.network
                      }
                    });
                    if (resp?.status === 1) {
                      // Remove from local list — recipient just paid it.
                      setGeneratedInvoices((prev) => prev.filter((i) => i.invoice_id !== payTarget.invoice_id));
                      const { invoice_id, network } = payTarget;
                      setPayTarget(null);
                      // Same push-prompt mechanism as cart checkout — hand off to
                      // the processing page so the buyer sees it settle. It reads
                      // the amount off the invoice itself.
                      navigate(PAYMENT_ROUTES.processing(invoice_id), {
                        state: { walletNumber: msisdn, network }
                      });
                    } else {
                      toast.error(resp?.message || 'Payment failed');
                    }
                  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                    toast.error(err?.response?.data?.message || 'Payment failed');
                  } finally {
                    setPaySubmitting(false);
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-gradient-to-r from-blue to-blue-500 rounded-xl hover:opacity-90 disabled:opacity-40"
              >
                {paySubmitting ? 'Submitting…' : 'Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;
