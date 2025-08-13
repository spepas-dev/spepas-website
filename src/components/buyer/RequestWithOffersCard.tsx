// src/components/buyer/RequestWithOffersCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'

interface Props { req: any }

const RequestWithOffersCard: React.FC<Props> = ({ req }) => {
  const img = req.sparePart.images?.[0]
  const bids = Array.isArray(req.bidings) ? req.bidings : []

  return (
    <div className="bg-white p-4 shadow rounded mb-4">
      <div className="flex items-center mb-3">
        {img && (
          <img
            src={img}
            className="w-16 h-16 mr-4 rounded"
            alt={req.sparePart.name}
          />
        )}
        <div>
          <h3 className="font-semibold">{req.sparePart.name}</h3>
          <p className="text-sm text-gray-600">
            {req.sparePart.description}
          </p>
        </div>
      </div>

      <ul className="mb-3 space-y-2">
        {bids.length > 0 ? (
          bids.map((b: any) => (
            <li key={b.bidding_ID} className="flex justify-between">
              <span className="text-sm">
                {b.seller?.storeName ?? 'Unknown Seller'}
              </span>
              <span className="text-sm font-medium">GH₵{b.price}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm">
            No bids yet.
          </li>
        )}
      </ul>

      {bids.length > 0 ? (
        <Link
          to={`/95668339501103956045/buyer/requests/${req.request_ID}/offers`}
          className="inline-block bg-indigo-500 text-white px-3 py-1 rounded"
        >
          View all offers
        </Link>
      ) : (
        <button
          disabled
          className="inline-block bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-not-allowed"
        >
          No offers
        </button>
      )}
    </div>
  )
}

export default RequestWithOffersCard
