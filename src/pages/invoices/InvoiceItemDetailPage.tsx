// src/pages/invoices/InvoiceItemDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInvoiceItemDetails } from '@/lib/invoiceApis';
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  Package,
  AlertCircle,
  QrCode,
  Truck,
  User,
  Wrench,
  Clock,
  CheckCircle2,
  Circle,
} from 'lucide-react';

const statusBadge = (status?: string) => {
  const label = status ?? 'Unknown';
  let colors = 'bg-gray-1 text-dark-4';
  if (status === 'PENDING') colors = 'bg-yellow-50 text-yellow-600';
  else if (status === 'DELIVERED' || status === 'COMPLETED')
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

const InvoiceItemDetailPage: React.FC = () => {
  const { item_id } = useParams<{ invoice_id: string; item_id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoice-item-detail', item_id],
    queryFn: () => getInvoiceItemDetails(item_id!),
    enabled: !!item_id,
  });

  const item = data?.data;

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <Package className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">Order Item Details</h1>
            <p className="text-sm text-dark-4">
              Track item status and delivery progress
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <SpepasLoader
            size="lg"
            label="Loading item details..."
            fullSection
          />
        )}

        {/* Error */}
        {isError && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-8 flex flex-col items-center gap-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-sm font-medium text-dark">
              Failed to load item details.
            </p>
            <p className="text-xs text-dark-4">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {item && (
          <div className="space-y-6">
            {/* Item Overview Card */}
            <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-dark">Order Item</h2>
                  <p className="text-xs font-mono text-dark-4 mt-1">
                    {item.item_id}
                  </p>
                </div>
                {statusBadge(item.statusMessage ?? `Status ${item.status}`)}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                {[
                  { label: 'Quantity', value: String(item.total_items) },
                  {
                    label: 'Amount',
                    value: `GH\u20B5 ${item.total_amount?.toFixed(2)}`,
                  },
                  {
                    label: 'Created',
                    value: new Date(item.createdAt).toLocaleString(),
                    small: true,
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-gray-1 rounded-xl border border-gray-3 p-4"
                  >
                    <p className="text-xs text-dark-4">{m.label}</p>
                    <p
                      className={`mt-1 font-semibold text-dark ${
                        m.small ? 'text-sm' : ''
                      }`}
                    >
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* QR Value */}
              {item.qr_value && (
                <div className="mt-5 pt-5 border-t border-gray-3">
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="h-4 w-4 text-dark-4" />
                    <p className="text-xs font-medium text-dark-4 uppercase tracking-wide">
                      QR Value
                    </p>
                  </div>
                  <div className="bg-gray-1 rounded-xl border border-gray-3 p-3">
                    <p className="text-sm font-mono text-dark break-all">
                      {item.qr_value}
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              {(item.readyForPickup !== undefined ||
                item.riderAccepted !== undefined) && (
                <div className="mt-5 pt-5 border-t border-gray-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-dark-4" />
                    <p className="text-xs font-medium text-dark-4 uppercase tracking-wide">
                      Delivery Info
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {item.readyForPickup !== undefined && (
                      <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                        <p className="text-xs text-dark-4">Ready for Pickup</p>
                        <p className="font-medium text-dark mt-1">
                          {item.readyForPickup ? 'Yes' : 'No'}
                        </p>
                      </div>
                    )}
                    {item.riderAccepted !== undefined && (
                      <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                        <p className="text-xs text-dark-4">Rider Accepted</p>
                        <p className="font-medium text-dark mt-1">
                          {item.riderAccepted ? 'Yes' : 'No'}
                        </p>
                      </div>
                    )}
                    {item.date_rider_accepted && (
                      <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                        <p className="text-xs text-dark-4">
                          Rider Accepted At
                        </p>
                        <p className="font-medium text-dark text-sm mt-1">
                          {new Date(
                            item.date_rider_accepted
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {item.date_delivered && (
                      <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                        <p className="text-xs text-dark-4">Delivered At</p>
                        <p className="font-medium text-dark text-sm mt-1">
                          {new Date(item.date_delivered).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rider Info */}
              {item.rider && (
                <div className="mt-5 pt-5 border-t border-gray-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-dark-4" />
                    <p className="text-xs font-medium text-dark-4 uppercase tracking-wide">
                      Rider
                    </p>
                  </div>
                  <p className="text-sm font-medium text-dark">
                    {item.rider.name ?? item.rider_user_id}
                  </p>
                </div>
              )}
            </div>

            {/* Spare Part Card */}
            {item.cart?.bid?.orderRequest?.sparePart && (
              <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="h-4 w-4 text-dark-4" />
                  <h3 className="font-semibold text-dark">Spare Part</h3>
                </div>
                <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                  <p className="font-medium text-dark">
                    {item.cart.bid.orderRequest.sparePart.name}
                  </p>
                  <p className="text-sm text-dark-4 mt-1">
                    {item.cart.bid.orderRequest.sparePart.description}
                  </p>
                  {item.cart.bid.seller?.storeName && (
                    <p className="text-sm text-dark-4 mt-2">
                      Seller:{' '}
                      <span className="font-medium text-dark">
                        {item.cart.bid.seller.storeName}
                      </span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-3">
                    <div>
                      <p className="text-xs text-dark-4">Unit Price</p>
                      <p className="text-sm font-semibold text-dark">
                        GH&#8373; {item.cart.bid.unitPrice?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-4">Total Price</p>
                      <p className="text-sm font-semibold text-dark">
                        GH&#8373; {item.cart.bid.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Timeline */}
            {item.tracker && item.tracker.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="h-4 w-4 text-dark-4" />
                  <h3 className="font-semibold text-dark">Tracking History</h3>
                </div>
                <div className="relative pl-6">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-3" />
                  <div className="space-y-4">
                    {item.tracker.map((t: any, i: number) => {
                      const isLast = i === item.tracker.length - 1;
                      return (
                        <div key={i} className="relative flex items-start gap-3">
                          <div className="absolute -left-6 mt-0.5">
                            {isLast ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-dark-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark">
                              {t.statusMessage ?? t.status}
                            </p>
                            {t.createdAt && (
                              <p className="text-xs text-dark-4">
                                {new Date(t.createdAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default InvoiceItemDetailPage;
