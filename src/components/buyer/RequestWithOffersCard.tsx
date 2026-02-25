import React from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowRight, Store } from 'lucide-react'

interface Props { req: any }

const RequestWithOffersCard: React.FC<Props> = ({ req }) => {
  const img = req.sparePart?.images?.[0]
  const name = req.sparePart?.name || 'Unknown Part'
  const bids = Array.isArray(req.bidings) ? req.bidings : []

  return (
    <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden hover:shadow-2 transition-shadow flex flex-col">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-1 flex items-center justify-center overflow-hidden">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-10 w-10 text-dark-5" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-dark truncate">{name}</h3>

        {/* Bids preview */}
        <div className="mt-3 space-y-1.5 flex-1">
          {bids.length > 0 ? (
            bids.slice(0, 3).map((b: any) => (
              <div key={b.bidding_ID} className="flex items-center justify-between text-xs">
                <span className="text-dark-3 flex items-center gap-1 truncate">
                  <Store className="h-3 w-3 flex-shrink-0" />
                  {b.seller?.storeName ?? 'Seller'}
                </span>
                <span className="font-semibold text-dark ml-2 flex-shrink-0">
                  GH&#x20B5; {b.price}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-dark-5">No bids yet</p>
          )}
          {bids.length > 3 && (
            <p className="text-xs text-dark-4">+{bids.length - 3} more</p>
          )}
        </div>

        {/* Action */}
        <div className="mt-3 pt-3 border-t border-gray-3">
          {bids.length > 0 ? (
            <Link
              to={`/95668339501103956045/buyer/requests/${req.request_ID}/offers`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue hover:text-blue-dark transition-colors"
            >
              View all offers
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span className="text-xs text-dark-5">Waiting for seller bids...</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestWithOffersCard
