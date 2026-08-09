// src/components/buyer/CheckoutForm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import MapPicker from '@/components/common/MapPicker';
import SpepasLoader from '@/components/common/SpepasLoader';
import PinConfirmModal from '@/components/buyer/PinConfirmModal';
import { PAYMENT_ROUTES } from '@/config/payment.config';
import { useAuth } from '@/features/auth';
import { getMyAddresses, type Address } from '@/lib/addressApis';
import { MOMO_NETWORKS, normaliseMsisdn } from '@/lib/msisdn';
import { checkoutWithExistingAddressAPI, checkoutWithNewAddressAPI } from '@/lib/orderBidsApis';

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition bg-white';

const CheckoutForm: React.FC = () => {
  const location = useLocation() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate();
  const { authData } = useAuth();
  const { charges, aggeagate } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<'existing' | 'new'>('existing');

  // PIN confirmation state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState<string | undefined>();

  // Saved addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // New address form state
  const [title, setTitle] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');

  // Mobile money details — the push prompt goes to this number on this network.
  const [walletNumber, setWalletNumber] = useState('');
  const [network, setNetwork] = useState('MTN');

  const latNum = useMemo(() => { const n = parseFloat(newLat); return Number.isFinite(n) ? n : null; }, [newLat]);
  const lngNum = useMemo(() => { const n = parseFloat(newLng); return Number.isFinite(n) ? n : null; }, [newLng]);

  // Default the momo number to the buyer's registered phone; they can override
  // it if they pay from a different wallet.
  useEffect(() => {
    const phone = authData?.user?.phoneNumber;
    if (phone && !walletNumber) setWalletNumber(phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData?.user?.phoneNumber]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await getMyAddresses();
        if (cancelled) return;
        // status 100 is the soft-delete marker used across the address tables.
        const active = resp.data.filter((a) => a.status !== 100);
        setAddresses(active);
        if (active.length > 0) {
          setSelectedAddressId(active[0].address_id);
        } else {
          // Nothing saved yet — send the buyer straight to the new-address form
          // rather than letting them hit "Place Order" with nothing selected.
          setMode('new');
        }
      } catch {
        if (!cancelled) setMode('new');
      } finally {
        if (!cancelled) setAddressesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!charges) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No charge data available. Please go back to your cart.</p>
        <button
          onClick={() => navigate('/95668339501103956045/buyer/cart')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  // Translate the order-service PIN-gate response (which always returns HTTP 200)
  // into a user-facing error message in the modal.
  const extractPinError = (resp: any): string | undefined => {
    if (!resp || typeof resp !== 'object') return undefined;
    if (resp.status === 1) return undefined; // success
    if (resp.code === 'PIN_REQUIRED') return 'Transaction PIN required.';
    if (resp.code === 'PIN_NOT_SET') return 'PIN not set';
    if (resp.code === 'PIN_INVALID') return resp.message || 'Invalid PIN.';
    return undefined;
  };

  const chargeRows = [
    { label: 'Items Total', value: `GH₵ ${charges.MAIN_AMOUNT}` },
    { label: 'Service Charge', value: `GH₵ ${charges.SERVICE_CHARGE}` },
    { label: 'Delivery Fee', value: `GH₵ ${charges.DELIVERY_CHARGE}` },
    { label: 'Tax', value: `${charges.TAX}%` }
  ];

  const grandTotal =
    (Number(charges.MAIN_AMOUNT) || 0) +
    (Number(charges.SERVICE_CHARGE) || 0) +
    (Number(charges.DELIVERY_CHARGE) || 0);

  const amountLabel = `GH₵ ${grandTotal.toFixed(2)}`;
  const normalisedWallet = normaliseMsisdn(walletNumber);

  // Everything that must be settled before the PIN modal is worth opening.
  const validationError = (): string | null => {
    if (!normalisedWallet) return 'Enter a valid mobile money number (e.g. 0241234567).';
    if (!network) return 'Select the network for your mobile money number.';
    if (mode === 'existing') {
      if (!selectedAddressId) return 'Select a delivery address.';
    } else {
      if (!title.trim()) return 'Give your new address a title.';
      if (!addressDetails.trim()) return 'Add the details for your new address.';
      if (latNum === null || lngNum === null) return 'Pick your delivery location on the map.';
    }
    return null;
  };

  const submitWithPin = async (pin: string) => {
    setSubmitting(true);
    setPinError(undefined);
    try {
      const paymentDetails = {
        paymentMode: 'WALLET',
        walletNumber: normalisedWallet as string,
        network
      };

      let result: any;
      if (mode === 'existing') {
        result = await checkoutWithExistingAddressAPI({
          address_id: selectedAddressId,
          aggeagate: Number(aggeagate),
          paymentDetails,
          pin
        });
      } else {
        result = await checkoutWithNewAddressAPI({
          address: {
            title: title.trim(),
            addressDetails: addressDetails.trim(),
            longitude: lngNum as number,
            latitude: latNum as number
          },
          aggeagate: Number(aggeagate),
          paymentDetails,
          pin
        });
      }

      const pinErr = extractPinError(result);
      if (pinErr) {
        setPinError(pinErr);
        return;
      }

      if (result?.status !== 1) {
        // The gateway rejected the payment request outright (bad wallet, wrong
        // network, provider down). No prompt was pushed, so keep the buyer here.
        setPinModalOpen(false);
        toast.error(result?.message || 'Could not start the payment. Please try again.', {
          position: 'bottom-center'
        });
        return;
      }

      // `data` is the invoice_id. The push prompt is already on its way to the
      // buyer's phone; the processing page watches until it settles.
      const invoiceId = typeof result?.data === 'string' ? result.data : null;
      setPinModalOpen(false);

      if (!invoiceId) {
        // Payment was accepted but we cannot track it — don't imply failure.
        toast.success('Payment request sent. Approve the prompt on your phone.', {
          position: 'bottom-center'
        });
        navigate('/95668339501103956045/buyer/invoices');
        return;
      }

      navigate(PAYMENT_ROUTES.processing(invoiceId), {
        state: { amountLabel, walletNumber: normalisedWallet, network }
      });
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      // Backend can also signal PIN failures via thrown errors depending on mood;
      // treat anything matching 'pin' as a modal-level message instead of a toast.
      if (typeof apiMsg === 'string' && /pin/i.test(apiMsg)) {
        setPinError(apiMsg);
      } else {
        setPinModalOpen(false);
        toast.error(apiMsg || 'Checkout failed. Please try again.', {
          position: 'bottom-center'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openPinModal = () => {
    const problem = validationError();
    if (problem) {
      toast.error(problem, { position: 'bottom-center' });
      return;
    }
    setPinError(undefined);
    setPinModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Address Selection */}
      <div className="lg:col-span-2 space-y-6">
        {/* Address mode tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Delivery Address</h2>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setMode('existing')}
              disabled={addresses.length === 0}
              className={`text-sm font-medium px-5 py-2 rounded-lg transition-all duration-150 disabled:opacity-40 ${
                mode === 'existing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Saved Address
            </button>
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`text-sm font-medium px-5 py-2 rounded-lg transition-all duration-150 ${
                mode === 'new' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New Address
            </button>
          </div>

          {mode === 'existing' ? (
            <div className="space-y-3">
              {addressesLoading ? (
                <SpepasLoader size="md" label="Loading your addresses…" />
              ) : addresses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  You have no saved addresses yet. Switch to <span className="font-medium">New Address</span> to add one.
                </p>
              ) : (
                addresses.map((addr) => {
                  const selected = addr.address_id === selectedAddressId;
                  return (
                    <button
                      key={addr.address_id}
                      type="button"
                      onClick={() => setSelectedAddressId(addr.address_id)}
                      className={`w-full text-left border rounded-xl p-4 flex items-start gap-3 transition ${
                        selected ? 'border-blue/40 bg-blue/5' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selected ? 'bg-blue/10' : 'bg-gray-100'
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 ${selected ? 'text-blue' : 'text-gray-400'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{addr.title || 'Saved address'}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{addr.addressDetails}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Address Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Home, Office" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Address Details</label>
                <textarea
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  rows={3}
                  placeholder="Street, building, landmarks..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Delivery Location</label>
                <MapPicker
                  value={{ lat: latNum, lng: lngNum }}
                  onChange={(lat, lng) => { setNewLat(String(lat)); setNewLng(String(lng)); }}
                  height={240}
                  showLocate
                  showSearch
                  defaultZoom={12}
                />
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Payment Method</h2>

          <div className="border border-blue/20 bg-blue/5 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Mobile Money</p>
              <p className="text-xs text-gray-500 mt-0.5">
                We'll push a payment prompt to this number — approve it with your mobile money PIN.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="momo-number" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Mobile Money Number
              </label>
              <input
                id="momo-number"
                type="tel"
                inputMode="numeric"
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                placeholder="0241234567"
                className={inputClass}
              />
              {walletNumber && !normalisedWallet && (
                <p className="mt-1.5 text-xs text-red-600">Enter a valid Ghana number, e.g. 0241234567.</p>
              )}
            </div>
            <div>
              <label htmlFor="momo-network" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Network
              </label>
              <select
                id="momo-network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className={inputClass}
              >
                {MOMO_NETWORKS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Order Summary</h2>

          <div className="space-y-3">
            {chargeRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{row.label}</span>
                <span className="font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Items</span>
              <span className="font-medium text-gray-900">{charges.TOTAL_ITEMS}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Grand Total</span>
              <span className="text-xl font-bold text-gray-900">{amountLabel}</span>
            </div>
          </div>

          <button
            onClick={openPinModal}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
          >
            {submitting ? (
              <SpepasLoader size="sm" className="inline-flex" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Pay {amountLabel}
          </button>

          <button
            onClick={() => navigate('/95668339501103956045/buyer/cart')}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition"
          >
            Back to Cart
          </button>
        </div>
      </div>

      <PinConfirmModal
        open={pinModalOpen}
        submitting={submitting}
        amountLabel={amountLabel}
        errorMessage={pinError}
        onCancel={() => {
          if (submitting) return;
          setPinModalOpen(false);
          setPinError(undefined);
        }}
        onConfirm={submitWithPin}
      />
    </div>
  );
};

export default CheckoutForm;
