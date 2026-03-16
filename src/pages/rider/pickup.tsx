import React from 'react';

import PickupView from '@/components/rider/pickup/PickupView';

const RiderPickupPage: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      <section className="pt-6"></section>
      <PickupView />
    </div>
  );
};

export default RiderPickupPage;
