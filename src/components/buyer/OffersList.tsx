import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getRequestBidsAllAPI,
  addBidToCartAPI,
  removeBidFromCartAPI,
} from '@/lib/orderBidsApis'
import OfferCard from './OfferCard'
import SpepasLoader from '@/components/common/SpepasLoader'
import { AlertCircle, Package, CalendarDays, Hash, PackageOpen } from 'lucide-react'

const OffersList: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>()
  const [offers, setOffers] = useState<any[]>([])
  const [cartMap, setCartMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!requestId) return
    setLoading(true)
    getRequestBidsAllAPI({ request_id: requestId })
      .then(res => setOffers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [requestId])

  const handleAdd = (biddingId: string) =>
    addBidToCartAPI({ bidding_ID: biddingId })
      .then(res => {
        const cartId = res.data?.cart_ID
        if (cartId) setCartMap(p => ({ ...p, [biddingId]: cartId }))
      })
      .catch(console.error)

  const handleRemove = (biddingId: string) => {
    const cartId = cartMap[biddingId]
    if (!cartId) return
    removeBidFromCartAPI({ cart_ID: cartId })
      .then(() =>
        setCartMap(p => {
          const copy = { ...p }
          delete copy[biddingId]
          return copy
        })
      )
      .catch(console.error)
  }

  if (!requestId)
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm font-medium text-dark-2">No request selected</p>
        </div>
      </div>
    )

  if (loading)
    return <SpepasLoader size="lg" label="Loading offers..." fullSection />

  if (!offers.length)
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-14 w-14 rounded-full bg-gray-1 flex items-center justify-center mb-4">
            <PackageOpen className="h-6 w-6 text-dark-4" />
          </div>
          <p className="text-sm font-medium text-dark-2">No offers yet</p>
          <p className="text-xs text-dark-4 mt-1">Sellers haven't responded to this request yet</p>
        </div>
      </div>
    )

  // Request details from first offer
  const { orderRequest } = offers[0]
  const { sparePart, quantity, createdAt } = orderRequest
  const img = sparePart?.images?.[0]

  return (
    <div className="space-y-6">
      {/* Request Details Card */}
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-3">
          <h3 className="text-base font-semibold text-dark">Request Details</h3>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            {img && (
              <div className="flex-shrink-0 h-24 w-24 rounded-xl bg-gray-1 border border-gray-3 overflow-hidden">
                <img src={img} alt={sparePart.name} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-dark">{sparePart.name}</h4>
              {sparePart.description && (
                <p className="text-sm text-dark-3 mt-1 line-clamp-2">{sparePart.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-dark-4">
                  <Hash className="h-3 w-3" />
                  Qty: <span className="font-medium text-dark">{quantity}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-dark-4">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers count */}
      <p className="text-sm text-dark-4 font-medium">
        {offers.length} offer{offers.length !== 1 ? 's' : ''} available
      </p>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {offers.map(o => (
          <OfferCard
            key={o.bidding_ID}
            offer={o}
            inCart={!!cartMap[o.bidding_ID]}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  )
}

export default OffersList
