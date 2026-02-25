// src/pages/seller/BidHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSellerBidsForRequestsHistoryAPI } from '@/lib/orderBidsApis';
import BidList from '@/components/seller/BidList';
import Filters from '@/components/seller/Filters';
import SpepasLoader from '@/components/common/SpepasLoader';
import { AlertCircle } from 'lucide-react';

type Filter = 'all' | 'have' | 'accepted';

const BidHistoryPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [bids, setBids] = useState<any[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    setLoading(true);
    getSellerBidsForRequestsHistoryAPI({ seller_id: sellerId })
      .then((res) => setBids(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sellerId]);

  if (!sellerId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <p className="text-sm font-medium text-dark-2">
            Seller ID missing in URL
          </p>
          <p className="text-xs text-dark-4 mt-1">
            Please check the link and try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filter & count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <span className="text-sm font-medium text-dark-2">
          {loading
            ? 'Loading bids...'
            : `${bids.length} bid${bids.length !== 1 ? 's' : ''} submitted`}
        </span>
        <Filters filter={filter} onChange={setFilter} />
      </div>

      {/* Content */}
      {loading ? (
        <SpepasLoader size="lg" label="Loading bids..." fullSection />
      ) : (
        <BidList
          bids={bids}
          filter={filter === 'accepted' ? 'accepted' : 'all'}
          loading={false}
        />
      )}
    </>
  );
};

export default BidHistoryPage;
