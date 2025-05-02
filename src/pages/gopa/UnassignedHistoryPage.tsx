// src/pages/gopa/UnassignedHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { getGOPAUnassignedRequestHistoryAPI } from '@/lib/orderBidsApis';
import RequestList from '@/components/gopa/RequestList';
import { useAuth } from '@/features/auth';

const UnassignedHistoryPage: React.FC = () => {
  const { authData } = useAuth();
  const gopaProfile = authData?.user?.gopa;

  // Guard: if there's no GOPA profile, show a message instead of crashing
  if (!gopaProfile) {
    return (
      <div className="p-6 max-w-4xl w-full px-4 sm:px-6 lg:px-8 mx-auto pt-20">
        <h1 className="text-2xl font-bold mb-4">Unassigned Request History</h1>
        <p className="text-gray-600">No GOPA profile found.</p>
      </div>
    );
  }

  const userId = gopaProfile.Gopa_ID;
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    getGOPAUnassignedRequestHistoryAPI({ user_id: userId })
      .then(res => setRequests(res.data))
      .catch(console.error);
  }, [userId]);

  return (
    <div className="p-6 max-w-4xl w-full px-4 sm:px-6 lg:px-8 mx-auto pt-20">
      <h1 className="text-2xl font-bold mb-4">Unassigned Request History</h1>
      <RequestList requests={requests} />
    </div>
  );
};

export default UnassignedHistoryPage;
