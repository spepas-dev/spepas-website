// src/components/gopaInvoices/GopaAcceptedInvoiceDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGopaAcceptedInvoiceDetails } from '@/lib/gopaInvoiceApis';
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  FileText,
  AlertCircle,
  ShoppingBag,
  ChevronRight,
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

const GopaAcceptedInvoiceDetails: React.FC = () => {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!invoice_id) return;
    (async () => {
      try {
        const res = await getGopaAcceptedInvoiceDetails(invoice_id);
        setInvoice(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [invoice_id]);

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
              View accepted invoice summary and items
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <SpepasLoader
            size="lg"
            label="Loading invoice details..."
            fullSection
          />
        )}

        {/* Error */}
        {error && (
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

        {!loading && !error && !invoice && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-12 flex flex-col items-center gap-3">
            <AlertCircle className="h-10 w-10 text-dark-4" />
            <p className="text-sm font-medium text-dark">No data found.</p>
          </div>
        )}

        {invoice && (
          <div className="space-y-6">
            {/* Invoice Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-dark">Invoice</h2>
                  <p className="text-xs font-mono text-dark-4 mt-1">
                    {invoice.invoice_id}
                  </p>
                </div>
                {statusBadge(invoice.statusMessage)}
              </div>

              {/* Financial Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                  <p className="text-xs text-dark-4">Total Amount</p>
                  <p className="font-bold text-lg text-dark mt-1">
                    GH&#8373;{' '}
                    {invoice.total_amount?.toFixed(2) ?? invoice.total_amount}
                  </p>
                </div>
                {invoice.total_items !== undefined && (
                  <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                    <p className="text-xs text-dark-4">Total Items</p>
                    <p className="font-bold text-lg text-dark mt-1">
                      {invoice.total_items}
                    </p>
                  </div>
                )}
                {invoice.createdAt && (
                  <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
                    <p className="text-xs text-dark-4">Created</p>
                    <p className="font-semibold text-sm text-dark mt-1">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Items Card */}
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
                    <Link
                      key={item.item_id}
                      to={`/gopa-invoices/accepted-invoices/${invoice.invoice_id}/items/${item.item_id}`}
                      className="flex items-center justify-between bg-gray-1 rounded-xl border border-gray-3 p-4 hover:border-blue transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-dark-4 font-mono truncate">
                          {item.item_id}
                        </p>
                        <p className="font-medium text-dark mt-1">
                          GH&#8373;{' '}
                          {item.total_amount?.toFixed(2) ?? item.total_amount}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        {statusBadge(item.statusMessage)}
                        <ChevronRight className="h-4 w-4 text-dark-4" />
                      </div>
                    </Link>
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

export default GopaAcceptedInvoiceDetails;
