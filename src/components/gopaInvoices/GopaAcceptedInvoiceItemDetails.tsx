// src/components/gopaInvoices/GopaAcceptedInvoiceItemDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGopaAcceptedInvoiceItemDetails } from '@/lib/gopaInvoiceApis';

const GopaAcceptedInvoiceItemDetails: React.FC = () => {
  const { item_id } = useParams<{ item_id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item_id) return;
    (async () => {
      const res = await getGopaAcceptedInvoiceItemDetails(item_id);
      setItem(res.data);
      setLoading(false);
    })();
  }, [item_id]);

  if (loading) return <p>Loading…</p>;
  if (!item) return <p>No data.</p>;

  return (
    <div className="p-6">
         <section className="pt-20"></section>
      <h2 className="text-xl font-semibold mb-4">Item {item.item_id}</h2>
      <p>Quantity: {item.total_items}</p>
      <p>Amount: GH₵ {item.total_amount}</p>
      <p>Status: {item.statusMessage}</p>
      {/* add more fields as needed */}
    </div>
  );
};

export default GopaAcceptedInvoiceItemDetails;
