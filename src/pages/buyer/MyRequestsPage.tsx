// src/pages/buyer/MyRequestsPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RequestList from '../../components/buyer/RequestList'

const tabs = [
  { key: 'active' as const, label: 'Active Requests' },
  { key: 'history' as const, label: 'History' },
]

const MyRequestsPage: React.FC = () => {
  const [tab, setTab] = useState<'active' | 'history'>('active')
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your spare part requests.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/95668339501103956045/buyer/post-request')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mt-6 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`text-sm font-medium px-5 py-2 rounded-lg transition-all duration-150 ${
              tab === t.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Request list */}
      <RequestList mode={tab} />
    </div>
  )
}

export default MyRequestsPage
