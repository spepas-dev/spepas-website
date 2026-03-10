import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeliverySuccessCard from '@/components/rider/proof/DeliverySuccessCard';

const PREFIX = '/95668339501103956045';

const RiderDeliveredSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-8">
        <DeliverySuccessCard
          onBack={() => navigate(`${PREFIX}/rider/invoices`)}
        />
      </div>
    </section>
  );
};

export default RiderDeliveredSuccessPage;
