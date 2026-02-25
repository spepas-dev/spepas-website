import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QrCode, ArrowLeft, Camera, Info } from 'lucide-react';

const PREFIX = '/95668339501103956045';

const QRScanner: React.FC = () => {
  const { orderId, type } = useParams<{ orderId: string; type: 'pickup' | 'dropoff' }>();
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);

  const isPickup = type === 'pickup';

  const handleScan = () => {
    setScanned(true);
    // After scan, navigate to next step
    setTimeout(() => {
      if (isPickup) {
        navigate(`${PREFIX}/rider/dropoff/${orderId}`);
      } else {
        navigate(`${PREFIX}/rider/orders/${orderId}/proof`);
      }
    }, 1000);
  };

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-dark-4 hover:text-blue transition-colors duration-200 mb-4"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-3">
          <div className="flex items-center gap-2 mb-1">
            <QrCode size={18} className="text-blue" />
            <h2 className="text-base font-semibold text-dark">
              {isPickup ? 'Scan at Pickup' : 'Scan at Drop-off'}
            </h2>
          </div>
          <p className="text-sm text-dark-4">
            {isPickup
              ? 'Scan the QR code on the package from the seller.'
              : 'Scan the QR code to confirm delivery to the buyer.'}
          </p>
        </div>

        {/* Scanner area */}
        <div className="p-6 sm:p-8">
          <div className="max-w-sm mx-auto">
            {/* Camera viewfinder placeholder */}
            <div className="aspect-square bg-gray-900 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden mb-5">
              {/* Viewfinder corners */}
              <div className="absolute inset-4">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
              </div>

              {scanned ? (
                <div className="text-center z-10">
                  <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <QrCode size={28} className="text-green-400" />
                  </div>
                  <p className="text-sm font-medium text-green-400">Scan successful!</p>
                  <p className="text-xs text-white/60 mt-1">Redirecting...</p>
                </div>
              ) : (
                <div className="text-center z-10">
                  <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <Camera size={28} className="text-white/60" />
                  </div>
                  <p className="text-sm text-white/60">Camera preview</p>
                  <p className="text-xs text-white/40 mt-1">QR scanner library not integrated yet</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 bg-blue-light-5 rounded-xl p-4 mb-5">
              <Info size={16} className="text-blue shrink-0 mt-0.5" />
              <p className="text-xs text-blue">
                {isPickup
                  ? 'Point your camera at the QR code on the package. Once scanned, you\'ll be directed to the drop-off location.'
                  : 'Point your camera at the buyer\'s QR code. Once scanned, you\'ll be prompted to take a proof of delivery photo.'}
              </p>
            </div>

            {/* Simulate scan button (until real QR library is integrated) */}
            {!scanned && (
              <button
                onClick={handleScan}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-3 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
              >
                <QrCode size={16} />
                Simulate Scan ({isPickup ? 'Seller' : 'Buyer'})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
