// src/components/gopaInvoices/AcceptInvoice.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptInvoiceByGopa } from '@/lib/gopaInvoiceApis';
import { FileCheck, Loader2 } from 'lucide-react';

const AcceptInvoice: React.FC = () => {
  const [invoiceId, setInvoiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await acceptInvoiceByGopa({ invoice_id: invoiceId });
      navigate('/gopa-invoices/accepted-invoices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <FileCheck className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">Accept Invoice</h1>
            <p className="text-sm text-dark-4">
              Enter an invoice ID to accept it
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6"
        >
          <label className="block mb-5">
            <span className="text-sm font-medium text-dark">Invoice ID</span>
            <input
              type="text"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              required
              placeholder="Enter invoice ID"
              className="w-full mt-2 rounded-lg border border-gray-3 bg-gray-1 px-4 py-2.5 text-sm text-dark placeholder:text-dark-4 focus:border-blue focus:ring-1 focus:ring-blue outline-none transition"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !invoiceId.trim()}
            className="w-full flex items-center justify-center gap-2 bg-blue text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-dark transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Accept Invoice'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AcceptInvoice;
