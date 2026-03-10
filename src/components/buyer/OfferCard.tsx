import React from 'react'
import { toast } from 'react-hot-toast'
import { Store, ShoppingCart, X, Package } from 'lucide-react'

interface OfferCardProps {
  offer: any
  inCart: boolean
  onAdd: (biddingId: string) => void
  onRemove: (biddingId: string) => void
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  inCart,
  onAdd,
  onRemove,
}) => {
  const seller = offer.seller ?? {}
  const imgUrl = offer.images?.[0]?.image_url ?? seller.business_reg_url ?? ''
  const sellerName = seller.storeName ?? 'Unknown Seller'
  const totalPrice = offer.totalPrice ?? offer.price ?? 0
  const unitPrice = offer.unitPrice ?? 0
  const quantity = offer.quantity ?? ''

  const handleAdd = () => {
    const id = toast.loading('Adding to cart...', { position: 'bottom-center' })
    onAdd(offer.bidding_ID)
    toast.success('Added to cart!', { id, position: 'bottom-center' })
  }

  const handleRemove = () => {
    const id = toast.loading('Removing from cart...', { position: 'bottom-center' })
    onRemove(offer.bidding_ID)
    toast.success('Removed from cart!', { id, position: 'bottom-center' })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden hover:shadow-2 transition-shadow flex flex-col">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-1 flex items-center justify-center overflow-hidden">
        {imgUrl ? (
          <img src={imgUrl} alt={sellerName} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-10 w-10 text-dark-5" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-blue-light-5 flex items-center justify-center flex-shrink-0">
            <Store className="h-3.5 w-3.5 text-blue" />
          </div>
          <p className="text-sm font-semibold text-dark truncate">{sellerName}</p>
        </div>

        <div className="space-y-1 flex-1">
          <p className="text-lg font-bold text-dark">
            GH&#x20B5; {Number(totalPrice).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
          </p>
          {unitPrice > 0 && (
            <p className="text-xs text-dark-4">
              Unit price: GH&#x20B5; {Number(unitPrice).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
            </p>
          )}
          {quantity && (
            <p className="text-xs text-dark-4">Qty: {quantity}</p>
          )}
        </div>

        {/* Action */}
        <div className="mt-3 pt-3 border-t border-gray-3">
          {inCart ? (
            <button
              onClick={handleRemove}
              className="w-full inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 font-medium text-sm py-2.5 px-5 rounded-xl border border-red-200 hover:bg-red-100 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
              Remove from Cart
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OfferCard
