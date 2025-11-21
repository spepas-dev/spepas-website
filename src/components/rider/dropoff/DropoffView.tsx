import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DropoffView: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const withinRadius = true; // demo: allow dropoff scan

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="h-72 w-full rounded-t-xl bg-gray-100 flex items-center justify-center">
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
            <div className="text-sm font-medium">Theo Walcot</div>
            <div className="text-xs text-gray-500">Receiver</div>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="p-2 rounded-lg border">💬</button>
            <button className="p-2 rounded-lg border">📞</button>
          </div>
        </div>

        <div className="mt-6">
          <button
            disabled={!withinRadius}
            className={`w-full px-5 py-3 rounded-lg ${withinRadius ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            onClick={() => navigate(`/95668339501103956045/rider/orders/${orderId}/scan/dropoff`)}
          >
            Scan QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropoffView;
