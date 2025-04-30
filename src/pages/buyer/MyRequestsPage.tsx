// src/pages/buyer/MyRequestsPage.tsx
import React, { useState } from 'react';
import RequestList from '@/components/buyer/RequestList';

export default function MyRequestsPage() {
  const [tab, setTab] = useState<'active'|'history'>('active');

  return (
    <div className="container mx-auto p-4 max-w-4xl w-[80%] mx-auto p-4 pt-20">
        <section className="pt-10"></section>
      <h1 className="text-2xl font-bold mb-4">My Requests</h1>
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
