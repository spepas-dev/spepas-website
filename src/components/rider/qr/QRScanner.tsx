import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Placeholder scanner UI. Integrate a real scanner (e.g., html5-qrcode / Capacitor/Flutter side)
 * and replace the "Simulate Scan" logic with actual decode callback.
 */
const QRScanner: React.FC = () => {
  const { orderId, type } = useParams<{ orderId: string; type: 'pickup' | 'dropoff' }>();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);

  const simulate = () => {
    setScanning(false);
    if (type === 'pickup') {
      // after seller scan, go to rider dropoff map
      navigate(`/95668339501103956045/rider/dropoff/${orderId}`);
    } else {
      // after buyer scan, go to proof-of-delivery photo
      navigate(`/95668339501103956045/rider/orders/${orderId}/proof`);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-xl border border-gray-800 p-6 flex items-center justify-center min-h-[420px]">
      <div className="w-full max-w-sm">
        <div className="text-center text-lg font-medium mb-4">Scanning...</div>
        <div className="aspect-square bg-black/40 rounded-2xl border-2 border-white/30 flex items-center justify-center">
          <div className="w-40 h-40 bg-white" />
        </div>
        <button
          className="mt-6 w-full px-5 py-3 rounded-lg bg-white text-gray-900"
          onClick={simulate}
        >
          Simulate Scan ({type === 'pickup' ? 'Seller' : 'Buyer'})
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
