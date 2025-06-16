// src/components/gopaInvoices/GopaAcceptedInvoiceDetails.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getGopaAcceptedInvoiceDetails } from '@/lib/gopaInvoiceApis';

const GopaAcceptedInvoiceDetails: React.FC = () => {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const [invoice, setInvoice] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoice_id) {
      return;
    }
    (async () => {
      const res = await getGopaAcceptedInvoiceDetails(invoice_id);
      setInvoice(res.data);
      setLoading(false);
    })();
  }, [invoice_id]);

  if (loading) {
    return <p>Loading…</p>;
  }
  if (!invoice) {
    return <p>No data.</p>;
  }

  return (
    <div className="p-6">
      <section className="pt-20"></section>
      <h2 className="text-xl font-semibold mb-4">Invoice {invoice.invoice_id}</h2>
      <p>Total Amount: GH₵ {invoice.total_amount}</p>
      <p>Status: {invoice.statusMessage}</p>
      <h3 className="mt-4 font-medium">Items</h3>
      <ul>
        {invoice.items.map((item: unknown) => (
          <li key={item.item_id}>
            <Link
              to={`/gopa-invoices/accepted-invoices/${invoice.invoice_id}/items/${item.item_id}`}
              className="text-blue-600 hover:underline"
            >
              {item.item_id} — GH₵ {item.total_amount}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GopaAcceptedInvoiceDetails;
