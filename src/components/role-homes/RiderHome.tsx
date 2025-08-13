// src/components/role-homes/RiderHome.tsx
import React, { useState } from 'react';

type RequestItem = {
  id: string;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  payment: number;
  eta: string;
};

const PlaceLine: React.FC<{ label: string; value: string; pin: string }> = ({ label, value, pin }) => (
  <div className="flex items-start gap-3">
    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-sm">{pin}</div>
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  </div>
);

const InfoCell: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-sm text-gray-800">{value}</div>
  </div>
);

const RiderRequestCard: React.FC<{
  item: RequestItem;
  onAccept?: () => void;
  onDismiss?: () => void;
  accepted?: boolean;
}> = ({ item, onAccept, onDismiss, accepted }) => (
  <div className="border rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="text-gray-700"><span className="text-sm">Order ID:</span> <span className="font-medium">#{item.id}</span></div>
      <div className="text-xs text-gray-500">{item.distanceKm}km</div>
    </div>

    <div className="space-y-3">
      <PlaceLine label="Pick-up Address" value={item.pickup} pin="📍" />
      <PlaceLine label="Drop-off Address" value={item.dropoff} pin="📦" />
    </div>

    <div className="grid grid-cols-3 gap-2 text-sm text-gray-700 mt-4">
      <InfoCell label="Total Distance" value={`${item.distanceKm} KM`} />
      <InfoCell label="Payment" value={`GH₵ ${item.payment}`} />
      <InfoCell label="Estimated Time" value={item.eta} />
    </div>

    <div className="mt-4">
      {!accepted ? (
        <div className="flex gap-3">
          <button onClick={onDismiss} className="flex-1 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Dismiss</button>
          <button onClick={onAccept} className="flex-1 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700">Accept</button>
        </div>
      ) : (
        <button className="w-full py-2 rounded-lg border border-violet-300 text-violet-700 bg-violet-50">View delivery details</button>
      )}
    </div>
  </div>
);

const EmptyLine: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-sm text-gray-500 border rounded-md p-4 text-center">{text}</div>
);

const RiderHome: React.FC<{ riderName: string }> = ({ riderName }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [tab, setTab] = useState<'new' | 'accepted'>('new');

  // TODO: Replace with API data when online
  const [newRequests, setNewRequests] = useState<RequestItem[]>([
    { id: '325416', pickup: 'Ghana Spare Parts Ltd., Otu Adzin Road, GT-444, Ghana', dropoff: 'Otu Adzin Road, GT-444, Ghana', distanceKm: 2, payment: 50, eta: '03:20 PM' },
    { id: '325417', pickup: 'Circle Station, Accra', dropoff: 'Dansoman Roundabout, Accra', distanceKm: 5, payment: 80, eta: '03:45 PM' },
  ]);
  const [accepted, setAccepted] = useState<RequestItem[]>([]);

  const accept = (id: string) => {
    const req = newRequests.find((r) => r.id === id);
    if (!req) return;
    setNewRequests((xs) => xs.filter((r) => r.id !== id));
    setAccepted((xs) => [req, ...xs]);
    setTab('accepted');
  };

  const dismiss = (id: string) => setNewRequests((xs) => xs.filter((r) => r.id !== id));

  return (
    <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0 py-6 pt-20">
      <h1 className="text-2xl font-semibold mb-4">Home</h1>

      {!isOnline && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center mb-5">
          <div className="mx-auto w-20 h-16 bg-gray-100 rounded mb-4" />
          <h2 className="font-medium text-lg mb-1">Let’s earn some cash!</h2>
          <p className="text-gray-600 text-sm mb-4">Go online to start receiving fresh requests.</p>
          <button className="px-5 py-3 rounded-lg bg-violet-600 text-white font-medium" onClick={() => setIsOnline(true)}>
            Go online
          </button>
        </div>
      )}

      {isOnline && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex gap-2 mb-4">
            <button
              className={`px-3 py-2 rounded-lg text-sm ${tab === 'new' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setTab('new')}
            >
              New Requests
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm ${tab === 'accepted' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setTab('accepted')}
            >
              Accepted
            </button>
          </div>

          {tab === 'new' && (newRequests.length ? (
            <div className="space-y-4">
              {newRequests.map((r) => (
                <RiderRequestCard key={r.id} item={r} onAccept={() => accept(r.id)} onDismiss={() => dismiss(r.id)} />
              ))}
            </div>
          ) : <EmptyLine text="No new requests." />)}

          {tab === 'accepted' && (accepted.length ? (
            <div className="space-y-4">
              {accepted.map((r) => (
                <RiderRequestCard key={r.id} item={r} accepted />
              ))}
            </div>
          ) : <EmptyLine text="No accepted requests yet." />)}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">Signed in as <span className="font-medium">{riderName}</span></p>
    </div>
  );
};

export default RiderHome;
