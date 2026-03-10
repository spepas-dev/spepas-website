// src/components/gopaInvoices/GopaAcceptedInvoiceItemDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGopaAcceptedInvoiceItemDetails } from '@/lib/gopaInvoiceApis';
import SpepasLoader from '@/components/common/SpepasLoader';
import { Package, AlertCircle } from 'lucide-react';

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

const GopaAcceptedInvoiceItemDetails: React.FC = () => {
  const { item_id } = useParams<{ item_id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!item_id) return;
    (async () => {
      try {
        const res = await getGopaAcceptedInvoiceItemDetails(item_id);
        setItem(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [item_id]);

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <Package className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">Item Details</h1>
            <p className="text-sm text-dark-4">
              View item information and status
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <SpepasLoader
            size="lg"
            label="Loading item details..."
            fullSection
          />
        )}

        {/* Error */}
        {error && (
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

        {!loading && !error && !item && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-12 flex flex-col items-center gap-3">
            <AlertCircle className="h-10 w-10 text-dark-4" />
            <p className="text-sm font-medium text-dark">No data found.</p>
          </div>
        )}

        {item && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-dark">Order Item</h2>
                <p className="text-xs font-mono text-dark-4 mt-1">
                  {item.item_id}
                </p>
              </div>
              {statusBadge(item.statusMessage)}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                <p className="text-xs text-dark-4">Quantity</p>
                <p className="font-bold text-lg text-dark mt-1">
                  {item.total_items}
                </p>
              </div>
              <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                <p className="text-xs text-dark-4">Amount</p>
                <p className="font-bold text-lg text-dark mt-1">
                  GH&#8373;{' '}
                  {item.total_amount?.toFixed(2) ?? item.total_amount}
                </p>
              </div>
              {item.createdAt && (
                <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                  <p className="text-xs text-dark-4">Created</p>
                  <p className="font-semibold text-sm text-dark mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* QR Value */}
            {item.qr_value && (
              <div className="mt-5 pt-5 border-t border-gray-3">
                <p className="text-xs font-medium text-dark-4 uppercase tracking-wide mb-2">
                  QR Value
                </p>
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
                <p className="text-xs font-medium text-dark-4 uppercase tracking-wide mb-3">
                  Delivery Info
                </p>
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
                      <p className="text-xs text-dark-4">Rider Accepted At</p>
                      <p className="font-medium text-dark text-sm mt-1">
                        {new Date(item.date_rider_accepted).toLocaleString()}
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
                <p className="text-xs font-medium text-dark-4 uppercase tracking-wide mb-1">
                  Rider
                </p>
                <p className="text-sm font-medium text-dark">
                  {item.rider.name ?? item.rider_user_id}
                </p>
              </div>
            )}

            {/* Spare Part */}
            {item.cart?.bid?.orderRequest?.sparePart && (
              <div className="mt-5 pt-5 border-t border-gray-3">
                <p className="text-xs font-medium text-dark-4 uppercase tracking-wide mb-2">
                  Spare Part
                </p>
                <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                  <p className="font-medium text-dark">
                    {item.cart.bid.orderRequest.sparePart.name}
                  </p>
                  {item.cart.bid.orderRequest.sparePart.description && (
                    <p className="text-sm text-dark-4 mt-1">
                      {item.cart.bid.orderRequest.sparePart.description}
                    </p>
                  )}
                  {item.cart.bid.seller?.storeName && (
                    <p className="text-sm text-dark-4 mt-1">
                      Seller:{' '}
                      <span className="font-medium text-dark">
                        {item.cart.bid.seller.storeName}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tracker */}
            {item.tracker && item.tracker.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-3">
                <p className="text-xs font-medium text-dark-4 uppercase tracking-wide mb-3">
                  Tracking History
                </p>
                <div className="relative pl-6">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-3" />
                  <div className="space-y-4">
                    {item.tracker.map((t: any, i: number) => (
                      <div
                        key={i}
                        className="relative flex items-start gap-3"
                      >
                        <div className="absolute -left-6 mt-1.5 h-2.5 w-2.5 rounded-full bg-blue flex-shrink-0" />
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
                    ))}
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

export default GopaAcceptedInvoiceItemDetails;
