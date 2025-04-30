// src/components/seller/BidList.tsx
import React from 'react';
import BidCard from './BidCard';

interface BidListProps {
  bids: any[];
  filter: 'all'|'have'|'accepted';
}

const BidList: React.FC<BidListProps> = ({ bids, filter }) => {
  const filtered = bids.filter(b => {
    if (filter === 'have')    return b.iHaveItem;
    if (filter === 'accepted')return b.status === 'accepted';
    return true;
  });

  if (!filtered.length) {
    return <p>No bids to show.</p>;
  }

  return (
    
    <div className="space-y-4">
        <section className="pt-20"></section>
        <div>hi</div>
      {filtered.map(b => <BidCard key={b.id} bid={b} />)}
    </div>
  );
};

export default BidList;
