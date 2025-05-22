// src/components/buyer/CartItem.tsx
import React from 'react';

interface CartItemProps {
  item: any;
  onRemove: (cartId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const bidding = item.bid;
  const img = bidding.images?.[0]?.image_url;

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow">
      {img && (
        <img
          src={img}
          alt={bidding.sparePart?.name}
          className="
            w-full h-48
            sm:w-16 sm:h-16
            object-cover
            rounded-md
          "
        />
      )}

      <div className="flex-grow space-y-1 text-center sm:text-left">
        <p className="text-lg sm:text-base font-semibold text-gray-800">
          {bidding.sparePart?.name || bidding.request_ID}
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          GH₵ {bidding.totalPrice}
        </p>
      </div>

      <button
        onClick={() => onRemove(item.cart_ID)}
        className="
          w-full
          sm:w-auto
          bg-red-50 hover:bg-red-100
          text-red-600 hover:text-red-800
          font-medium
          py-2 px-4
          rounded-md
          transition
        "
      >
        Remove
      </button>
    </li>
  );
};

export default CartItem;
