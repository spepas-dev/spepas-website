/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/invoices/InvoiceDetailPage.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '@/components/marketing/Common/Breadcrumb';
import { getInvoiceDetails } from '@/lib/invoiceApis';

const InvoiceDetailPage: React.FC = () => {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoice-detail', invoice_id],
    queryFn: () => getInvoiceDetails(invoice_id!),
    enabled: !!invoice_id
  });

  const invoice = data?.data;

  return (
    <>
      <Breadcrumb title="Invoice Details" pages={['Invoices', 'Details']} />
      <section className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-8">
        {isLoading && <div className="text-center py-12 text-gray-500">Loading invoice...</div>}
        {isError && <div className="text-center py-12 text-red-500">Failed to load invoice details.</div>}

        {invoice && (
          <div className="space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Invoice</h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">{invoice.invoice_id}</p>
                  <p className="text-sm text-gray-500 mt-2">Created: {new Date(invoice.createdAt).toLocaleString()}</p>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium self-start ${
                    invoice.statusMessage === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : invoice.statusMessage === 'COMPLETED' || invoice.statusMessage === 'DELIVERED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {invoice.statusMessage ?? `Status ${invoice.status}`}
                </span>
              </div>

              {/* Financial summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-gray-400">Subtotal</p>
                  <p className="font-semibold">GH₵ {invoice.amount?.toFixed(2) ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Service Charge</p>
                  <p className="font-semibold">GH₵ {invoice.service_charge?.toFixed(2) ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Delivery</p>
                  <p className="font-semibold">GH₵ {invoice.delivery_charge?.toFixed(2) ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-bold text-lg">GH₵ {invoice.total_amount?.toFixed(2)}</p>
                </div>
              </div>

              {/* Payment info */}
              {invoice.paymentMode && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Payment: {invoice.paymentMode}
                    {invoice.paymentProvider ? ` (${invoice.paymentProvider})` : ''}
                    {invoice.paymentNumber ? ` — ${invoice.paymentNumber}` : ''}
                  </p>
                </div>
              )}

              {/* Address */}
              {invoice.address && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-400">Delivery Address</p>
                  <p className="text-sm font-medium">{invoice.address.title}</p>
                  <p className="text-sm text-gray-500">{invoice.address.addressDetails}</p>
                </div>
              )}
            </div>

            {/* Items */}
            {invoice.items && invoice.items.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-lg mb-4">Items ({invoice.items.length})</h3>
                <div className="space-y-3">
                  {invoice.items.map((item: any) => (
                    <div
                      key={item.item_id}
                      onClick={() => navigate(`/95668339501103956045/invoices/${invoice.invoice_id}/items/${item.item_id}`)}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border cursor-pointer hover:bg-gray-100 transition"
                    >
                      <div>
                        <p className="text-xs font-mono text-gray-400">{item.item_id}</p>
                        <p className="font-medium mt-1">
                          {item.total_items} item{item.total_items !== 1 ? 's' : ''} — GH₵ {item.total_amount?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.statusMessage === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : item.statusMessage === 'DELIVERED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.statusMessage ?? `Status ${item.status}`}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default InvoiceDetailPage;
