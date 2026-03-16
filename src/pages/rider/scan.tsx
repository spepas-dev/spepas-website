import React from 'react';
import QRScanner from '@/components/rider/qr/QRScanner';

const RiderScanPage: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      <section className="pt-6"></section>
      <QRScanner />
    </div>
  );
};

export default RiderScanPage;
