// src/pages/buyer/MyRequestsOffersPage.tsx
import React from 'react';
import RequestsWithOffersList from '@/components/buyer/RequestsWithOffersList';

const MyRequestsOffersPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-6 text-center sm:text-left text-blue-800">
        My Requests & Offers
      </h1>
      <RequestsWithOffersList />
    </div>
  );
};

export default MyRequestsOffersPage;
