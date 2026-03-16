// src/components/buyer/OfferCard.tsx
import React from 'react';
import { toast } from 'react-hot-toast';

interface OfferCardProps {
  offer: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
    const id = toast.loading('Adding to cart...', { position: 'bottom-center' });
    onAdd(offer.bidding_ID);
    toast.success('Added to cart!', { id, position: 'bottom-center' });
  };

  const handleRemove = () => {
    const id = toast.loading('Removing from cart...', { position: 'bottom-center' });
    onRemove(offer.bidding_ID);
    toast.success('Removed from cart!', { id, position: 'bottom-center' });
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md ${
        inCart ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'
      }`}
    >
      {/* Seller image / placeholder */}
      <div className="h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
        {imgUrl ? (
          <img src={imgUrl} alt={sellerName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-sm font-semibold text-gray-900 mb-1">{sellerName}</p>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-xs text-gray-400">Price:</span>
          <span className="text-lg font-bold text-gray-900">GH₵ {price}</span>
        </div>

        {/* In cart indicator */}
        {inCart && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs text-green-600 font-medium">In your cart</span>
          </div>
        )}

        {/* Action button */}
        <div className="mt-auto">
          {inCart ? (
            <button
              onClick={handleRemove}
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove from Cart
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 rounded-xl shadow-sm hover:opacity-90 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
