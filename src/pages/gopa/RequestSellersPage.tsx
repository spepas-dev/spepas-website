// src/pages/gopa/RequestSellersPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AssignSellerModal from '@/components/gopa/AssignSellerModal';
import { useAuth } from '@/features/auth';
import { assignRequestToSellerAPI, getGOPASellerForRequestAPI } from '@/lib/orderBidsApis';

const RequestSellersPage: React.FC = () => {
  const { gopaId: paramGopaId, requestId } = useParams<{ gopaId: string; requestId: string }>();
  const { authData } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sellers, setSellers] = useState<any[]>([]);
  const [modalOpenFor, setModalOpenFor] = useState<string | null>(null);
  const gopaProfile = authData?.user?.gopa;

  useEffect(() => {
    // both IDs are now guaranteed to be defined
    if (gopaProfile?.Gopa_ID) {
      getGOPASellerForRequestAPI({ gopa_id: gopaProfile?.Gopa_ID, request_id: requestId! })
        .then((res) => setSellers(res.data))
        .catch(console.error);
    }
  }, [gopaProfile?.Gopa_ID, requestId]);

  // Guard: ensure we actually have a GOPA profile and the URL matches their ID
  if (!gopaProfile || gopaProfile.Gopa_ID !== paramGopaId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Choose Seller for Request</h1>
        <p className="text-gray-600">
          {gopaProfile ? 'You are not authorized to assign sellers on this request.' : 'No GOPA profile found.'}
        </p>
      </div>
    );
  }

  const onAssign = async (sellerID: string) => {
    await assignRequestToSellerAPI({
      request_id: requestId!,
      sellerIDs: [sellerID]
    });
    setModalOpenFor(null);
    // TODO: re-fetch or show a toast that assignment succeeded
  };

  return (
    <div className="p-6 max-w-4xl w-full px-4 sm:px-6 lg:px-8 mx-auto pt-20">
      <h1 className="text-2xl font-bold mb-4">Choose Seller for Request</h1>
      <ul className="space-y-4">
        {sellers.length > 0 &&
          sellers?.map((s) => (
            <li key={s.Seller_ID} className="p-4 border rounded flex justify-between">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-600">{s.rating} ★</p>
              </div>
              <button onClick={() => setModalOpenFor(s.Seller_ID)} className="bg-indigo-500 text-white px-4 py-2 rounded">
                Assign
              </button>
              {modalOpenFor === s.Seller_ID && (
                <AssignSellerModal seller={s} onConfirm={() => onAssign(s.Seller_ID)} onCancel={() => setModalOpenFor(null)} />
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RequestSellersPage;
