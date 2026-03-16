import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type OrderRow = {
  id: string;
  date: string; // e.g., "14/06/2023"
  price: number; // GH₵
  status: 'in_progress' | 'delivered';
  pickup: string;
  dropoff: string;
};

const Badge: React.FC<{ children: React.ReactNode; tone?: 'info' | 'success' }> = ({ children, tone = 'info' }) => (
  <span
    className={`text-xs px-2 py-1 rounded-full ${tone === 'success' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'}`}
  >
    {children}
  </span>
);

const OrderMiniCard: React.FC<{ o: OrderRow; onClick: () => void }> = ({ o, onClick }) => (
  <button className="w-full text-left border rounded-xl p-4 hover:bg-gray-50 focus:outline-none" onClick={onClick}>
    <div className="flex items-center justify-between">
      <div className="font-medium">Order #{o.id}</div>
      <div className="font-medium">GH₵ {o.price}</div>
    </div>
    <div className="text-xs text-gray-500">{o.date}</div>
    <div className="mt-2">
      <Badge tone={o.status === 'delivered' ? 'success' : 'info'}>{o.status === 'delivered' ? 'Delivered' : 'In progress'}</Badge>
    </div>
  </button>
);

const OrdersList: React.FC<{ initialTab?: 'in_progress' | 'delivered' }> = ({ initialTab = 'in_progress' }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const tabParam = (search.get('tab') as 'in_progress' | 'delivered') || initialTab;

  const [tab, setTab] = useState<'in_progress' | 'delivered'>(tabParam);

  const allOrders: OrderRow[] = useMemo(
    () => [
      {
        id: '32516',
        date: '14/06/2023',
        price: 50,
        status: 'in_progress',
        pickup: 'Ghana Spare Parts Ltd., Otu Adzin Road, GT-444, Ghana',
        dropoff: 'Otu Adzin Road, GT-444, Ghana'
      },
      {
        id: '32517A',
        date: '14/06/2023',
        price: 70,
        status: 'delivered',
        pickup: 'Circle Station, Accra',
        dropoff: 'Dansoman Roundabout, Accra'
      },
      { id: '32517B', date: '14/06/2023', price: 70, status: 'delivered', pickup: 'Kantamanto, Accra', dropoff: 'North Kaneshie, Accra' }
    ],
    []
  );

  const filtered = allOrders.filter((o) => o.status === tab);

  const switchTab = (t: 'in_progress' | 'delivered') => {
    setTab(t);
    setSearch((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', t);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <div className="w-full sm:w-80">
          <input placeholder="Search by ID..." className="w-full border rounded-lg px-3 py-2 text-sm" onChange={() => {}} />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded-lg text-sm ${tab === 'in_progress' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => switchTab('in_progress')}
          >
            In progress
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm ${tab === 'delivered' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => switchTab('delivered')}
          >
            Delivered
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <OrderMiniCard key={o.id} o={o} onClick={() => navigate(`/95668339501103956045/rider/orders/${o.id}`)} />
        ))}
        {filtered.length === 0 && <div className="text-sm text-gray-500 border rounded-md p-4 text-center">No orders.</div>}
      </div>
    </div>
  );
};

export default OrdersList;
