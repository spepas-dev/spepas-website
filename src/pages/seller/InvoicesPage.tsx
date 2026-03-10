// src/pages/seller/InvoicesPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getSellerPendingInvoices,
  getSellerHistoryInvoices,
  setOrderItemReadyForPickup,
  sellerDeliverToRider,
} from '@/lib/invoiceApis';
import type { InvoiceData, InvoiceItem } from '@/lib/invoiceZodValidation';
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  FileText,
  ChevronDown,
  AlertCircle,
  Inbox,
  PackageCheck,
  Truck,
  ExternalLink,
} from 'lucide-react';

type Tab = 'pending' | 'history';

/* ------------------------------------------------------------------ */
/*  Status badge helper                                                */
/* ------------------------------------------------------------------ */
const statusBadge = (message?: string) => {
  const label = message ?? 'Unknown';
  let classes = 'bg-gray-1 text-dark-4';

  if (label === 'PENDING') classes = 'bg-amber-50 text-amber-700';
  else if (label === 'COMPLETED' || label === 'DELIVERED')
    classes = 'bg-green-light-1 text-green-dark';
  else if (label === 'READY_FOR_PICKUP') classes = 'bg-blue-light-5 text-blue';

  return (
    <span
      className={`text-[10px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${classes}`}
    >
      {label}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const SellerInvoicesPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [tab, setTab] = useState<Tab>('pending');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* --- queries ---------------------------------------------------- */
  const pendingQuery = useQuery({
    queryKey: ['seller-invoices-pending', sellerId],
    queryFn: () => getSellerPendingInvoices(sellerId!),
    enabled: tab === 'pending' && !!sellerId,
  });

  const historyQuery = useQuery({
    queryKey: ['seller-invoices-history', sellerId],
    queryFn: () => getSellerHistoryInvoices(sellerId!),
    enabled: tab === 'history' && !!sellerId,
  });

  /* --- mutations -------------------------------------------------- */
  const readyForPickupMutation = useMutation({
    mutationFn: setOrderItemReadyForPickup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['seller-invoices-pending'],
      });
      setSelectedItems([]);
    },
  });

  const deliverToRiderMutation = useMutation({
    mutationFn: sellerDeliverToRider,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['seller-invoices-pending'],
      });
      setSelectedItems([]);
    },
  });

  const activeQuery = tab === 'pending' ? pendingQuery : historyQuery;
  const invoices: InvoiceData[] = activeQuery.data?.data ?? [];

  const toggleItem = (item_id: string) => {
    setSelectedItems((prev) =>
      prev.includes(item_id)
        ? prev.filter((id) => id !== item_id)
        : [...prev, item_id]
    );
  };

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark">
              Invoices
            </h1>
            <p className="text-sm text-dark-4">
              Manage your orders and deliveries
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'history'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setExpandedInvoice(null);
                setSelectedItems([]);
              }}
              className={`font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200 ${
                tab === t
                  ? 'bg-blue text-white'
                  : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
              }`}
            >
              {t === 'pending' ? 'Pending Orders' : 'Order History'}
            </button>
          ))}
        </div>

        {/* Loading */}
        {activeQuery.isLoading && (
          <SpepasLoader size="lg" label="Loading invoices..." fullSection />
        )}

        {/* Error */}
        {activeQuery.isError && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              <p className="text-sm font-medium text-dark-2">
                Failed to load invoices
              </p>
              <p className="text-xs text-dark-4 mt-1">
                Please try again later
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!activeQuery.isLoading &&
          !activeQuery.isError &&
          invoices.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16">
              <div className="flex flex-col items-center justify-center text-center px-4">
                <div className="h-14 w-14 rounded-2xl bg-gray-1 flex items-center justify-center mb-4">
                  <Inbox className="h-7 w-7 text-dark-4" />
                </div>
                <p className="text-sm font-medium text-dark-2">
                  No {tab} invoices found
                </p>
                <p className="text-xs text-dark-4 mt-1">
                  {tab === 'pending'
                    ? 'New orders will appear here'
                    : 'Your completed orders will show here'}
                </p>
              </div>
            </div>
          )}

        {/* Invoice list */}
        {invoices.length > 0 && (
          <div className="space-y-4">
            {invoices.map((inv) => {
              const isExpanded = expandedInvoice === inv.invoice_id;
              const items: InvoiceItem[] = inv.items ?? [];

              return (
                <div
                  key={inv.invoice_id}
                  className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden"
                >
                  {/* Invoice header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedInvoice(isExpanded ? null : inv.invoice_id)
                    }
                    className="w-full p-4 sm:p-5 text-left hover:bg-gray-1/50 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-[10px] text-dark-4 font-mono tracking-wide">
                          {inv.invoice_id}
                        </p>
                        <p className="text-lg font-bold text-dark mt-1">
                          GH&#x20B5; {inv.total_amount?.toFixed(2)}
                        </p>
                        <p className="text-xs text-dark-4 mt-0.5">
                          {inv.total_items} item
                          {inv.total_items !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {statusBadge(inv.statusMessage ?? `Status ${inv.status}`)}
                        <ChevronDown
                          className={`h-5 w-5 text-dark-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Expanded items */}
                  {isExpanded && items.length > 0 && (
                    <div className="border-t border-gray-3 px-4 sm:px-5 py-4 bg-gray-1/30">
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.item_id}
                            className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-3"
                          >
                            {/* Checkbox for pending tab */}
                            {tab === 'pending' && (
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.item_id)}
                                onChange={() => toggleItem(item.item_id)}
                                className="h-4 w-4 rounded border-gray-3 text-blue focus:ring-blue/20 shrink-0"
                              />
                            )}

                            {/* Item info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-mono text-dark-4 truncate">
                                {item.item_id}
                              </p>
                              <p className="text-sm font-medium text-dark mt-0.5">
                                {item.total_items} x GH&#x20B5;{' '}
                                {item.total_amount?.toFixed(2)}
                              </p>
                            </div>

                            {/* Status badge */}
                            {statusBadge(
                              item.statusMessage ?? `Status ${item.status}`
                            )}

                            {/* Details button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/95668339501103956045/invoices/${inv.invoice_id}/items/${item.item_id}`
                                );
                              }}
                              className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:text-blue-dark transition-colors duration-200 shrink-0"
                            >
                              Details
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons for pending tab */}
                      {tab === 'pending' && selectedItems.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-3">
                          <button
                            type="button"
                            onClick={() =>
                              readyForPickupMutation.mutate({
                                items: selectedItems,
                              })
                            }
                            disabled={readyForPickupMutation.isPending}
                            className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark disabled:opacity-50 transition-colors duration-200"
                          >
                            <PackageCheck className="h-4 w-4" />
                            {readyForPickupMutation.isPending
                              ? 'Setting...'
                              : 'Mark Ready for Pickup'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              deliverToRiderMutation.mutate({
                                items: selectedItems,
                              })
                            }
                            disabled={deliverToRiderMutation.isPending}
                            className="inline-flex items-center gap-2 bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 disabled:opacity-50 transition-colors duration-200"
                          >
                            <Truck className="h-4 w-4" />
                            {deliverToRiderMutation.isPending
                              ? 'Delivering...'
                              : 'Deliver to Rider'}
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
      </div>
    </section>
  );
};

export default SellerInvoicesPage;
