// src/pages/seller/ActiveBidsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSellerBidsForActiveRequestsAPI } from '@/lib/orderBidsApis';
import BidList from '@/components/seller/BidList';
import Filters from '@/components/seller/Filters';
import BidHistoryPage from '@/pages/seller/BidHistoryPage';

type Tab = 'new' | 'history';
type Filter = 'all' | 'have' | 'accepted';

const ActiveBidsPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [bids, setBids]     = useState<any[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [tab, setTab]       = useState<Tab>('new');

  useEffect(() => {
    if (!sellerId) return;
    if (tab === 'new') {
      getSellerBidsForActiveRequestsAPI({ seller_id: sellerId })
        .then(res => setBids(res.data))
        .catch(console.error);
    }
  }, [tab, sellerId]);

  if (!sellerId) return <div>Seller ID missing in URL</div>;

  return (
    <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8 mx-auto pt-20">
    <section className="pt-6"></section>
  
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <h1 className="text-xl sm:text-2xl font-bold">Bids</h1>
      <div className="flex gap-4 border-b border-gray-200">
        <button
          className={`pb-1 border-b-2 transition ${tab === 'new' ? 'border-indigo-600 font-medium' : 'border-transparent'}`}
          onClick={() => setTab('new')}
        >
          New requests
        </button>
        <button
          className={`pb-1 border-b-2 transition ${tab === 'history' ? 'border-indigo-600 font-medium' : 'border-transparent'}`}
          onClick={() => setTab('history')}
        >
          Submitted bids
        </button>
      </div>
    </header>
  
    {tab === 'new' && (
      <>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <span className="font-semibold text-sm sm:text-base">
            {bids.length} request{bids.length !== 1 && 's'}
          </span>
          <Filters filter={filter} onChange={setFilter} />
        </div>
        <BidList bids={bids} filter={filter === 'have' ? 'have' : 'all'} />
      </>
    )}
  
    {tab === 'history' && <BidHistoryPage />}
  </div>
  
  );
};

export default ActiveBidsPage;
