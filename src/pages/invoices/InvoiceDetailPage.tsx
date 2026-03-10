// src/pages/invoices/InvoiceDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInvoiceDetails } from '@/lib/invoiceApis';
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  FileText,
  ChevronRight,
  AlertCircle,
  CreditCard,
  MapPin,
  ShoppingBag,
} from 'lucide-react';

const statusBadge = (status?: string) => {
  const label = status ?? 'Unknown';
  let colors = 'bg-gray-1 text-dark-4';
  if (status === 'PENDING') colors = 'bg-yellow-50 text-yellow-600';
  else if (status === 'COMPLETED' || status === 'DELIVERED')
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

const InvoiceDetailPage: React.FC = () => {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoice-detail', invoice_id],
    queryFn: () => getInvoiceDetails(invoice_id!),
    enabled: !!invoice_id,
  });

  const invoice = data?.data;

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">Invoice Details</h1>
            <p className="text-sm text-dark-4">
              View invoice summary and line items
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <SpepasLoader size="lg" label="Loading invoice..." fullSection />
        )}

        {/* Error */}
        {isError && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-8 flex flex-col items-center gap-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-sm font-medium text-dark">
              Failed to load invoice details.
            </p>
            <p className="text-xs text-dark-4">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {invoice && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-dark">Invoice</h2>
                  <p className="text-xs font-mono text-dark-4 mt-1">
                    {invoice.invoice_id}
                  </p>
                  <p className="text-sm text-dark-4 mt-2">
                    Created: {new Date(invoice.createdAt).toLocaleString()}
                  </p>
                </div>
                {statusBadge(invoice.statusMessage ?? `Status ${invoice.status}`)}
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { label: 'Subtotal', value: invoice.amount },
                  { label: 'Service Charge', value: invoice.service_charge },
                  { label: 'Delivery', value: invoice.delivery_charge },
                  { label: 'Total', value: invoice.total_amount, bold: true },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="bg-gray-1 rounded-xl border border-gray-3 p-4"
                  >
                    <p className="text-xs text-dark-4">{f.label}</p>
                    <p
                      className={`mt-1 ${
                        f.bold
                          ? 'text-lg font-bold text-dark'
                          : 'font-semibold text-dark'
                      }`}
                    >
                      GH&#8373; {f.value?.toFixed(2) ?? '---'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Payment Info */}
              {invoice.paymentMode && (
                <div className="mt-5 pt-5 border-t border-gray-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="h-4 w-4 text-dark-4" />
                    <p className="text-xs font-medium text-dark-4 uppercase tracking-wide">
                      Payment
                    </p>
                  </div>
                  <p className="text-sm text-dark">
                    {invoice.paymentMode}
                    {invoice.paymentProvider
                      ? ` (${invoice.paymentProvider})`
                      : ''}
                    {invoice.paymentNumber
                      ? ` --- ${invoice.paymentNumber}`
                      : ''}
                  </p>
                </div>
              )}

              {/* Delivery Address */}
              {invoice.address && (
                <div className="mt-5 pt-5 border-t border-gray-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-dark-4" />
                    <p className="text-xs font-medium text-dark-4 uppercase tracking-wide">
                      Delivery Address
                    </p>
                  </div>
                  <p className="text-sm font-medium text-dark">
                    {invoice.address.title}
                  </p>
                  <p className="text-sm text-dark-4">
                    {invoice.address.addressDetails}
                  </p>
                </div>
              )}
            </div>

            {/* Items */}
            {invoice.items && invoice.items.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <ShoppingBag className="h-4 w-4 text-dark-4" />
                  <h3 className="font-semibold text-dark">
                    Items ({invoice.items.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {invoice.items.map((item: any) => (
                    <div
                      key={item.item_id}
                      onClick={() =>
                        navigate(
                          `/95668339501103956045/invoices/${invoice.invoice_id}/items/${item.item_id}`
                        )
                      }
                      className="flex items-center justify-between bg-gray-1 rounded-xl border border-gray-3 p-4 cursor-pointer hover:border-blue transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-dark-4 truncate">
                          {item.item_id}
                        </p>
                        <p className="font-medium text-dark mt-1">
                          {item.total_items} item
                          {item.total_items !== 1 ? 's' : ''} --- GH&#8373;{' '}
                          {item.total_amount?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        {statusBadge(
                          item.statusMessage ?? `Status ${item.status}`
                        )}
                        <ChevronRight className="h-4 w-4 text-dark-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default InvoiceDetailPage;
