// src/pages/buyer/InvoicesPage.tsx
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SpepasLoader from '@/components/common/SpepasLoader';
import Breadcrumb from '@/components/marketing/Common/Breadcrumb';
import { getMyHistoryInvoices, getMyPendingInvoices } from '@/lib/invoiceApis';
import type { InvoiceData } from '@/lib/invoiceZodValidation';

// Pending = the user's OWN invoices that haven't been delivered yet.
// History = the user's OWN delivered/cancelled invoices.
// Invoices that another (Mepa) buyer GENERATED for this user to pay live in
// the cart screen — that's where they need to be visible alongside the
// user's own cart items.
type Tab = 'pending' | 'history';

const BuyerInvoicesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('pending');
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

  const activeQuery = tab === 'pending' ? pendingQuery : historyQuery;
  const invoices: InvoiceData[] = activeQuery.data?.data ?? [];

  return (
    <>
      <Breadcrumb title="My Invoices" pages={['My Invoices']} />
      <section className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'history'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t === 'pending' ? 'Pending' : 'History'}
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
            {invoices.map((inv) => (
              <div
                key={inv.invoice_id}
                onClick={() => navigate(`/95668339501103956045/buyer/invoices/${inv.invoice_id}`)}
                className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">{inv.invoice_id}</p>
                    <p className="font-semibold text-lg mt-1">GH₵ {inv.total_amount?.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {inv.total_items} item{inv.total_items !== 1 ? 's' : ''}
                    </p>
                  </div>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default BuyerInvoicesPage;
