// src/components/seller/BidList.tsx
import React from 'react';
import BidCard from './BidCard';
import SpepasLoader from '@/components/common/SpepasLoader';

interface BidListProps {
  bids: any[];
  filter: 'all'|'have'|'accepted';
  loading?: boolean;
}

const BidList: React.FC<BidListProps> = ({
  bids,
  filter,
  loading = false,
}) => {
  
  if (loading) {
    return <SpepasLoader />;
  }

  
  const filtered = bids.filter(b => {
    if (filter === 'have') return b.iHaveItem
    if (filter === 'accepted') return b.status === 'accepted'
    return true
  })

  
  if (!filtered.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No bids to show.
      </p>
    )
  }

  return (
    
    <div className="space-y-4">
        <section className="pt-28"></section>
        <div>hi</div>
      {filtered.map(b => <BidCard key={b.id} bid={b} />)}
    </div>
  );
};

export default BidList;
