// src/pages/seller/ActiveBidsPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSellerBidsForActiveRequestsAPI } from '@/lib/orderBidsApis'
import BidList from '@/components/seller/BidList'
import Filters from '@/components/seller/Filters'
import BidHistoryPage from '@/pages/seller/BidHistoryPage'

type Tab = 'new' | 'history'
type Filter = 'all' | 'have' | 'accepted'

const ActiveBidsPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>()
  const [bids, setBids] = useState<any[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [tab, setTab] = useState<Tab>('new')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sellerId) return
    if (tab === 'new') {
      setLoading(true)
      getSellerBidsForActiveRequestsAPI({ seller_id: sellerId })
        .then(res => setBids(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [tab, sellerId])

  if (!sellerId) {
    return (
      <div className="text-center text-red-600 mt-12 px-4">
        Seller ID missing in URL
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-25">
      {/* Tab Navigation */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">Bids</h1>
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setTab('new')}
            className={`pb-1 border-b-2 transition ${
              tab === 'new'
                ? 'border-indigo-600 text-indigo-600 font-medium'
                : 'border-transparent text-gray-600'
            }`}
          >
            New Requests
          </button>
          <button
            onClick={() => setTab('history')}
            className={`pb-1 border-b-2 transition ${
              tab === 'history'
                ? 'border-indigo-600 text-indigo-600 font-medium'
                : 'border-transparent text-gray-600'
            }`}
          >
            Submitted Bids
          </button>
        </div>
      </header>

      {tab === 'new' && (
        <>
          {/* Filters & Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <span className="font-semibold text-base">
              {loading
                ? 'Loading requests…'
                : `${bids.length} request${bids.length !== 1 ? 's' : ''}`}
            </span>
            <Filters filter={filter} onChange={setFilter} />
          </div>

          {/* Loading Spinner or BidList */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <svg
                className="animate-spin h-12 w-12 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          ) : (
            <BidList bids={bids} filter={filter} loading={loading} />
          )}
        </>
      )}

      {tab === 'history' && <BidHistoryPage />}
    </div>
  )
}

export default ActiveBidsPage
