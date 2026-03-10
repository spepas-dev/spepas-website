import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  QrCode,
  ArrowLeft,
  User,
  Package,
  Clock,
  Info,
} from 'lucide-react';

const PREFIX = '/95668339501103956045';

const PickupView: React.FC = () => {
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
        Back to order
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
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
              Pickup
            </span>
          </div>

          {/* Seller info placeholder */}
          <div className="flex items-center gap-3 bg-gray-1 rounded-xl p-4 border border-gray-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-light-5 flex items-center justify-center shrink-0">
              <User size={18} className="text-blue" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-dark">Seller</p>
              <p className="text-xs text-dark-4">Contact details from invoice</p>
            </div>
          </div>

          {/* Address & info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-light-5 flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-blue" />
              </div>
              <div>
                <p className="text-xs text-dark-4">Pick-up Address</p>
                <p className="text-sm font-medium text-dark">From invoice address details</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-1 flex items-center justify-center shrink-0">
                <Clock size={14} className="text-dark-4" />
              </div>
              <div>
                <p className="text-xs text-dark-4">Estimated Arrival</p>
                <p className="text-sm font-medium text-dark">Available after navigation integration</p>
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-blue-light-5 rounded-xl p-4 mb-5">
            <Info size={16} className="text-blue shrink-0 mt-0.5" />
            <p className="text-xs text-blue">
              Navigate to the seller's location. Once you arrive, scan the QR code on the package to confirm pickup.
            </p>
          </div>

          {/* Scan QR button */}
          <button
            disabled={!withinRadius}
            onClick={() => navigate(`${PREFIX}/rider/orders/${orderId}/scan/pickup`)}
            className={`w-full inline-flex items-center justify-center gap-2 font-medium text-sm py-3 px-5 rounded-xl transition-colors duration-200 ${
              withinRadius
                ? 'bg-blue text-white hover:bg-blue-dark'
                : 'bg-gray-1 text-dark-4 border border-gray-3 cursor-not-allowed'
            }`}
          >
            <QrCode size={16} />
            Scan QR at Pickup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupView;
