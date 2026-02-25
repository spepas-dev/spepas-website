// src/components/gopaInvoices/GopaAcceptedInvoices.tsx
import React, { useEffect, useState } from 'react';
import { getGopaAcceptedInvoices } from '@/lib/gopaInvoiceApis';
import { useNavigate } from 'react-router-dom';
import SpepasLoader from '@/components/common/SpepasLoader';
import { FileCheck, Inbox, ChevronRight } from 'lucide-react';

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

const GopaAcceptedInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await getGopaAcceptedInvoices();
      setInvoices(res.data);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <FileCheck className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">Accepted Invoices</h1>
            <p className="text-sm text-dark-4">
              View invoices you have accepted
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <SpepasLoader size="lg" label="Loading invoices..." fullSection />
        )}

        {/* Empty State */}
        {!loading && invoices.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-12 flex flex-col items-center gap-3">
            <Inbox className="h-10 w-10 text-dark-4" />
            <p className="text-sm font-medium text-dark">
              No accepted invoices yet.
            </p>
            <p className="text-xs text-dark-4">
              Invoices you accept will appear here.
            </p>
          </div>
        )}

        {/* Invoice Cards */}
        {!loading && invoices.length > 0 && (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.invoice_id}
                onClick={() =>
                  navigate(
                    `/gopa-invoices/accepted-invoices/${inv.invoice_id}`
                  )
                }
                className="bg-white rounded-2xl border border-gray-3 shadow-1 p-4 sm:p-5 cursor-pointer hover:border-blue transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-dark-4 font-mono truncate">
                      {inv.invoice_id}
                    </p>
                    <p className="font-bold text-lg text-dark mt-1">
                      GH&#8373; {inv.total_amount?.toFixed(2) ?? inv.total_amount}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {statusBadge(inv.statusMessage)}
                    <ChevronRight className="h-4 w-4 text-dark-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GopaAcceptedInvoices;
