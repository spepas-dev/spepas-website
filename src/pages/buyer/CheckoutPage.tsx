// src/pages/buyer/CheckoutPage.tsx
import React from 'react';

import CheckoutForm from '@/components/buyer/CheckoutForm';

const CheckoutPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Review charges and complete your order.</p>
      </div>
      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
