// src/pages/buyer/MyRequestsOffersPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import RequestsWithOffersList from '@/components/buyer/RequestsWithOffersList'

const MyRequestsOffersPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests & Offers</h1>
          <p className="text-sm text-gray-500 mt-1">Track your requests and the offers you've received.</p>
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
      <RequestsWithOffersList />
    </div>
  )
}

export default MyRequestsOffersPage
