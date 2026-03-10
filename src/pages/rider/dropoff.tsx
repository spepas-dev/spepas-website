import React from 'react';
import DropoffView from '@/components/rider/dropoff/DropoffView';

const RiderDropoffPage: React.FC = () => (
  <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
    <div className="max-w-lg mx-auto px-4 sm:px-8">
      <DropoffView />
    </div>
  </section>
);

export default RiderDropoffPage;
