import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  QrCode,
  ArrowLeft,
  User,
  Package,
  Info,
} from 'lucide-react';

const PREFIX = '/95668339501103956045';

const DropoffView: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  /* No geofencing API available — always allow scan for now */
  const withinRadius = true;

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
        {/* Map placeholder */}
        <div className="h-56 sm:h-72 w-full bg-gray-1 flex flex-col items-center justify-center border-b border-gray-3">
          <div className="h-12 w-12 rounded-xl bg-gray-2 flex items-center justify-center mb-3">
            <Navigation size={24} className="text-dark-4" />
          </div>
          <p className="text-sm text-dark-4">Map view not available yet</p>
          <p className="text-xs text-dark-4 mt-1">Navigation API coming soon</p>
        </div>

        {/* Order info */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-blue" />
              <p className="text-sm font-semibold text-dark">Order #{orderId}</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
              Drop-off
            </span>
          </div>

          {/* Buyer info placeholder */}
          <div className="flex items-center gap-3 bg-gray-1 rounded-xl p-4 border border-gray-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <User size={18} className="text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-dark">Buyer</p>
              <p className="text-xs text-dark-4">Contact details from invoice</p>
            </div>
          </div>

          {/* Delivery address */}
          <div className="flex items-start gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-dark-4">Drop-off Address</p>
              <p className="text-sm font-medium text-dark">From invoice delivery address</p>
            </div>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4 mb-5">
            <Info size={16} className="text-green-700 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">
              Navigate to the buyer's location. Once you arrive, scan the QR code to confirm delivery.
            </p>
          </div>

          {/* Scan QR button */}
          <button
            disabled={!withinRadius}
            onClick={() => navigate(`${PREFIX}/rider/orders/${orderId}/scan/dropoff`)}
            className={`w-full inline-flex items-center justify-center gap-2 font-medium text-sm py-3 px-5 rounded-xl transition-colors duration-200 ${
              withinRadius
                ? 'bg-blue text-white hover:bg-blue-dark'
                : 'bg-gray-1 text-dark-4 border border-gray-3 cursor-not-allowed'
            }`}
          >
            <QrCode size={16} />
            Scan QR at Drop-off
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropoffView;
