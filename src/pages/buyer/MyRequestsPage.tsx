// src/pages/buyer/MyRequestsPage.tsx
import React, { useState } from 'react';
import RequestList from '@/components/buyer/RequestList';
// import { useNavigate } from 'react-router-dom'

export default function MyRequestsPage() {
  const [tab, setTab] = useState<'active'|'history'>('active');
  // const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 max-w-4xl w-[80%] mx-auto p-4 pt-20">
        <section className="pt-10"></section>

             {/* <button onClick={() => navigate('/buyer/requests/offers-all')} className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded">
                    View All Requests & Their Bids
              </button> */}

      <h1 className="text-2xl font-bold mb-4">My Requests</h1>
      <h2 className="text-lg mb-4">
        View and manage your requests below.</h2>
      <div className="mb-4">
        <button
          onClick={() => setTab('active')}
          className={`mr-4 pb-1 border-b-2 ${
            tab === 'active' ? 'border-indigo-600' : 'border-transparent'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setTab('history')}
          className={`pb-1 border-b-2 ${
            tab === 'history' ? 'border-indigo-600' : 'border-transparent'
          }`}
        >
          History
        </button>
      </div>
      <RequestList mode={tab} />
    </div>
  );
}
