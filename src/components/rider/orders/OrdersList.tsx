import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getInvoicePendingRiderAcceptance,
  getInvoicePendingRiderPickup,
  getReadyToShipInvoiceItems,
} from '@/lib/invoiceApis';
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  Package,
  Search,
  ClipboardCheck,
  PackageCheck,
  Truck,
  Inbox,
  AlertCircle,
  MapPin,
} from 'lucide-react';

const PREFIX = '/95668339501103956045';

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
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
/*  Order Card                                                         */
/* ------------------------------------------------------------------ */
const OrderCard: React.FC<{ entry: any; onClick: () => void }> = ({ entry, onClick }) => {
  const invoice = entry.invoice ?? entry;
  const allItems = [
    ...(entry.aggregatedDeliveries?.flatMap((d: any) => d.items) ?? []),
    ...(entry.SingleDeliveries ?? []),
  ];
  const items = allItems.length > 0 ? allItems : (invoice.items ?? []);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl border border-gray-3 shadow-1 p-5 hover:border-blue/30 transition-colors duration-200 text-left"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center shrink-0">
            <Package size={16} className="text-blue" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-mono text-dark-4 truncate">{invoice.invoice_id}</p>
            <p className="text-sm font-semibold text-dark mt-0.5">
              GH&#x20B5; {invoice.total_amount?.toFixed(2) ?? '0.00'}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0 ${statusStyle(
            invoice.statusMessage,
          )}`}
        >
          {invoice.statusMessage ?? `Status ${invoice.status}`}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-dark-4 mb-2">
        <MapPin size={12} />
        <span>{invoice.address?.addressDetails ?? 'Address not specified'}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-dark-4">
        <span>{invoice.user?.name ?? 'Unknown buyer'}</span>
        <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
type TabKey = 'in_progress' | 'delivered';

const OrdersList: React.FC<{ initialTab?: TabKey }> = ({ initialTab = 'in_progress' }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  /* Fetch real data from invoice APIs */
  const acceptanceQuery = useQuery({
    queryKey: ['rider-orders-acceptance'],
    queryFn: getInvoicePendingRiderAcceptance,
    enabled: tab === 'in_progress',
  });

  const pickupQuery = useQuery({
    queryKey: ['rider-orders-pickup'],
    queryFn: getInvoicePendingRiderPickup,
    enabled: tab === 'in_progress',
  });

  const shipQuery = useQuery({
    queryKey: ['rider-orders-ship'],
    queryFn: getReadyToShipInvoiceItems,
    enabled: tab === 'in_progress',
  });

  /* Combine in-progress data from all active stages */
  const inProgressData: any[] = [
    ...(acceptanceQuery.data?.data ?? []),
    ...(pickupQuery.data?.data ?? []),
    ...(shipQuery.data?.data ?? []),
  ];

  const isLoading =
    tab === 'in_progress' &&
    (acceptanceQuery.isLoading || pickupQuery.isLoading || shipQuery.isLoading);
  const isError =
    tab === 'in_progress' &&
    (acceptanceQuery.isError || pickupQuery.isError || shipQuery.isError);

  /* Filter by search */
  const currentData = tab === 'in_progress' ? inProgressData : [];
  const filtered = searchQuery
    ? currentData.filter((entry: any) => {
        const invoice = entry.invoice ?? entry;
        const id = invoice.invoice_id ?? '';
        const name = invoice.user?.name ?? '';
        const q = searchQuery.toLowerCase();
        return id.toLowerCase().includes(q) || name.toLowerCase().includes(q);
      })
    : currentData;

  const tabConfig: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'in_progress', label: 'In Progress', icon: <ClipboardCheck size={16} /> },
    { key: 'delivered', label: 'Delivered', icon: <PackageCheck size={16} /> },
  ];

  return (
    <div>
      {/* Search + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-4"
          />
          <input
            placeholder="Search by invoice ID or buyer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-3 bg-gray-1 pl-9 pr-4 text-sm text-dark focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
          />
        </div>
        <div className="flex gap-2">
          {tabConfig.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                tab === t.key
                  ? 'bg-blue text-white'
                  : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <SpepasLoader size="md" label="Loading orders..." fullSection />
      )}

      {/* Error */}
      {isError && (
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-12 flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <p className="text-sm text-dark-4">Failed to load orders. Please try again.</p>
        </div>
      )}

      {/* Delivered tab - no API available */}
      {tab === 'delivered' && (
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-12 flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-xl bg-gray-1 flex items-center justify-center mb-3">
            <Truck size={24} className="text-dark-4" />
          </div>
          <p className="text-sm text-dark-4">Delivery history not available yet.</p>
          <p className="text-xs text-dark-4 mt-1">This feature is coming soon.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && tab === 'in_progress' && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-12 flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-xl bg-gray-1 flex items-center justify-center mb-3">
            <Inbox size={24} className="text-dark-4" />
          </div>
          <p className="text-sm text-dark-4">
            {searchQuery ? 'No matching orders found.' : 'No active orders.'}
          </p>
        </div>
      )}

      {/* Order cards */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((entry: any, idx: number) => {
            const invoice = entry.invoice ?? entry;
            return (
              <OrderCard
                key={invoice.invoice_id ?? idx}
                entry={entry}
                onClick={() =>
                  navigate(
                    `${PREFIX}/invoices/${invoice.invoice_id}`,
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
