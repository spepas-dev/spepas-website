// src/pages/gopa/AssignedActiveRequestsPage.tsx
import React, { useState, useEffect } from 'react';
import { getGOPAAssignedActiveRequestsAPI } from '@/lib/orderBidsApis';
import RequestList from '@/components/gopa/RequestList';
import { useAuth } from '@/features/auth';

const AssignedActiveRequestsPage: React.FC = () => {
  const { authData } = useAuth();
  const gopaProfile = authData?.user?.gopa;

  // If user has no GOPA profile, show a message instead of erroring
  if (!gopaProfile) {
    return (
      <div className="p-6">
        <section className="pt-20"></section>
        <h1 className="text-2xl font-bold mb-4">Your Assigned Active Requests</h1>
        <p className="text-gray-600">No GOPA profile found.</p>
      </div>
    );
  }

  const userId = gopaProfile.Gopa_ID;
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    getGOPAAssignedActiveRequestsAPI({ user_id: userId })
      .then(res => setRequests(res.data))
      .catch(console.error);
  }, [userId]);

  return (
    <div className="p-6 max-w-4xl w-full px-4 sm:px-6 lg:px-8 mx-auto pt-20">
        
      <h1 className="text-2xl font-bold mb-4">Your Assigned Active Requests</h1>
      <RequestList requests={requests} />
    </div>
  );
};

export default AssignedActiveRequestsPage;
