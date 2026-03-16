// src/components/gopaInvoices/AcceptInvoice.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { acceptInvoiceByGopa } from '@/lib/gopaInvoiceApis';

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
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Accept Invoice</h2>
      <label className="block mb-2">
        Invoice ID
        <input
          type="text"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </label>
      <button type="submit" disabled={loading} className="mt-4 bg-dark text-white py-2 px-4 rounded">
        {loading ? 'Processing…' : 'Accept'}
      </button>
    </form>
  );
};

export default AcceptInvoice;
