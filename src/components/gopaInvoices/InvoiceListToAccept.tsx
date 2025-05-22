// src/components/gopaInvoices/InvoiceListToAccept.tsx
import React, { useEffect, useState } from 'react';

import { acceptInvoiceByGopa, getInvoicesForGopaToAccept } from '@/lib/gopaInvoiceApis';

const InvoiceListToAccept: React.FC = () => {
  const [invoices, setInvoices] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getInvoicesForGopaToAccept();
      setInvoices(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    await acceptInvoiceByGopa({ invoice_id: id });
    fetchList();
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <section className="pt-20"></section>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <section className="pt-20"></section>
      <h2 className="text-xl font-semibold mb-4">Invoices to Accept</h2>

      {invoices.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No invoices to accept.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Invoice ID</th>
              <th className="border px-2 py-1">Total Amount</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoice_id}>
                <td className="border px-2 py-1">{inv.invoice_id}</td>
                <td className="border px-2 py-1">{inv.total_amount}</td>
                <td className="border px-2 py-1">{inv.statusMessage}</td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => handleAccept(inv.invoice_id)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceListToAccept;
