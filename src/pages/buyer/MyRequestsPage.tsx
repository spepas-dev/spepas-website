import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestList from '@/components/buyer/RequestList';
import { ClipboardList, Plus } from 'lucide-react';

const MyRequestsPage: React.FC = () => {
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-blue" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-dark">My Requests</h1>
              <p className="text-sm text-dark-4">View and manage your spare part requests</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/95668339501103956045/buyer/post-request')}
            className="inline-flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab('active')}
            className={`font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200 ${
              tab === 'active'
                ? 'bg-blue text-white'
                : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200 ${
              tab === 'history'
                ? 'bg-blue text-white'
                : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
            }`}
          >
            History
          </button>
        </div>

        <RequestList mode={tab} />
      </div>
    </section>
  );
};

export default MyRequestsPage;
