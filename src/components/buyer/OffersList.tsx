// src/components/buyer/OffersList.tsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getRequestBidsAllAPI,
  addBidToCartAPI,
  removeBidFromCartAPI,
} from '@/lib/orderBidsApis'
import OfferCard from './OfferCard'
// import Lottie from 'lottie-react'
// import loadingAnimation from '@/assets/lottie/loading-spinner.json'

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
      <p className="text-center text-red-500 mt-10 px-4">
        No request selected.
      </p>
    )
  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
      {/* Simple spinner */}
      <svg
        className="w-8 h-8 animate-spin text-indigo-600"
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
    )
  if (!offers.length)
    return (
      <p className="text-center text-gray-500 mt-10 px-4">
        No offers yet.
      </p>
    )

  // Request details from first offer
  const { orderRequest } = offers[0]
  const { sparePart, quantity, createdAt } = orderRequest
  const img = sparePart.images?.[0]

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 pb-8">OFFERS</h1>
      {/* ── Request Details ── */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow mx-auto max-w-3xl p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-4">
          Request Details
        </h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          {img && (
            <img
              src={img}
              alt={sparePart.name}
              className="w-full h-48 sm:w-24 sm:h-24 object-cover rounded mb-4 sm:mb-0 sm:mr-6"
            />
          )}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              {sparePart.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {sparePart.description}
            </p>
            <p className="text-sm">
              Quantity requested:{' '}
              <strong className="text-gray-800">{quantity}</strong>
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Requested on:{' '}
              {new Date(createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Offers Grid ── */}
      <div
        className="
          grid
          grid-cols-1        /* mobile: 1 col */
          sm:grid-cols-1     /* small tablet: still 1 */
          md:grid-cols-2     /* landscape tablet / small laptop */
          lg:grid-cols-3     /* desktop */
          gap-6
          justify-items-center
        "
      >
        {offers.map(o => (
          <div key={o.bidding_ID} className="w-full max-w-sm">
            <OfferCard
              offer={o}
              inCart={!!cartMap[o.bidding_ID]}
              onAdd={handleAdd}
              onRemove={handleRemove}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default OffersList
