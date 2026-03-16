// src/components/buyer/CartItem.tsx
import React from 'react';

interface CartItemProps {
  item: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onRemove: (cartId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const bidding = item.bid;
  const img = bidding.images?.[0]?.image_url;
  const partName = bidding.sparePart?.name || 'Spare Part';
  const sellerName = bidding.seller?.storeName;
  const unitPrice = bidding.unitPrice;
  const totalPrice = bidding.totalPrice || 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
      {/* Image */}
      <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
        {img ? (
          <img src={img} alt={partName} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z"
            />
          </svg>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{partName}</h3>
        {sellerName && <p className="text-xs text-gray-500">Seller: {sellerName}</p>}
        <div className="flex items-baseline gap-3 pt-1">
          {unitPrice != null && <span className="text-xs text-gray-400">Unit: GH₵ {unitPrice}</span>}
          <span className="text-base font-bold text-gray-900">GH₵ {totalPrice}</span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.cart_ID)}
        className="inline-flex items-center gap-1.5 text-sm font-medium py-2 px-4 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
        Remove
      </button>
    </div>
  );
};

export default CartItem;
