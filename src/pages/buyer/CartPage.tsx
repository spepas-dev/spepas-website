import React from 'react';
import CartList from '@/components/buyer/CartList';
import { ShoppingCart } from 'lucide-react';

const CartPage: React.FC = () => {
  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark">My Cart</h1>
            <p className="text-sm text-dark-4">Review your items before checkout</p>
          </div>
        </div>
        <CartList />
      </div>
    </section>
  );
};

export default CartPage;
