// src/pages/buyer/MyRequestsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import RequestList from '@/components/buyer/RequestList';

export default function MyRequestsPage() {
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 max-w-4xl w-[80%] mx-auto p-4 pt-20">
      <section className="pt-10"></section>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">My Requests</h1>

        <button
          onClick={() => navigate('/buyer/post-request')}
          className="
        flex items-center
          mt-3 sm:mt-0        /* keep some top margin on mobile so it doesn’t feel cramped */
          px-4 py-2 
          text-sm text-blue-700 
          border border-gray-300 
          rounded-lg 
          hover:bg-gray-100 
          transition
      "
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
          </svg>
          Create request
        </button>
      </div>

      {/* Descriptive subtitle below the heading/button row */}
      <h2 className="text-lg text-gray-600 mb-6">View and manage your requests below.</h2>
      <div className="mb-4">
        <button
          onClick={() => setTab('active')}
          className={`mr-4 pb-1 border-b-2 ${tab === 'active' ? 'border-indigo-600' : 'border-transparent'}`}
        >
          Active
        </button>
        <button
          onClick={() => setTab('history')}
          className={`pb-1 border-b-2 ${tab === 'history' ? 'border-indigo-600' : 'border-transparent'}`}
        >
          History
        </button>
      </div>
      <RequestList mode={tab} />
    </div>
  );
}
