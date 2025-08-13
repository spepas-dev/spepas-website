// src/pages/buyer/MyRequestsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestList from '../../components/buyer/RequestList';

const MyRequestsPage: React.FC = () => {
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      <section className="pt-10"></section>
      {/* Header + Create button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">My Requests</h1>
        <button
          type="button"
          onClick={() => navigate('/95668339501103956045/buyer/post-request')}
          className="flex items-center mt-3 sm:mt-0 px-4 py-2 text-sm text-blue-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v14m-7-7h14"
            />
          </svg>
          Create Request
        </button>
      </div>

      {/* Subtitle */}
      <h2 className="text-lg text-gray-600 mb-6">
        View and manage your requests below.
      </h2>

      {/* Tabs */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={`mr-4 pb-1 border-b-2 ${
            tab === 'active' ? 'border-indigo-600' : 'border-transparent'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setTab('history')}
          className={`pb-1 border-b-2 ${
            tab === 'history' ? 'border-indigo-600' : 'border-transparent'
          }`}
        >
          History
        </button>
      </div>

      {/* Request list */}
      <RequestList mode={tab} />
    </div>
  );
};

export default MyRequestsPage;
