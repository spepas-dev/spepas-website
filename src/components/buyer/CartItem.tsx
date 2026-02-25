import React from 'react';
import { Trash2, Package } from 'lucide-react';

interface CartItemProps {
  item: any;
  onRemove: (cartId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const bidding = item.bid;
  const img = bidding.images?.[0]?.image_url;
  const name = bidding.sparePart?.name || `Request #${bidding.request_ID?.slice(0, 8)}`;

  return (
    <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-3 hover:shadow-1 transition-shadow">
      {/* Image */}
      <div className="flex-shrink-0 h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-gray-1 border border-gray-3 overflow-hidden flex items-center justify-center">
        {img ? (
          <img
            src={img}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-8 w-8 text-dark-5" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-semibold text-dark truncate">{name}</p>
        <p className="text-base sm:text-lg font-bold text-blue mt-1">
          GH&#x20B5; {Number(bidding.totalPrice).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item.cart_ID)}
        className="flex-shrink-0 h-9 w-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </li>
  );
};

export default CartItem;
