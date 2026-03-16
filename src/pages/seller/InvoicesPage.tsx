// src/pages/seller/InvoicesPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from '@/components/marketing/Common/Breadcrumb';
import { getSellerHistoryInvoices, getSellerPendingInvoices, sellerDeliverToRider, setOrderItemReadyForPickup } from '@/lib/invoiceApis';
import type { InvoiceData, InvoiceItem } from '@/lib/invoiceZodValidation';

type Tab = 'pending' | 'history';

const SellerInvoicesPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [tab, setTab] = useState<Tab>('pending');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const pendingQuery = useQuery({
    queryKey: ['seller-invoices-pending', sellerId],
    queryFn: () => getSellerPendingInvoices(sellerId!),
    enabled: tab === 'pending' && !!sellerId
  });

  const historyQuery = useQuery({
    queryKey: ['seller-invoices-history', sellerId],
    queryFn: () => getSellerHistoryInvoices(sellerId!),
    enabled: tab === 'history' && !!sellerId
  });

  const readyForPickupMutation = useMutation({
    mutationFn: setOrderItemReadyForPickup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-invoices-pending'] });
      setSelectedItems([]);
    }
  });

  const deliverToRiderMutation = useMutation({
    mutationFn: sellerDeliverToRider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-invoices-pending'] });
      setSelectedItems([]);
    }
  });

  const activeQuery = tab === 'pending' ? pendingQuery : historyQuery;
  const invoices: InvoiceData[] = activeQuery.data?.data ?? [];

  const toggleItem = (item_id: string) => {
    setSelectedItems((prev) => (prev.includes(item_id) ? prev.filter((id) => id !== item_id) : [...prev, item_id]));
  };

  return (
    <>
      <Breadcrumb title="Seller Invoices" pages={['Seller Invoices']} />
      <section className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'history'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setExpandedInvoice(null);
                setSelectedItems([]);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t === 'pending' ? 'Pending Orders' : 'Order History'}
            </button>
          ))}
        </div>

        {/* Loading */}
        {activeQuery.isLoading && <div className="text-center py-12 text-gray-500">Loading invoices...</div>}

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
              const isExpanded = expandedInvoice === inv.invoice_id;
              const items: InvoiceItem[] = inv.items ?? [];

              return (
                <div key={inv.invoice_id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  {/* Invoice header */}
                  <div
                    onClick={() => setExpandedInvoice(isExpanded ? null : inv.invoice_id)}
                    className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400 font-mono">{inv.invoice_id}</p>
                        <p className="font-semibold text-lg mt-1">GH₵ {inv.total_amount?.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {inv.total_items} item{inv.total_items !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-3">
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
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded items */}
                  {isExpanded && items.length > 0 && (
                    <div className="border-t px-4 sm:px-6 py-4 bg-gray-50">
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.item_id} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                            {tab === 'pending' && (
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.item_id)}
                                onChange={() => toggleItem(item.item_id)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-xs font-mono text-gray-400">{item.item_id}</p>
                              <p className="text-sm font-medium">
                                {item.total_items} x GH₵ {item.total_amount?.toFixed(2)}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                item.statusMessage === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : item.statusMessage === 'READY_FOR_PICKUP'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {item.statusMessage ?? `Status ${item.status}`}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/95668339501103956045/invoices/${inv.invoice_id}/items/${item.item_id}`);
                              }}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Details
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons for pending tab */}
                      {tab === 'pending' && selectedItems.length > 0 && (
                        <div className="flex gap-3 mt-4 pt-4 border-t">
                          <button
                            onClick={() => readyForPickupMutation.mutate({ items: selectedItems })}
                            disabled={readyForPickupMutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                          >
                            {readyForPickupMutation.isPending ? 'Setting...' : 'Mark Ready for Pickup'}
                          </button>
                          <button
                            onClick={() => deliverToRiderMutation.mutate({ items: selectedItems })}
                            disabled={deliverToRiderMutation.isPending}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                          >
                            {deliverToRiderMutation.isPending ? 'Delivering...' : 'Deliver to Rider'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default SellerInvoicesPage;
