import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PickupView: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const withinRadius = false; // replace with geofencing check
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="h-72 w-full rounded-t-xl bg-gray-100 flex items-center justify-center">
        {/* Map placeholder */}
        <div className="text-gray-500">[Map preview here]</div>
      </div>

      <div className="p-4">
        <div className="mb-3 text-sm text-gray-700">
          <span className="text-gray-600">Order ID: </span>
          <span className="font-semibold">#{orderId}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div>
            <div className="text-sm font-medium">Kwame</div>
            <div className="text-xs text-gray-500">Ghana Spare Parts Ltd.</div>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="p-2 rounded-lg border">💬</button>
            <button className="p-2 rounded-lg border">📞</button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-sm">📍</div>
            <div>
              <div className="text-xs text-gray-500">Pick-up Address</div>
              <div className="text-sm text-gray-800">Otu Adzin Road, GT-444, Ghana</div>
            </div>
            <span className="ml-auto text-xs text-gray-500">1 km</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mt-3">
            <div>
              <div className="text-xs text-gray-500">Arrive By</div>
              <div>03:00 PM</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Package</div>
              <div>1</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            disabled={!withinRadius}
            className={`w-full px-5 py-3 rounded-lg ${withinRadius ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            onClick={() => navigate(`/95668339501103956045/rider/orders/${orderId}/scan/pickup`)}
          >
            Scan QR
          </button>
          {!withinRadius && (
            <p className="mt-2 text-xs text-gray-500">
              This button will be enabled once you are within 500m radius of the address.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupView;
