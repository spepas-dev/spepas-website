import React, { useEffect, useState } from 'react';

import { getBidsForBuyerRequestAll } from '@/lib/orderBidsApis';

import RequestWithOffersCard from './RequestWithOffersCard';

const RequestsWithOffersList: React.FC = () => {
  const [requests, setRequests] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBidsForBuyerRequestAll()
      .then((res) => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading your requests…</p>;
  }
  if (!requests.length) {
    return <p>No requests yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((r) => (
        <RequestWithOffersCard key={r.request_ID} req={r} />
      ))}
    </div>
  );
};

export default RequestsWithOffersList;
