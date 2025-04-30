// src/pages/seller/BidHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSellerBidsForRequestsHistoryAPI } from '@/lib/orderBidsApis';
import BidList from '@/components/seller/BidList';
import Filters from '@/components/seller/Filters';

type Filter = 'all' | 'have' | 'accepted';

const BidHistoryPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [bids, setBids]     = useState<any[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (!sellerId) return;
    getSellerBidsForRequestsHistoryAPI({ seller_id: sellerId })
      .then(res => setBids(res.data))
      .catch(console.error);
  }, [sellerId]);

  if (!sellerId) return <div>Seller ID missing in URL</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">
          {bids.length} bid{bids.length !== 1 && 's'} submitted
        </span>
        <Filters filter={filter} onChange={setFilter} />
      </div>
      <BidList bids={bids} filter={filter === 'accepted' ? 'accepted' : 'all'} />
    </>
  );
};

export default BidHistoryPage;
