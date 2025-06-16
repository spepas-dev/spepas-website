// src/components/seller/BidList.tsx
import React from 'react';

import BidCard from './BidCard';

interface BidListProps {
  bids: unknown[];
  filter: 'all' | 'have' | 'accepted';
  loading?: boolean;
}

const BidList: React.FC<BidListProps> = ({ bids, filter, loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  const filtered = bids.filter((b) => {
    if (filter === 'have') {
      return b.iHaveItem;
    }
    if (filter === 'accepted') {
      return b.status === 'accepted';
    }
    return true;
  });

  if (!filtered.length) {
    return <p className="text-center text-gray-500 py-10">No bids to show.</p>;
  }

  return (
    <div className="space-y-4">
      <section className="pt-20"></section>
      <div>hi</div>
      {filtered.map((b) => (
        <BidCard key={b.id} bid={b} />
      ))}
    </div>
  );
};

export default BidList;
