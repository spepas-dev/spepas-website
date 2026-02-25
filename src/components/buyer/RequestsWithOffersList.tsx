import React, { useEffect, useState } from 'react'
import { getBidsForBuyerRequestAll } from '@/lib/orderBidsApis'
import RequestWithOffersCard from './RequestWithOffersCard'
import SpepasLoader from '@/components/common/SpepasLoader'
import { PackageOpen } from 'lucide-react'

const RequestsWithOffersList: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBidsForBuyerRequestAll()
      .then(res => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <SpepasLoader size="lg" label="Loading requests..." fullSection />

  if (!requests.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-14 w-14 rounded-full bg-gray-1 flex items-center justify-center mb-4">
            <PackageOpen className="h-6 w-6 text-dark-4" />
          </div>
          <p className="text-sm font-medium text-dark-2">No requests yet</p>
          <p className="text-xs text-dark-4 mt-1">Your requests with offers will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {requests.map(r => (
        <RequestWithOffersCard key={r.request_ID} req={r} />
      ))}
    </div>
  )
}

export default RequestsWithOffersList
