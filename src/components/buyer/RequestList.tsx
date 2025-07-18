// src/components/buyer/RequestList.tsx
import React, { useEffect, useState, useCallback } from 'react'
import {
  getBuyerActiveRequestsAll,
  getBuyerRequestHistoryAll,
} from '@/lib/orderBidsApis'
import RequestCard from './RequestCard'
import RequestWithOffersCard from './RequestWithOffersCard'

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
  const [showFilters, setShowFilters] = useState(false) // ← toggle filters panel
  const [currentPage, setCurrentPage] = useState(1)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(false)

    const fn =
      mode === 'active'
        ? getBuyerActiveRequestsAll
        : getBuyerRequestHistoryAll

    fn()
      .then((res) => {
        setData(res.data)
        setCurrentPage(1)
      })
      .catch((err) => {
        console.error(err)
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [mode])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset page when filters/search/mode change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, startDate, endDate, mode])

  const CardComponent =
    mode === 'active' ? RequestWithOffersCard : RequestCard

  const filteredData = data.filter((req) => {
    // Search filter
    if (searchTerm.trim()) {
      const blob = JSON.stringify(req).toLowerCase()
      if (!blob.includes(searchTerm.toLowerCase().trim())) return false
    }
    // Date filter
    const created = new Date(req.createdAt)
    if (startDate) {
      const from = new Date(startDate + 'T00:00:00')
      if (created < from) return false
    }
    if (endDate) {
      const to = new Date(endDate + 'T23:59:59')
      if (created > to) return false
    }
    return true
  })

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <img
          src="/spepasLogo.gif"
          alt="SpePas Loading"
          className="w-12 h-12"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-600">
          Something went wrong loading requests.
        </p>
        <button
          onClick={fetchData}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No {mode === 'active' ? 'active' : 'historical'} requests.
      </p>
    )
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-0">
      {/* Search + Filters toggle */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-4 space-y-4 lg:space-y-0">
        {/* Search input */}
        <div className="w-full lg:w-1/2">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full
              max-w-md
              border border-gray-300
              rounded-lg
              px-4 py-2
              text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition
            "
          />
        </div>

        {/* Filters button */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="
            flex items-center
            bg-gray-100 hover:bg-gray-200
            text-gray-700
            text-sm font-medium
            px-3 py-2
            rounded-lg
            transition
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-.447.894l-4 2.667A1 1 0 019 21.667v-9.253L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Collapsible Filters panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 max-w-lg mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="
                  w-full
                  border border-gray-300
                  rounded-lg
                  px-3 py-2
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  transition
                "
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="
                  w-full
                  border border-gray-300
                  rounded-lg
                  px-3 py-2
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  transition
                "
              />
            </div>
          </div>
        </div>
      )}

      {/* If no matches after filtering */}
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No requests match your criteria.
        </p>
      ) : (
        <>
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-4 sm:gap-6 lg:gap-8
            "
          >
            {paginatedData.map((req) => (
              <CardComponent key={req.request_ID} req={req} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`
                px-3 py-1 rounded-md
                ${currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'}
              `}
            >
              Prev
            </button>

            {Array.from({ length: Math.ceil(filteredData.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`
                  px-3 py-1 rounded-md
                  ${num === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
                `}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`
                px-3 py-1 rounded-md
                ${currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'}
              `}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default RequestList
