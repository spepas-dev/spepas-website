// src/pages/buyer/CartPage.tsx
import React from 'react';

import CartList from '@/components/buyer/CartList';

const CartPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
        <p className="text-sm text-gray-500 mt-1">Review your items before checkout.</p>
      </div>
      <CartList />
    </div>
  );
};

export default CartPage;
