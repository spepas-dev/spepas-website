/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/invoices/InvoiceItemDetailPage.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

import Breadcrumb from '@/components/marketing/Common/Breadcrumb';
import { getInvoiceItemDetails } from '@/lib/invoiceApis';

const InvoiceItemDetailPage: React.FC = () => {
  const { item_id } = useParams<{ invoice_id: string; item_id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoice-item-detail', item_id],
    queryFn: () => getInvoiceItemDetails(item_id!),
    enabled: !!item_id
  });

  const item = data?.data;

  return (
    <>
      <Breadcrumb title="Item Details" pages={['Invoices', 'Item Details']} />
      <section className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-8">
        {isLoading && <div className="text-center py-12 text-gray-500">Loading item details...</div>}
        {isError && <div className="text-center py-12 text-red-500">Failed to load item details.</div>}

        {item && (
          <div className="space-y-6">
            {/* Item overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Order Item</h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">{item.item_id}</p>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium self-start ${
                    item.statusMessage === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : item.statusMessage === 'DELIVERED'
                        ? 'bg-green-100 text-green-700'
                        : item.statusMessage === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-700'
                          : item.statusMessage === 'READY_FOR_PICKUP'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.statusMessage ?? `Status ${item.status}`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-xs text-gray-400">Quantity</p>
                  <p className="font-semibold">{item.total_items}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="font-semibold">GH₵ {item.total_amount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Created</p>
                  <p className="font-semibold text-sm">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* QR value */}
              {item.qr_value && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-400">QR Value</p>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded mt-1">{item.qr_value}</p>
                </div>
              )}

              {/* Delivery info */}
              {(item.readyForPickup !== undefined || item.riderAccepted !== undefined) && (
                <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {item.readyForPickup !== undefined && (
                    <div>
                      <p className="text-xs text-gray-400">Ready for Pickup</p>
                      <p className="font-medium">{item.readyForPickup ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                  {item.riderAccepted !== undefined && (
                    <div>
                      <p className="text-xs text-gray-400">Rider Accepted</p>
                      <p className="font-medium">{item.riderAccepted ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                  {item.date_rider_accepted && (
                    <div>
                      <p className="text-xs text-gray-400">Rider Accepted At</p>
                      <p className="font-medium text-sm">{new Date(item.date_rider_accepted).toLocaleString()}</p>
                    </div>
                  )}
                  {item.date_delivered && (
                    <div>
                      <p className="text-xs text-gray-400">Delivered At</p>
                      <p className="font-medium text-sm">{new Date(item.date_delivered).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Rider info */}
              {item.rider && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-400">Rider</p>
                  <p className="text-sm font-medium">{item.rider.name ?? item.rider_user_id}</p>
                </div>
              )}

              {/* Bid / Spare Part info (nested in cart.bid.orderRequest.sparePart) */}
              {item.cart?.bid?.orderRequest?.sparePart && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-400 mb-2">Spare Part</p>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="font-medium">{item.cart.bid.orderRequest.sparePart.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.cart.bid.orderRequest.sparePart.description}</p>
                    {item.cart.bid.seller?.storeName && (
                      <p className="text-sm text-gray-500 mt-1">Seller: {item.cart.bid.seller.storeName}</p>
                    )}
                    <p className="text-sm font-medium mt-2">
                      Unit: GH₵ {item.cart.bid.unitPrice?.toFixed(2)} — Total: GH₵ {item.cart.bid.totalPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* Tracker */}
              {item.tracker && item.tracker.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-400 mb-2">Tracking History</p>
                  <div className="space-y-2">
                    {item.tracker.map((t: any, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{t.statusMessage ?? t.status}</p>
                          {t.createdAt && <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString()}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default InvoiceItemDetailPage;
