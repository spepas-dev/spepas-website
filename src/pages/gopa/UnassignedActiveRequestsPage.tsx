// src/pages/gopa/UnassignedActiveRequestsPage.tsx
import React, { useEffect, useState } from 'react';

import RequestList from '@/components/gopa/RequestList';
import { useAuth } from '@/features/auth';
import { getGOPAUnassignedActiveRequestsAPI } from '@/lib/orderBidsApis';

const UnassignedActiveRequestsPage: React.FC = () => {
  const { authData } = useAuth();
  const gopaProfile = authData?.user?.gopa;
  const userId = gopaProfile?.Gopa_ID;

  const [requests, setRequests] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    if (!userId) {
      return;
    }
    getGOPAUnassignedActiveRequestsAPI({ user_id: userId })
      .then((res) => setRequests(res.data))
      .catch(console.error);
  }, [userId]);

  // If there's no GOPA profile, render a friendly message instead of blowing up
  if (!gopaProfile) {
    return (
      <div className="p-6 max-w-4xl w-full px-4 sm:px-6 lg:px-8 mx-auto pt-28">
        <h1 className="text-2xl font-bold mb-4">Unassigned Active Requests</h1>
        <p className="text-gray-600">No GOPA profile found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl w-full px-4 sm:px-6 lg:px-8 mx-auto pt-28">
      <section className="pt-10"></section>
      <h1 className="text-2xl font-bold mb-4">Unassigned Active Requests</h1>
      {requests.length > 0 ? (
        <RequestList requests={requests} />
      ) : (
        <p className="text-gray-600 mt-6">No unassigned active requests found.</p>
      )}
    </div>
  );
};

export default UnassignedActiveRequestsPage;
