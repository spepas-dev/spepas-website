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
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  Truck,
  QrCode,
  PackageOpen,
  AlertCircle,
  Search,
  CheckCircle2,
  PackageCheck,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';

type Tab = 'acceptance' | 'pickup' | 'ready-to-ship' | 'qr-scan';

/* ------------------------------------------------------------------ */
/*  Status Badge helper                                                */
/* ------------------------------------------------------------------ */
const statusStyle = (msg?: string) => {
  switch (msg) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700';
    case 'COMPLETED':
    case 'DELIVERED':
      return 'bg-green-100 text-green-700';
    case 'READY_FOR_PICKUP':
    case 'READY_FOR_SHIPMENT':
      return 'bg-blue-light-5 text-blue';
    default:
      return 'bg-gray-1 text-dark-4';
  }
};

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
const RiderInvoicesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('acceptance');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [qrValue, setQrValue] = useState('');
  const [qrResult, setQrResult] = useState<any>(null);
  const [qrError, setQrError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ---------- Queries ---------- */
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

  /* ---------- Mutations ---------- */
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

  /* ---------- Helpers ---------- */
  const toggleItem = (item_id: string) => {
    setSelectedItems((prev) =>
      prev.includes(item_id) ? prev.filter((id) => id !== item_id) : [...prev, item_id],
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

  const getActiveData = () => {
    if (tab === 'acceptance') return acceptanceQuery;
    if (tab === 'pickup') return pickupQuery;
    if (tab === 'ready-to-ship') return readyToShipQuery;
    return null;
  };

  const activeQuery = getActiveData();
  const invoiceEntries: any[] = activeQuery?.data?.data ?? [];

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'acceptance', label: 'Pending Acceptance', icon: <ClipboardCheck size={16} /> },
    { key: 'pickup', label: 'Pending Pickup', icon: <PackageCheck size={16} /> },
    { key: 'ready-to-ship', label: 'Ready to Ship', icon: <Truck size={16} /> },
    { key: 'qr-scan', label: 'QR Lookup', icon: <QrCode size={16} /> },
  ];

  /* ---------- Action button config ---------- */
  const actionConfig: Record<
    Exclude<Tab, 'qr-scan'>,
    {
      label: string;
      pendingLabel: string;
      mutation: any;
    }
  > = {
    acceptance: {
      label: 'Accept Pickup',
      pendingLabel: 'Accepting...',
      mutation: acceptPickupMutation,
    },
    pickup: {
      label: 'Mark Ready for Shipment',
      pendingLabel: 'Setting...',
      mutation: readyForShipmentMutation,
    },
    'ready-to-ship': {
      label: 'Deliver to Buyer',
      pendingLabel: 'Delivering...',
      mutation: deliverToBuyerMutation,
    },
  };

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* ---- Page header ---- */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <Truck size={20} className="text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-dark">Deliveries</h1>
            <p className="text-sm text-dark-4">
              Manage pickups, shipments and deliveries
            </p>
          </div>
        </div>

        {/* ---- Tabs ---- */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSelectedItems([]);
              }}
              className={`inline-flex items-center gap-1.5 font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200 ${
                tab === t.key
                  ? 'bg-blue text-white'
                  : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  QR Lookup Tab                                                */}
        {/* ============================================================ */}
        {tab === 'qr-scan' && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <QrCode size={20} className="text-blue" />
              <h3 className="text-base font-semibold text-dark">QR Code Lookup</h3>
            </div>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-4"
                />
                <input
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  placeholder="Enter QR value (UUID)..."
                  className="w-full h-11 rounded-lg border border-gray-3 bg-gray-1 pl-10 pr-4 text-sm text-dark focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
                  onKeyDown={(e) => e.key === 'Enter' && handleQrLookup()}
                />
              </div>
              <button
                onClick={handleQrLookup}
                className="bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
              >
                Search
              </button>
            </div>

            {/* QR Error */}
            {qrError && (
              <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16 flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <p className="text-sm text-dark-4">{qrError}</p>
              </div>
            )}

            {/* QR Result */}
            {qrResult && (
              <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-mono text-dark-4">
                      {qrResult.item_id}
                    </p>
                    <p className="text-lg font-semibold text-dark mt-1">
                      {qrResult.total_items} item
                      {qrResult.total_items !== 1 ? 's' : ''} &mdash; GH&#x20B5;{' '}
                      {qrResult.total_amount?.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusStyle(
                      qrResult.statusMessage,
                    )}`}
                  >
                    {qrResult.statusMessage ?? `Status ${qrResult.status}`}
                  </span>
                </div>

                <p className="text-xs text-dark-4 mb-4">
                  Invoice: {qrResult.invoice_id}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/95668339501103956045/invoices/${qrResult.invoice_id}/items/${qrResult.item_id}`,
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-sm text-blue font-medium hover:underline"
                >
                  View Full Details
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Empty prompt when nothing searched yet */}
            {!qrResult && !qrError && (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="h-12 w-12 rounded-xl bg-blue-light-5 flex items-center justify-center mb-3">
                  <QrCode size={24} className="text-blue" />
                </div>
                <p className="text-sm text-dark-4">
                  Enter a QR code value above to look up an invoice item.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/*  Invoice-based Tabs                                           */}
        {/* ============================================================ */}
        {tab !== 'qr-scan' && (
          <>
            {/* Loading */}
            {activeQuery?.isLoading && (
              <SpepasLoader size="lg" label="Loading deliveries..." fullSection />
            )}

            {/* Error */}
            {activeQuery?.isError && (
              <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16 flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <p className="text-sm text-dark-4">
                  Failed to load data. Please try again.
                </p>
              </div>
            )}

            {/* Empty */}
            {!activeQuery?.isLoading &&
              !activeQuery?.isError &&
              invoiceEntries.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-xl bg-gray-1 flex items-center justify-center mb-3">
                    <PackageOpen size={24} className="text-dark-4" />
                  </div>
                  <p className="text-sm text-dark-4">No items found.</p>
                </div>
              )}

            {/* Invoice list */}
            {invoiceEntries.length > 0 && (
              <div className="space-y-4">
                {invoiceEntries.map((entry: any, idx: number) => {
                  const invoice = entry.invoice ?? entry;
                  const allItems = [
                    ...(entry.aggregatedDeliveries?.flatMap((d: any) => d.items) ?? []),
                    ...(entry.SingleDeliveries ?? []),
                  ];
                  const items =
                    allItems.length > 0 ? allItems : (invoice.items ?? []);

                  return (
                    <div
                      key={invoice.invoice_id ?? idx}
                      className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden"
                    >
                      {/* Invoice header */}
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-xs font-mono text-dark-4">
                              {invoice.invoice_id}
                            </p>
                            <p className="text-lg font-semibold text-dark mt-1">
                              GH&#x20B5; {invoice.total_amount?.toFixed(2)}
                            </p>
                            <p className="text-sm text-dark-4">
                              Buyer: {invoice.user?.name ?? 'N/A'}
                            </p>
                            {invoice.address?.addressDetails && (
                              <p className="text-sm text-dark-4">
                                Delivery: {invoice.address.addressDetails}
                              </p>
                            )}
                          </div>
                          <span
                            className={`self-start text-[10px] px-2.5 py-1 rounded-full font-medium ${statusStyle(
                              invoice.statusMessage,
                            )}`}
                          >
                            {invoice.statusMessage ??
                              `Status ${invoice.status}`}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      {items.length > 0 && (
                        <div className="border-t border-gray-3 px-5 sm:px-6 py-4 bg-gray-1 space-y-2">
                          {items.map((item: any) => (
                            <div
                              key={item.item_id}
                              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-3"
                            >
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.item_id)}
                                onChange={() => toggleItem(item.item_id)}
                                className="h-4 w-4 rounded border-gray-3 text-blue focus:ring-blue/20"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-mono text-dark-4 truncate">
                                  {item.item_id}
                                </p>
                                <p className="text-sm font-medium text-dark">
                                  {item.total_items} x GH&#x20B5;{' '}
                                  {item.total_amount?.toFixed(2)}
                                </p>
                              </div>
                              <span
                                className={`text-[10px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${statusStyle(
                                  item.statusMessage,
                                )}`}
                              >
                                {item.statusMessage ??
                                  `Status ${item.status}`}
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

            {/* Sticky action bar */}
            {selectedItems.length > 0 && tab !== 'qr-scan' && (
              <div className="sticky bottom-4 mt-6 bg-white rounded-2xl border border-gray-3 shadow-1 p-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue" />
                  <span className="text-sm text-dark font-medium">
                    {selectedItems.length} item
                    {selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex-1" />
                {tab !== 'qr-scan' && (
                  <button
                    onClick={() =>
                      actionConfig[tab].mutation.mutate({
                        items: selectedItems,
                      })
                    }
                    disabled={actionConfig[tab].mutation.isPending}
                    className="bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200 disabled:opacity-50"
                  >
                    {actionConfig[tab].mutation.isPending
                      ? actionConfig[tab].pendingLabel
                      : actionConfig[tab].label}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RiderInvoicesPage;
