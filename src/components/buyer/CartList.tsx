import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getItemsInCartAll, removeBidFromCartAPI, getUserChargesAPI } from '@/lib/orderBidsApis';
import CartItem from './CartItem';
import SpepasLoader from '@/components/common/SpepasLoader';
import { ShoppingCart, ArrowRight, PackageOpen } from 'lucide-react';

const CartList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getItemsInCartAll()
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (cartId: string) => {
    removeBidFromCartAPI({ cart_ID: cartId })
      .then(() => setItems((prev) => prev.filter((i) => i.cart_ID !== cartId)))
      .catch(console.error);
  };

  const handleCheckout = () => {
    toast(
      (t) => (
        <div className="text-center">
          <p className="text-sm font-medium text-dark mb-3">Aggregate cart items?</p>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-1.5 text-sm font-medium bg-blue text-white rounded-lg hover:bg-blue-dark transition-colors"
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmAggregate('1');
              }}
            >
              Yes
            </button>
            <button
              className="px-4 py-1.5 text-sm font-medium bg-gray-1 text-dark border border-gray-3 rounded-lg hover:bg-gray-2 transition-colors"
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmAggregate('0');
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: { marginTop: '4rem', zIndex: 10000 },
      }
    );
  };

  const confirmAggregate = async (agg: '1' | '0') => {
    setLoading(true);
    try {
      const charges = await getUserChargesAPI({ aggeagate: agg });
      navigate('/95668339501103956045/buyer/checkout', { state: { charges, aggeagate: agg } });
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch charges.');
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, i) => sum + (i.bid.totalPrice || 0), 0);

  if (loading) {
    return <SpepasLoader size="lg" label="Loading cart..." fullSection />;
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-20 w-20 rounded-full bg-gray-1 flex items-center justify-center mb-5">
            <PackageOpen className="h-10 w-10 text-dark-4" />
          </div>
          <p className="text-base font-semibold text-dark">Your cart is empty</p>
          <p className="text-sm text-dark-4 mt-1 mb-6">Browse our shop to find the parts you need</p>
          <button
            onClick={() => navigate('/95668339501103956045/shop')}
            className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-6 rounded-xl hover:bg-blue-dark transition-colors duration-200"
          >
            <ShoppingCart className="h-4 w-4" />
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
      {/* Cart items */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-dark-4 font-medium">
            {items.length} item{items.length !== 1 ? 's' : ''} in cart
          </p>
        </div>

        <ul className="space-y-3">
          {items.map((i) => (
            <CartItem key={i.cart_ID} item={i} onRemove={handleRemove} />
          ))}
        </ul>
      </div>

      {/* Footer with total + checkout */}
      <div className="border-t border-gray-3 bg-gray-1 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-dark">
            GH&#x20B5; {total.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-3 px-8 rounded-xl hover:bg-blue-dark transition-colors duration-200"
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartList;
