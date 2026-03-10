// src/components/seller/BidList.tsx
import React from 'react';
import BidCard from './BidCard';
import SpepasLoader from '@/components/common/SpepasLoader';
import { PackageOpen } from 'lucide-react';

interface BidListProps {
  bids: any[];
  filter: 'all' | 'have' | 'accepted';
  loading?: boolean;
}

const BidList: React.FC<BidListProps> = ({ bids, filter, loading = false }) => {
  if (loading) {
    return <SpepasLoader size="lg" label="Loading bids..." fullSection />;
  }

  const filtered = bids.filter((b) => {
    if (filter === 'have') return b.iHaveItem;
    if (filter === 'accepted') return b.status === 'accepted';
    return true;
  });

  if (!filtered.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="h-14 w-14 rounded-2xl bg-gray-1 flex items-center justify-center mb-4">
            <PackageOpen className="h-7 w-7 text-dark-4" />
          </div>
          <p className="text-sm font-medium text-dark-2">No bids to show</p>
          <p className="text-xs text-dark-4 mt-1">
            Check back later for new requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((b) => (
        <BidCard key={b.id} bid={b} />
      ))}
    </div>
  );
};

export default BidList;
