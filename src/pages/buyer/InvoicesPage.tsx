// src/pages/buyer/InvoicesPage.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMyPendingInvoices, getMyHistoryInvoices } from '@/lib/invoiceApis';
import type { InvoiceData } from '@/lib/invoiceZodValidation';
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  FileText,
  AlertCircle,
  Inbox,
  ChevronRight,
  Clock,
  History,
} from 'lucide-react';

type Tab = 'pending' | 'history';

const statusBadge = (status?: string) => {
  const label = status ?? 'Unknown';
  let colors = 'bg-gray-1 text-dark-4';
  if (status === 'PENDING') colors = 'bg-yellow-50 text-yellow-600';
  else if (status === 'COMPLETED' || status === 'DELIVERED')
    colors = 'bg-green-50 text-green-600';
  else if (status === 'SHIPPED' || status === 'READY_FOR_PICKUP')
    colors = 'bg-blue-light-5 text-blue';
  return (
    <span
      className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${colors}`}
    >
      {label}
    </span>
  );
};

const BuyerInvoicesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('pending');
  const navigate = useNavigate();

  const pendingQuery = useQuery({
    queryKey: ['buyer-invoices-pending'],
    queryFn: getMyPendingInvoices,
    enabled: tab === 'pending',
  });

  const historyQuery = useQuery({
    queryKey: ['buyer-invoices-history'],
    queryFn: getMyHistoryInvoices,
    enabled: tab === 'history',
  });

  const activeQuery = tab === 'pending' ? pendingQuery : historyQuery;
  const invoices: InvoiceData[] = activeQuery.data?.data ?? [];

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'pending',
      label: 'Pending',
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    {
      key: 'history',
      label: 'History',
      icon: <History className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">My Invoices</h1>
            <p className="text-sm text-dark-4">
              View and track your purchase invoices
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.key
                  ? 'bg-blue text-white'
                  : 'bg-white text-dark-4 border border-gray-3 hover:bg-blue-light-5 hover:text-blue'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {activeQuery.isLoading && (
          <SpepasLoader size="lg" label="Loading invoices..." fullSection />
        )}

        {/* Error */}
        {activeQuery.isError && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-8 flex flex-col items-center gap-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-sm font-medium text-dark">
              Failed to load invoices.
            </p>
            <p className="text-xs text-dark-4">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!activeQuery.isLoading &&
          !activeQuery.isError &&
          invoices.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-12 flex flex-col items-center gap-3">
              <Inbox className="h-10 w-10 text-dark-4" />
              <p className="text-sm font-medium text-dark">
                No {tab} invoices found.
              </p>
              <p className="text-xs text-dark-4">
                {tab === 'pending'
                  ? 'Your pending invoices will appear here.'
                  : 'Completed invoices will appear here.'}
              </p>
            </div>
          )}

        {/* Invoice List */}
        {invoices.length > 0 && (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.invoice_id}
                onClick={() =>
                  navigate(
                    `/95668339501103956045/buyer/invoices/${inv.invoice_id}`
                  )
                }
                className="bg-white rounded-2xl border border-gray-3 shadow-1 p-4 sm:p-5 cursor-pointer hover:border-blue transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-dark-4 font-mono truncate">
                      {inv.invoice_id}
                    </p>
                    <p className="font-bold text-lg text-dark mt-1">
                      GH&#8373; {inv.total_amount?.toFixed(2)}
                    </p>
                    <p className="text-sm text-dark-4">
                      {inv.total_items} item
                      {inv.total_items !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex sm:flex-col sm:items-end items-center justify-between gap-2">
                    {statusBadge(inv.statusMessage ?? `Status ${inv.status}`)}
                    <p className="text-xs text-dark-4 mt-0 sm:mt-2">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                    <ChevronRight className="h-4 w-4 text-dark-4 hidden sm:block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BuyerInvoicesPage;
