import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeliverySuccessCard from '@/components/rider/proof/DeliverySuccessCard';

const RiderDeliveredSuccessPage: React.FC = () => {
  const nav = useNavigate();
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      <section className="pt-6"></section>
      <DeliverySuccessCard onBack={() => nav('/')} />
    </div>
  );
};

export default RiderDeliveredSuccessPage;
