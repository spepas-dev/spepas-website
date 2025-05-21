// src/components/buyer/OfferCard.tsx
import React from 'react'
import { toast } from 'react-hot-toast'

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
  const imgUrl = seller.business_reg_url ?? ''
  const sellerName = seller.storeName ?? 'Unknown Seller'
  const price = offer.totalPrice ?? offer.price ?? 0

  const handleAdd = () => {
    const id = toast.loading('Adding to cart…', { position: 'bottom-center' })
    onAdd(offer.bidding_ID)
    toast.success('Added to cart!', { id, position: 'bottom-center' })
  }

  const handleRemove = () => {
    const id = toast.loading('Removing from cart…', { position: 'bottom-center' })
    onRemove(offer.bidding_ID)
    toast.success('Removed from cart!', { id, position: 'bottom-center' })
  }

  return (
    <div
      className="
        bg-white
        rounded-lg
        shadow
        overflow-hidden
        flex flex-col
        sm:flex-row
        items-center
        p-4
        mb-4
      "
    >
      {imgUrl && (
        <img
          src={imgUrl}
          alt={sellerName}
          className="
            w-full h-40
            sm:w-16 sm:h-16
            object-cover
            rounded-md
            mb-4 sm:mb-0 sm:mr-4
          "
        />
      )}

      <div className="flex-grow text-center sm:text-left space-y-1">
        <p className="text-base sm:text-sm font-semibold text-gray-800">
          {sellerName}
        </p>
        <p className="text-sm sm:text-xs text-gray-600">GH₵ {price}</p>
      </div>

      <div className="mt-4 sm:mt-0 sm:ml-4">
        {inCart ? (
          <button
            onClick={handleRemove}
            className="
              w-full
              sm:w-auto
              bg-red-500 hover:bg-red-600
              text-white
              text-sm
              font-medium
              py-2 px-4
              rounded-md
              transition
            "
          >
            Remove
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="
              w-full
              sm:w-auto
              bg-green-600 hover:bg-green-700
              text-white
              text-sm
              font-medium
              py-2 px-4
              rounded-md
              transition
            "
          >
            Add
          </button>
        )}
      </div>
    </div>
  )
}

export default OfferCard
