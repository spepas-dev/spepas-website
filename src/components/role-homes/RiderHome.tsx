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
  Truck,
  Package,
  ClipboardCheck,
  PackageCheck,
  Send,
  QrCode,
  ChevronRight,
  Inbox,
  AlertCircle,
  RefreshCw,
  Power,
} from 'lucide-react';

const PREFIX = '/95668339501103956045';

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */
const StatCard: React.FC<{
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}> = ({ label, count, icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 flex items-center gap-4 hover:border-blue/30 transition-colors duration-200 text-left w-full"
  >
    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-dark">{count}</p>
      <p className="text-sm text-dark-4 truncate">{label}</p>
    </div>
  </button>
);

/* ------------------------------------------------------------------ */
/*  Invoice Mini Card                                                  */
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

const InvoiceMiniCard: React.FC<{
  invoice: any;
  onClick: () => void;
}> = ({ invoice, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white rounded-xl border border-gray-3 p-4 hover:border-blue/30 transition-colors duration-200 text-left"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-mono text-dark-4 truncate">{invoice.invoice_id}</p>
        <p className="text-sm font-semibold text-dark mt-1">
          GH&#x20B5; {invoice.total_amount?.toFixed(2) ?? '0.00'}
        </p>
        <p className="text-xs text-dark-4 mt-0.5">
          {invoice.user?.name ?? 'Unknown buyer'}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyle(
            invoice.statusMessage,
          )}`}
        >
          {invoice.statusMessage ?? `Status ${invoice.status}`}
        </span>
        <ChevronRight size={14} className="text-dark-4" />
      </div>
    </div>
  </button>
);

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */
const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-12 flex flex-col items-center justify-center">
    <div className="h-12 w-12 rounded-xl bg-gray-1 flex items-center justify-center mb-3">
      <Inbox size={24} className="text-dark-4" />
    </div>
    <p className="text-sm text-dark-4">{text}</p>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
const RiderHome: React.FC<{ riderName: string }> = ({ riderName: _riderName }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [tab, setTab] = useState<'acceptance' | 'pickup' | 'ship'>('acceptance');

  /* ---------- Queries (only fetch when online) ---------- */
  const acceptanceQuery = useQuery({
    queryKey: ['rider-home-acceptance'],
    queryFn: getInvoicePendingRiderAcceptance,
    enabled: isOnline,
  });

  const pickupQuery = useQuery({
    queryKey: ['rider-home-pickup'],
    queryFn: getInvoicePendingRiderPickup,
    enabled: isOnline,
  });

  const shipQuery = useQuery({
    queryKey: ['rider-home-ship'],
    queryFn: getReadyToShipInvoiceItems,
    enabled: isOnline,
  });

  const acceptanceData: any[] = acceptanceQuery.data?.data ?? [];
  const pickupData: any[] = pickupQuery.data?.data ?? [];
  const shipData: any[] = shipQuery.data?.data ?? [];

  const isLoading = acceptanceQuery.isLoading || pickupQuery.isLoading || shipQuery.isLoading;

  const currentData =
    tab === 'acceptance' ? acceptanceData : tab === 'pickup' ? pickupData : shipData;
  const currentQuery =
    tab === 'acceptance' ? acceptanceQuery : tab === 'pickup' ? pickupQuery : shipQuery;

  const refreshAll = () => {
    acceptanceQuery.refetch();
    pickupQuery.refetch();
    shipQuery.refetch();
  };

  const tabs_config: { key: typeof tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'acceptance', label: 'Pending Acceptance', icon: <ClipboardCheck size={16} />, count: acceptanceData.length },
    { key: 'pickup', label: 'Pending Pickup', icon: <PackageCheck size={16} />, count: pickupData.length },
    { key: 'ship', label: 'Ready to Ship', icon: <Send size={16} />, count: shipData.length },
  ];

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
              <Truck size={20} className="text-blue" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-dark">Rider Dashboard</h1>
              <p className="text-sm text-dark-4">Manage your deliveries</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOnline && (
              <button
                onClick={refreshAll}
                className="inline-flex items-center gap-1.5 text-sm text-dark-4 hover:text-blue transition-colors duration-200"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}

            {/* Go Live toggle */}
            <button
              onClick={() => setIsOnline((prev) => !prev)}
              className={`inline-flex items-center gap-2 font-medium text-sm py-2.5 px-5 rounded-xl transition-colors duration-200 ${
                isOnline
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-dark text-white hover:bg-dark-2'
              }`}
            >
              <Power size={16} />
              {isOnline ? 'Online' : 'Go Live'}
            </button>
          </div>
        </div>

        {/* Offline hero */}
        {!isOnline && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-8 sm:p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-light-5 flex items-center justify-center mb-5">
              <Truck size={32} className="text-blue" />
            </div>
            <h2 className="text-lg font-semibold text-dark mb-1">
              You're currently offline
            </h2>
            <p className="text-sm text-dark-4 mb-6 max-w-md mx-auto">
              Go online to start receiving delivery requests from nearby sellers and buyers. Your dashboard and trip data will load once you're live.
            </p>
            <button
              onClick={() => setIsOnline(true)}
              className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-3 px-8 rounded-xl hover:bg-blue-dark transition-colors duration-200"
            >
              <Power size={16} />
              Go Online
            </button>
          </div>
        )}

        {/* Online content */}
        {isOnline && isLoading ? (
          <SpepasLoader size="lg" label="Loading dashboard..." fullSection />
        ) : isOnline ? (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Pending Acceptance"
                count={acceptanceData.length}
                icon={<ClipboardCheck size={20} className="text-yellow-600" />}
                color="bg-yellow-50"
                onClick={() => setTab('acceptance')}
              />
              <StatCard
                label="Pending Pickup"
                count={pickupData.length}
                icon={<PackageCheck size={20} className="text-blue" />}
                color="bg-blue-light-5"
                onClick={() => setTab('pickup')}
              />
              <StatCard
                label="Ready to Ship"
                count={shipData.length}
                icon={<Send size={20} className="text-green-600" />}
                color="bg-green-50"
                onClick={() => setTab('ship')}
              />
              <StatCard
                label="QR Lookup"
                count={0}
                icon={<QrCode size={20} className="text-purple-600" />}
                color="bg-purple-50"
                onClick={() => navigate(`${PREFIX}/rider/invoices`)}
              />
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => navigate(`${PREFIX}/rider/invoices`)}
                className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
              >
                <Package size={16} />
                Full Deliveries Dashboard
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tabs_config.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-1.5 font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200 ${
                    tab === t.key
                      ? 'bg-blue text-white'
                      : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
                  }`}
                >
                  {t.icon}
                  {t.label}
                  {t.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        tab === t.key ? 'bg-white/20' : 'bg-gray-2'
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Error state */}
            {currentQuery.isError && (
              <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-12 flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <p className="text-sm text-dark-4">Failed to load data. Please try again.</p>
              </div>
            )}

            {/* Empty state */}
            {!currentQuery.isError && currentData.length === 0 && (
              <EmptyState
                text={
                  tab === 'acceptance'
                    ? 'No invoices pending your acceptance.'
                    : tab === 'pickup'
                      ? 'No items pending pickup.'
                      : 'No items ready to ship.'
                }
              />
            )}

            {/* Invoice list */}
            {currentData.length > 0 && (
              <div className="space-y-3">
                {currentData.map((entry: any, idx: number) => {
                  const invoice = entry.invoice ?? entry;
                  return (
                    <InvoiceMiniCard
                      key={invoice.invoice_id ?? idx}
                      invoice={invoice}
                      onClick={() => navigate(`${PREFIX}/rider/invoices`)}
                    />
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default RiderHome;
