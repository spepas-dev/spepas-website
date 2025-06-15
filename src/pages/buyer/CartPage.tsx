// src/pages/CartPage.tsx
import React from 'react';

import CartList from '@/components/buyer/CartList';

export default function CartPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      {/* Spacer for fixed headers, etc. */}
      <section className="pt-10"></section>

      <h1 className="text-xl sm:text-3xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-blue-800">My Cart</h1>

      <CartList />
    </div>
  );
}
