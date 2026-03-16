import React, { useEffect, useState } from 'react';

import SpepasLoader from '@/components/common/SpepasLoader';
import { getBidsForBuyerRequestAll } from '@/lib/orderBidsApis';

import RequestWithOffersCard from './RequestWithOffersCard';

const RequestsWithOffersList: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBidsForBuyerRequestAll()
      .then((res) => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SpepasLoader size="lg" label="Loading requests..." />;
  }

  if (!requests.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No requests yet. Post a request to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((r) => (
        <RequestWithOffersCard key={r.request_ID} req={r} />
      ))}
    </div>
  );
};

export default RequestsWithOffersList;
