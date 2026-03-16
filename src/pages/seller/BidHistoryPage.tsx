// src/pages/seller/BidHistoryPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSellerBidsForRequestsHistoryAPI } from '@/lib/orderBidsApis'
import BidList from '@/components/seller/BidList'
import Filters from '@/components/seller/Filters'

type Filter = 'all' | 'have' | 'accepted'

const BidHistoryPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>()
  const [bids, setBids] = useState<any[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sellerId) return
    setLoading(true)
    getSellerBidsForRequestsHistoryAPI({ seller_id: sellerId })
      .then(res => setBids(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [sellerId])

  if (!sellerId) {
    return (
      <div className="text-center text-red-600 mt-12 px-4">
        Seller ID missing in URL
      </div>
    )
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <span className="font-semibold text-base">
          {loading
            ? 'Loading bids…'
            : `${bids.length} bid${bids.length !== 1 ? 's' : ''} submitted`}
        </span>
        <Filters filter={filter} onChange={setFilter} />
      </div>

      {/* Spinner */}
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
        <BidList
          bids={bids}
          filter={filter === 'accepted' ? 'accepted' : 'all'}
          loading={false}
        />
      )}
    </div>
  )
}

export default BidHistoryPage
