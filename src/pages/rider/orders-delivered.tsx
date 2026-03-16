import React from 'react';

import OrdersList from '@/components/rider/orders/OrdersList';

const RiderOrdersDeliveredPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      <section className="pt-10"></section>
      <h1 className="text-xl sm:text-3xl lg:text-3xl font-bold mb-6 text-center sm:text-left text-blue-800">Order</h1>
      <OrdersList initialTab="delivered" />
    </div>
  );
};

export default RiderOrdersDeliveredPage;
