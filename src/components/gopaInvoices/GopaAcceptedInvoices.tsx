// src/components/gopaInvoices/GopaAcceptedInvoices.tsx
import React, { useEffect, useState } from 'react';
import { getGopaAcceptedInvoices } from '@/lib/gopaInvoiceApis';
import { useNavigate } from 'react-router-dom';

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

  if (loading) {
    return (
      <div className="p-6">
        <section className="pt-20"></section>
        <p>Loading…</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="p-6">
        <section className="pt-20"></section>
        <p className="text-center py-8 text-gray-500">No accepted invoices found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <section className="pt-20"></section>
      <h2 className="text-xl font-semibold mb-4">Accepted Invoices</h2>
      <ul>
        {invoices.map(inv => (
          <li key={inv.invoice_id} className="mb-2">
            <button
              onClick={() => navigate(`/gopa-invoices/accepted-invoices/${inv.invoice_id}`)}
              className="text-blue-600 hover:underline"
            >
              {inv.invoice_id} — GH₵ {inv.total_amount}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GopaAcceptedInvoices;
