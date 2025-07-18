// src/pages/buyer/CheckoutPage.tsx
import React from 'react';
import CheckoutForm from '@/components/buyer/CheckoutForm';

const CheckoutPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left text-blue-800">
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
