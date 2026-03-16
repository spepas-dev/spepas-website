// src/pages/rider/invoices.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getInvoicePendingRiderAcceptance,
  getInvoicePendingRiderPickup,
  getReadyToShipInvoiceItems,
  acceptOrderItemPickup,
  setItemReadyForShipment,
  deliverItemToBuyer,
  getInvoiceItemByQr,
} from '@/lib/invoiceApis';
import Breadcrumb from '@/components/marketing/Common/Breadcrumb';

type Tab = 'acceptance' | 'pickup' | 'ready-to-ship' | 'qr-scan';

const RiderInvoicesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('acceptance');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [qrValue, setQrValue] = useState('');
  const [qrResult, setQrResult] = useState<any>(null);
  const [qrError, setQrError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const acceptanceQuery = useQuery({
    queryKey: ['rider-invoices-acceptance'],
    queryFn: getInvoicePendingRiderAcceptance,
    enabled: tab === 'acceptance',
  });

  const pickupQuery = useQuery({
    queryKey: ['rider-invoices-pickup'],
    queryFn: getInvoicePendingRiderPickup,
    enabled: tab === 'pickup',
  });

  const readyToShipQuery = useQuery({
    queryKey: ['rider-invoices-ready-to-ship'],
    queryFn: getReadyToShipInvoiceItems,
    enabled: tab === 'ready-to-ship',
  });

  // Mutations
  const acceptPickupMutation = useMutation({
    mutationFn: acceptOrderItemPickup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rider-invoices-acceptance'] });
      queryClient.invalidateQueries({ queryKey: ['rider-invoices-pickup'] });
      setSelectedItems([]);
    },
  });

  const readyForShipmentMutation = useMutation({
    mutationFn: setItemReadyForShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rider-invoices-pickup'] });
      queryClient.invalidateQueries({ queryKey: ['rider-invoices-ready-to-ship'] });
      setSelectedItems([]);
    },
  });

  const deliverToBuyerMutation = useMutation({
    mutationFn: deliverItemToBuyer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rider-invoices-ready-to-ship'] });
      setSelectedItems([]);
    },
  });

  const toggleItem = (item_id: string) => {
    setSelectedItems((prev) =>
      prev.includes(item_id) ? prev.filter((id) => id !== item_id) : [...prev, item_id]
    );
  };

  const handleQrLookup = async () => {
    if (!qrValue.trim()) return;
    setQrError('');
    setQrResult(null);
    try {
      const res = await getInvoiceItemByQr(qrValue.trim());
      setQrResult(res.data);
    } catch {
      setQrError('Item not found for this QR value.');
    }
  };

  // Get active query data
  const getActiveData = () => {
    if (tab === 'acceptance') return acceptanceQuery;
    if (tab === 'pickup') return pickupQuery;
    if (tab === 'ready-to-ship') return readyToShipQuery;
    return null;
  };

  const activeQuery = getActiveData();
  // PRA* responses have { invoice, aggregatedDeliveries, SingleDeliveries } shape
  const invoiceEntries: any[] = activeQuery?.data?.data ?? [];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'acceptance', label: 'Pending Acceptance' },
    { key: 'pickup', label: 'Pending Pickup' },
    { key: 'ready-to-ship', label: 'Ready to Ship' },
    { key: 'qr-scan', label: 'QR Lookup' },
  ];

  return (
    <>
      <Breadcrumb title="Rider Deliveries" pages={['Rider', 'Deliveries']} />
      <section className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedItems([]); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* QR Tab */}
        {tab === 'qr-scan' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-lg mb-4">QR Code Lookup</h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                placeholder="Enter QR value (UUID)..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleQrLookup()}
              />
              <button
                onClick={handleQrLookup}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
            {qrError && <p className="text-red-500 text-sm">{qrError}</p>}
            {qrResult && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-xs font-mono text-gray-400">Item ID: {qrResult.item_id}</p>
                <p className="font-medium mt-1">
                  {qrResult.total_items} item{qrResult.total_items !== 1 ? 's' : ''} — GH₵ {qrResult.total_amount?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Status: {qrResult.statusMessage ?? `Status ${qrResult.status}`}</p>
                <p className="text-xs text-gray-400 mt-1">Invoice: {qrResult.invoice_id}</p>
                <button
                  onClick={() => navigate(`/95668339501103956045/invoices/${qrResult.invoice_id}/items/${qrResult.item_id}`)}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  View Full Details
                </button>
              </div>
            )}
          </div>
        )}

        {/* Invoice-based tabs */}
        {tab !== 'qr-scan' && (
          <>
            {/* Loading */}
            {activeQuery?.isLoading && (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            )}

            {/* Error */}
            {activeQuery?.isError && (
              <div className="text-center py-12 text-red-500">
                Failed to load data. Please try again.
              </div>
            )}

            {/* Empty */}
            {!activeQuery?.isLoading && !activeQuery?.isError && invoiceEntries.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No items found.
              </div>
            )}

            {/* List */}
            {invoiceEntries.length > 0 && (
              <div className="space-y-4">
                {invoiceEntries.map((entry: any, idx: number) => {
                  const invoice = entry.invoice ?? entry;
                  const allItems = [
                    ...(entry.aggregatedDeliveries?.flatMap((d: any) => d.items) ?? []),
                    ...(entry.SingleDeliveries ?? []),
                  ];
                  // Fallback: if no deliveries structure, use invoice.items
                  const items = allItems.length > 0 ? allItems : (invoice.items ?? []);

                  return (
                    <div key={invoice.invoice_id ?? idx} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                      {/* Invoice header */}
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-400 font-mono">{invoice.invoice_id}</p>
                            <p className="font-semibold text-lg mt-1">
                              GH₵ {invoice.total_amount?.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Buyer: {invoice.user?.name ?? 'N/A'}
                            </p>
                            {invoice.address?.addressDetails && (
                              <p className="text-sm text-gray-500">
                                Delivery: {invoice.address.addressDetails}
                              </p>
                            )}
                          </div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              invoice.statusMessage === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {invoice.statusMessage ?? `Status ${invoice.status}`}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      {items.length > 0 && (
                        <div className="border-t px-4 sm:px-6 py-4 bg-gray-50 space-y-2">
                          {items.map((item: any) => (
                            <div key={item.item_id} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.item_id)}
                                onChange={() => toggleItem(item.item_id)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <div className="flex-1">
                                <p className="text-xs font-mono text-gray-400">{item.item_id}</p>
                                <p className="text-sm font-medium">
                                  {item.total_items} x GH₵ {item.total_amount?.toFixed(2)}
                                </p>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                {item.statusMessage ?? `Status ${item.status}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action bar */}
            {selectedItems.length > 0 && (
              <div className="sticky bottom-4 mt-6 bg-white rounded-lg shadow-lg border p-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex-1" />
                {tab === 'acceptance' && (
                  <button
                    onClick={() => acceptPickupMutation.mutate({ items: selectedItems })}
                    disabled={acceptPickupMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {acceptPickupMutation.isPending ? 'Accepting...' : 'Accept Pickup'}
                  </button>
                )}
                {tab === 'pickup' && (
                  <button
                    onClick={() => readyForShipmentMutation.mutate({ items: selectedItems })}
                    disabled={readyForShipmentMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {readyForShipmentMutation.isPending ? 'Setting...' : 'Mark Ready for Shipment'}
                  </button>
                )}
                {tab === 'ready-to-ship' && (
                  <button
                    onClick={() => deliverToBuyerMutation.mutate({ items: selectedItems })}
                    disabled={deliverToBuyerMutation.isPending}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {deliverToBuyerMutation.isPending ? 'Delivering...' : 'Deliver to Buyer'}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default RiderInvoicesPage;
