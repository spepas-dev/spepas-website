// src/pages/buyer/OffersPage.tsx
import React from 'react';

import OffersList from '../../components/buyer/OffersList';

const OffersPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      <OffersList />
    </div>
  );
};

export default OffersPage;
