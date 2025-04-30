import React, { useEffect, useState } from 'react';
import { getItemsInCartAll, removeBidFromCartAPI } from '@/lib/orderBidsApis';
import CartItem from './CartItem';

const CartList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItemsInCartAll()
      .then(res => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (cartId: string) => {
    removeBidFromCartAPI({ cart_ID: cartId })
      .then(() => setItems(prev => prev.filter(i => i.cart_ID !== cartId)))
      .catch(console.error);
  };

  const total = items.reduce((sum, i) => sum + (i.bid.totalPrice || 0), 0);

  if (loading) return <p>Loading cart…</p>;
  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div>
      <ul>
        {items.map(i => (
          <CartItem key={i.cart_ID} item={i} onRemove={handleRemove} />
        ))}
      </ul>
      <div className="mt-6 flex justify-between items-center">
        <span className="font-bold">Total: GH₵ {total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartList;
