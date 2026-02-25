// src/pages/seller/ActiveBidsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSellerBidsForActiveRequestsAPI } from '@/lib/orderBidsApis';
import BidList from '@/components/seller/BidList';
import Filters from '@/components/seller/Filters';
import BidHistoryPage from '@/pages/seller/BidHistoryPage';
import SpepasLoader from '@/components/common/SpepasLoader';
import { Gavel, AlertCircle } from 'lucide-react';

type Tab = 'new' | 'history';
type Filter = 'all' | 'have' | 'accepted';

const ActiveBidsPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [bids, setBids] = useState<any[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [tab, setTab] = useState<Tab>('new');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sellerId) return;
    if (tab === 'new') {
      setLoading(true);
      getSellerBidsForActiveRequestsAPI({ seller_id: sellerId })
        .then((res) => setBids(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [tab, sellerId]);

  if (!sellerId) {
    return (
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
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
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <Gavel className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark">Bids</h1>
            <p className="text-sm text-dark-4">
              View and respond to spare part requests
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab('new')}
            className={`font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200 ${
              tab === 'new'
                ? 'bg-blue text-white'
                : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
            }`}
          >
            New Requests
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200 ${
              tab === 'history'
                ? 'bg-blue text-white'
                : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
            }`}
          >
            Submitted Bids
          </button>
        </div>

        {tab === 'new' && (
          <>
            {/* Filters & count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <span className="text-sm font-medium text-dark-2">
                {loading
                  ? 'Loading requests...'
                  : `${bids.length} request${bids.length !== 1 ? 's' : ''}`}
              </span>
              <Filters filter={filter} onChange={setFilter} />
            </div>

            {/* Loading or bid list */}
            {loading ? (
              <SpepasLoader
                size="lg"
                label="Loading requests..."
                fullSection
              />
            ) : (
              <BidList bids={bids} filter={filter} loading={loading} />
            )}
          </>
        )}

        {tab === 'history' && <BidHistoryPage />}
      </div>
    </section>
  );
};

export default ActiveBidsPage;
