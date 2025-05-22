import React, { useCallback, useEffect, useState } from 'react';

import { getBuyerActiveRequestsAll, getBuyerRequestHistoryAll } from '@/lib/orderBidsApis';

import RequestCard from './RequestCard';
import RequestWithOffersCard from './RequestWithOffersCard';

interface RequestListProps {
  mode: 'active' | 'history';
}

const RequestList: React.FC<RequestListProps> = ({ mode }) => {
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(false);

    const fn = mode === 'active' ? getBuyerActiveRequestsAll : getBuyerRequestHistoryAll;

    fn()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mode]);

  // re-run whenever mode changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const CardComponent = mode === 'active' ? RequestWithOffersCard : RequestCard;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <svg className="w-8 h-8 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-600">Something went wrong loading requests.</p>
        <button onClick={fetchData} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    );
  }

  if (!data.length) {
    return <p className="text-center text-gray-500 py-10">No {mode === 'active' ? 'active' : 'historical'} requests.</p>;
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-0">
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4 sm:gap-6 lg:gap-8
        "
      >
        {data.map((req) => (
          <CardComponent key={req.request_ID} req={req} />
        ))}
      </div>
    </div>
  );
};

export default RequestList;
