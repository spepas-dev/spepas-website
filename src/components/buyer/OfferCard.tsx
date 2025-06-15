// src/components/buyer/OfferCard.tsx
import React from 'react';
import { toast } from 'react-hot-toast';

interface OfferCardProps {
  offer: unknown;
  inCart: boolean;
  onAdd: (biddingId: string) => void;
  onRemove: (biddingId: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, inCart, onAdd, onRemove }) => {
  const seller = offer.seller ?? {};
  const imgUrl = seller.business_reg_url ?? '';
  const sellerName = seller.storeName ?? 'Unknown Seller';
  const price = offer.totalPrice ?? offer.price ?? 0;

  const handleAdd = () => {
    const id = toast.loading('Adding to cart…', { position: 'bottom-center' });
    onAdd(offer.bidding_ID);
    toast.success('Added to cart!', { id, position: 'bottom-center' });
  };

  const handleRemove = () => {
    const id = toast.loading('Removing from cart…', { position: 'bottom-center' });
    onRemove(offer.bidding_ID);
    toast.success('Removed from cart!', { id, position: 'bottom-center' });
  };

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
      {/* Image container: always fixed size so images align */}
      <div
        className="
          w-full h-40
          sm:w-16 sm:h-16
          flex-shrink-0
          rounded-md
          overflow-hidden
          bg-gray-100
          flex items-center justify-center
          mb-4 sm:mb-0 sm:mr-4
        "
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={sellerName}
            className="
              w-full h-full
              object-cover
            "
          />
        ) : (
          /* Simple SVG placeholder when no image URL */
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2 4-4" />
          </svg>
        )}
      </div>

      {/* Seller info */}
      <div className="flex-grow text-center sm:text-left space-y-1">
        <p className="text-base sm:text-sm font-semibold text-gray-800">{sellerName}</p>
        <p className="text-sm sm:text-xs text-gray-600">GH₵ {price}</p>
      </div>

      {/* Add/Remove button */}
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
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
