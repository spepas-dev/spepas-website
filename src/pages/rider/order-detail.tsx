import React from 'react';
import OrderDetail from '@/components/rider/orders/OrderDetail';

const RiderOrderDetailPage: React.FC = () => (
  <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
    <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
      <OrderDetail />
    </div>
  </section>
);

export default RiderOrderDetailPage;
