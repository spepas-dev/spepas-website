// src/pages/buyer/CheckoutPage.tsx
// import React from 'react';
import CheckoutForm from '@/components/buyer/CheckoutForm';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl w-[80%] mx-auto p-4 pt-20">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
