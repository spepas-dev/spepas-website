// src/components/buyer/RequestList.tsx
import React, { useEffect, useState, useCallback } from 'react'
import {
  getBuyerActiveRequestsAll,
  getBuyerRequestHistoryAll,
} from '@/lib/orderBidsApis'
import RequestCard from './RequestCard'
import RequestWithOffersCard from './RequestWithOffersCard'
import SpepasLoader from '@/components/common/SpepasLoader'

interface RequestListProps {
  mode: 'active' | 'history'
}

const ITEMS_PER_PAGE = 9

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition bg-white'

const RequestList: React.FC<RequestListProps> = ({ mode }) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(false)
    const fn = mode === 'active' ? getBuyerActiveRequestsAll : getBuyerRequestHistoryAll
    fn()
      .then((res) => { setData(res.data); setCurrentPage(1) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [mode])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setCurrentPage(1) }, [searchTerm, startDate, endDate, mode])

  const CardComponent = mode === 'active' ? RequestWithOffersCard : RequestCard

  const filteredData = data.filter((req) => {
    if (searchTerm.trim()) {
      const blob = JSON.stringify(req).toLowerCase()
      if (!blob.includes(searchTerm.toLowerCase().trim())) return false
    }
    const created = new Date(req.createdAt)
    if (startDate && created < new Date(startDate + 'T00:00:00')) return false
    if (endDate && created > new Date(endDate + 'T23:59:59')) return false
    return true
  })

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  if (loading) return <SpepasLoader size="lg" label="Loading requests..." />

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm text-gray-600">Something went wrong loading requests.</p>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">
          No {mode === 'active' ? 'active' : 'historical'} requests found.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition ${
              showFilters
                ? 'bg-blue/10 text-blue border-blue/20'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters
          </button>
        </div>

        {/* Collapsible Date Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">From</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">To</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
              </div>
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate('') }}
                className="mt-3 text-xs text-blue hover:underline"
              >
                Clear date filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400">
        {filteredData.length} {filteredData.length === 1 ? 'request' : 'requests'} found
      </p>

      {/* Grid or empty */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-500">No requests match your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((req) => (
              <CardComponent key={req.request_ID} req={req} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 pt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                    num === currentPage
                      ? 'bg-blue text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RequestList
