import React from 'react';
import OrdersList from '@/components/rider/orders/OrdersList';
import { Package } from 'lucide-react';

const RiderOrdersPage: React.FC = () => (
  <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
    <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
          <Package size={20} className="text-blue" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-dark">Orders</h1>
          <p className="text-sm text-dark-4">Your active and completed orders</p>
        </div>
      </div>
      <OrdersList initialTab="in_progress" />
    </div>
  </section>
);

export default RiderOrdersPage;
