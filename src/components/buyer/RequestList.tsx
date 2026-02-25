import React, { useEffect, useState, useCallback } from 'react'
import {
  getBuyerActiveRequestsAll,
  getBuyerRequestHistoryAll,
} from '@/lib/orderBidsApis'
import RequestCard from './RequestCard'
import RequestWithOffersCard from './RequestWithOffersCard'
import SpepasLoader from '@/components/common/SpepasLoader'
import { Search, SlidersHorizontal, AlertCircle, PackageOpen } from 'lucide-react'

interface RequestListProps {
  mode: 'active' | 'history'
}

const ITEMS_PER_PAGE = 8

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
      .then((res) => {
        setData(res.data)
        setCurrentPage(1)
      })
      .catch((err) => {
        console.error(err)
        setError(true)
      })
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
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (loading) {
    return <SpepasLoader size="lg" label="Loading requests..." fullSection />
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm font-medium text-dark-2">Something went wrong</p>
          <p className="text-xs text-dark-4 mt-1 mb-5">Failed to load requests</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-6 rounded-xl hover:bg-blue-dark transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-14 w-14 rounded-full bg-gray-1 flex items-center justify-center mb-4">
            <PackageOpen className="h-6 w-6 text-dark-4" />
          </div>
          <p className="text-sm font-medium text-dark-2">
            No {mode === 'active' ? 'active' : 'historical'} requests
          </p>
          <p className="text-xs text-dark-4 mt-1">Your requests will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-gray-3 rounded-lg focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-colors"
          />
        </div>

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-lg border transition-colors ${
            showFilters
              ? 'bg-blue text-white border-blue'
              : 'bg-white text-dark-2 border-gray-3 hover:bg-gray-1'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-3 p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-dark-4 mb-1.5">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-3 bg-gray-1 px-3 text-sm text-dark focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-4 mb-1.5">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-3 bg-gray-1 px-3 text-sm text-dark focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* No match */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <p className="text-sm text-dark-4">No requests match your criteria.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((req) => (
              <CardComponent key={req.request_ID} req={req} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-9 px-3 rounded-lg border border-gray-3 text-dark-3 text-sm hover:bg-gray-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    num === currentPage
                      ? 'bg-blue text-white'
                      : 'bg-white text-dark-3 border border-gray-3 hover:bg-gray-1'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-9 px-3 rounded-lg border border-gray-3 text-dark-3 text-sm hover:bg-gray-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RequestList
