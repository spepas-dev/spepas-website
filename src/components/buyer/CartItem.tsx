//src/components/buyer/CartItem.tsx

import React from 'react';

interface CartItemProps {
  item: any;
  onRemove: (cartId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const bidding = item.bid;
  const img = bidding.images?.[0]?.image_url;

  return (
    <li className="flex items-center mb-4">
      {img && (
        <img
          src={img}
          alt=""
          className="w-16 h-16 object-cover mr-4 rounded"
        />
      )}
      <div className="flex-grow">
        <p className="font-semibold">
          {bidding.sparePart?.name || bidding.request_ID}
        </p>
        <p>GH₵ {bidding.totalPrice}</p>
      </div>
      <button
        onClick={() => onRemove(item.cart_ID)}
        className="text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </li>
  );
};

export default CartItem;
