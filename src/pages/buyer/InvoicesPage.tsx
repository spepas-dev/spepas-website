// src/pages/buyer/InvoicesPage.tsx
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import SpepasLoader from '@/components/common/SpepasLoader';
import Breadcrumb from '@/components/marketing/Common/Breadcrumb';
import { getMyHistoryInvoices, getMyPendingInvoices } from '@/lib/invoiceApis';
import type { InvoiceData } from '@/lib/invoiceZodValidation';
import { getInvoicesGeneratedForMeAPI, payGeneratedInvoiceAPI } from '@/lib/orderBidsApis';

// "Pending" + "History" are the buyer's OWN invoices (self-checkouts).
// "Generated For Me" lists invoices a Mepa-buyer created for THIS user to
// pay — the recipient can settle them inline from this page.
type Tab = 'pending' | 'history' | 'generated';

interface PayState {
  invoice_id: string;
  paymentMode: 'MOMO';
  walletNumber: string;
  network: string;
  pin: string;
}

const BuyerInvoicesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('pending');
  const [payTarget, setPayTarget] = useState<PayState | null>(null);
  const [paySubmitting, setPaySubmitting] = useState(false);
  const navigate = useNavigate();

  const pendingQuery = useQuery({
    queryKey: ['buyer-invoices-pending'],
    queryFn: getMyPendingInvoices,
    enabled: tab === 'pending'
  });

  const historyQuery = useQuery({
    queryKey: ['buyer-invoices-history'],
    queryFn: getMyHistoryInvoices,
    enabled: tab === 'history'
  });

  const generatedQuery = useQuery({
    queryKey: ['buyer-invoices-generated-for-me'],
    queryFn: getInvoicesGeneratedForMeAPI,
    enabled: tab === 'generated'
  });

  const activeQuery = tab === 'pending' ? pendingQuery : tab === 'history' ? historyQuery : generatedQuery;
  const invoices: InvoiceData[] = activeQuery.data?.data ?? [];

  return (
    <>
      <Breadcrumb title="My Invoices" pages={['My Invoices']} />
      <section className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['pending', 'history', 'generated'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t === 'pending' ? 'Pending' : t === 'history' ? 'History' : 'Generated For Me'}
            </button>
          ))}
        </div>

        {/* Loading */}
        {activeQuery.isLoading && <SpepasLoader />}

        {/* Error */}
        {activeQuery.isError && <div className="text-center py-12 text-red-500">Failed to load invoices. Please try again.</div>}

        {/* Empty */}
        {!activeQuery.isLoading && !activeQuery.isError && invoices.length === 0 && (
          <div className="text-center py-12 text-gray-400">No {tab} invoices found.</div>
        )}

        {/* Invoice List */}
        {invoices.length > 0 && (
          <div className="space-y-4">
            {invoices.map((inv) => {
              const generator = (inv as any).generator; // eslint-disable-line @typescript-eslint/no-explicit-any
              return (
                <div
                  key={inv.invoice_id}
                  className="bg-white rounded-lg shadow-sm border p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <button
                      type="button"
                      className="text-left flex-1 cursor-pointer"
                      onClick={() => navigate(`/95668339501103956045/buyer/invoices/${inv.invoice_id}`)}
                    >
                      <p className="text-xs text-gray-400 font-mono">{inv.invoice_id}</p>
                      <p className="font-semibold text-lg mt-1">GH₵ {inv.total_amount?.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {inv.total_items} item{inv.total_items !== 1 ? 's' : ''}
                      </p>
                      {tab === 'generated' && generator && (
                        <p className="text-xs text-blue mt-1">
                          From {generator.name} ({generator.phoneNumber})
                        </p>
                      )}
                    </button>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          inv.statusMessage === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : inv.statusMessage === 'COMPLETED' || inv.statusMessage === 'DELIVERED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {inv.statusMessage ?? `Status ${inv.status}`}
                      </span>
                      <p className="text-xs text-gray-400 mt-2">{new Date(inv.createdAt).toLocaleDateString()}</p>
                      {tab === 'generated' && inv.paymentStatus !== 1 && (
                        <button
                          onClick={() =>
                            setPayTarget({
                              invoice_id: inv.invoice_id,
                              paymentMode: 'MOMO',
                              walletNumber: '',
                              network: '',
                              pin: ''
                            })
                          }
                          className="mt-2 inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue to-blue-500 text-white text-xs font-medium hover:opacity-90"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
              </label>

              <label className="block text-xs font-medium text-gray-700">
                Network
                <select
                  value={payTarget.network}
                  onChange={(e) => setPayTarget({ ...payTarget, network: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
                >
                  <option value="">Select network…</option>
                  <option value="MTN">MTN</option>
                  <option value="VODAFONE">Telecel (Vodafone)</option>
                  <option value="AIRTELTIGO">AirtelTigo</option>
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
                  disabled={paySubmitting || !payTarget.walletNumber || !payTarget.network || payTarget.pin.length < 4}
                  onClick={async () => {
                    setPaySubmitting(true);
                    try {
                      const resp = await payGeneratedInvoiceAPI({
                        pin: payTarget.pin,
                        invoice_id: payTarget.invoice_id,
                        paymentDetails: {
                          paymentMode: payTarget.paymentMode,
                          walletNumber: payTarget.walletNumber,
                          network: payTarget.network
                        }
                      });
                      if (resp?.status === 1) {
                        toast.success('Payment submitted. Approve on your phone.');
                        setPayTarget(null);
                        generatedQuery.refetch();
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
      </section>
    </>
  );
};

export default BuyerInvoicesPage;
