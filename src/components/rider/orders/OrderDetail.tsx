// src/components/rider/orders/OrderDetail.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-sm">📍</div>
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  </div>
);

const OrderDetail: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Prefix for all in-app links (marketing namespace)
  const PREFIX = '/95668339501103956045';

  // Mock data — replace with real fetch
  const order = {
    id: orderId || '32516',
    pickup: 'Ghana Spare Parts Ltd., Otu Adzin Road, GT-444, Ghana',
    dropoff: 'Otu Adzin Road, GT-444, Ghana',
    distanceKm: 2,
    payment: 50,
    eta: '03:20 PM',
    status: 'in_progress' as 'in_progress' | 'delivered'
  };

  // For now, point to the demo chat created earlier (replace with real chatId later)
  const chatId = 'c1';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="mb-3 text-sm text-gray-700">
        <span className="text-gray-600">Order ID: </span>
        <span className="font-semibold">#{order.id}</span>
      </div>

      <div className="space-y-3">
        <Row label="Pick-up Address" value={order.pickup} />
        <Row label="Drop-off Address" value={order.dropoff} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 mt-4">
        <div>
          <div className="text-xs text-gray-500">Total Distance</div>
          <div>{order.distanceKm} KM</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Payment</div>
          <div>GH₵ {order.payment}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Estimated Time</div>
          <div>{order.eta}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => navigate(`${PREFIX}/rider/pickup/${order.id}`)}>
          See Direction
        </button>

        <button className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => alert('Calling customer...')}>
          Call
        </button>

        <button className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={() => navigate(`${PREFIX}/chat/${chatId}`)}>
          Chat
        </button>
      </div>

      <div className="mt-6">
        <button
          className="w-full sm:w-auto px-5 py-3 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
          onClick={() => navigate(`${PREFIX}/rider/orders/${order.id}/scan/pickup`)}
        >
          Scan QR (Pickup)
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
