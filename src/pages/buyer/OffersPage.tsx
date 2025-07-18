// src/pages/buyer/OffersPage.tsx
import React from 'react';
import OffersList from '../../components/buyer/OffersList';

const OffersPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      <section className="pt-10"></section>
      <OffersList />
    </div>
  );
};

export default OffersPage;
