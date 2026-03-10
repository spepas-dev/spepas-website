import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInvoiceItemByQr } from '@/lib/invoiceApis';
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  Package,
  MapPin,
  User,
  QrCode,
  Search,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

const PREFIX = '/95668339501103956045';

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

const OrderDetail: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [qrInput, setQrInput] = useState(orderId ?? '');

  /* Try to look up the order via the QR/item lookup API */
  const itemQuery = useQuery({
    queryKey: ['rider-order-detail', orderId],
    queryFn: () => getInvoiceItemByQr(orderId!),
    enabled: !!orderId,
    retry: false,
  });

  const item = itemQuery.data?.data;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-dark-4 hover:text-blue transition-colors duration-200 mb-4"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* QR Lookup bar */}
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <QrCode size={18} className="text-blue" />
          <h3 className="text-sm font-semibold text-dark">Order / QR Lookup</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-4" />
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Enter QR value or item ID..."
              className="w-full h-10 rounded-lg border border-gray-3 bg-gray-1 pl-9 pr-4 text-sm text-dark focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && qrInput.trim()) {
                  navigate(`${PREFIX}/rider/orders/${qrInput.trim()}`);
                }
              }}
            />
          </div>
          <button
            onClick={() => {
              if (qrInput.trim()) navigate(`${PREFIX}/rider/orders/${qrInput.trim()}`);
            }}
            className="bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
          >
            Lookup
          </button>
        </div>
      </div>

      {/* Loading */}
      {itemQuery.isLoading && (
        <SpepasLoader size="md" label="Looking up order..." fullSection />
      )}

      {/* Error / not found */}
      {itemQuery.isError && (
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-12 flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <p className="text-sm font-medium text-dark">Item not found</p>
          <p className="text-xs text-dark-4 mt-1">
            No invoice item found for ID: {orderId}
          </p>
          <p className="text-xs text-dark-4 mt-0.5">
            Try entering a valid QR code or item ID above.
          </p>
        </div>
      )}

      {/* Item found */}
      {item && (
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
          {/* Header */}
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
                  <Package size={20} className="text-blue" />
                </div>
                <div>
                  <p className="text-xs font-mono text-dark-4">{item.item_id}</p>
                  <p className="text-lg font-semibold text-dark mt-0.5">
                    GH&#x20B5; {item.total_amount?.toFixed(2) ?? '0.00'}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusStyle(
                  item.statusMessage,
                )}`}
              >
                {item.statusMessage ?? `Status ${item.status}`}
              </span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-1 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-dark-4" />
                </div>
                <div>
                  <p className="text-xs text-dark-4">Items</p>
                  <p className="text-sm font-medium text-dark">{item.total_items ?? 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-1 flex items-center justify-center shrink-0">
                  <User size={14} className="text-dark-4" />
                </div>
                <div>
                  <p className="text-xs text-dark-4">Invoice</p>
                  <p className="text-sm font-medium text-dark font-mono truncate">
                    {item.invoice_id ?? 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {item.address?.addressDetails && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-1 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-dark-4" />
                </div>
                <div>
                  <p className="text-xs text-dark-4">Delivery Address</p>
                  <p className="text-sm font-medium text-dark">
                    {item.address.addressDetails}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-3 p-5 sm:p-6 bg-gray-1">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  navigate(`${PREFIX}/invoices/${item.invoice_id}/items/${item.item_id}`)
                }
                className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
              >
                View Full Details
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => navigate(`${PREFIX}/rider/invoices`)}
                className="inline-flex items-center gap-2 bg-white text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
              >
                Deliveries Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
