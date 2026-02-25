import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { requestNonInventorySparePartAPI } from '@/lib/orderBidsApis'
import {
  getSparePartCategories,
  getCarManufacturers,
  getCarBrands,
  getCarModels,
} from '@/lib/inventoryApis'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Send } from 'lucide-react'

/* ─── types ─── */
type SelectedFilter = { id: string; name: string } | null

/* ─── debounce hook ─── */
function useDebounce(value: string, ms = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

/* ─── icons ─── */
const SearchIcon: React.FC = () => (
  <svg
    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-4 pointer-events-none"
    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

/* ─── searchable filter field (form-adapted) ─── */
const SearchableFilter: React.FC<{
  label: string
  selected: SelectedFilter
  onSelect: (f: SelectedFilter) => void
  queryKey: string
  queryFn: (params: { search?: string; limit?: number }) => Promise<{ data: any[]; meta?: any }>
  idKey: string
  nameKey: string
  placeholder: string
  required?: boolean
  getCount?: (item: any) => number | undefined
}> = ({ label, selected, onSelect, queryKey, queryFn, idKey, nameKey, placeholder, required, getCount }) => {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce(input, 300)

  const isSearching = debouncedSearch.trim().length >= 2

  // default results when focused (no search term)
  const { data: defaultData, isFetching: defaultFetching } = useQuery({
    queryKey: [queryKey, '__defaults__'],
    queryFn: () => queryFn({ limit: 15 }),
    staleTime: 60_000,
    enabled: isFocused && !isSearching && !selected,
  })

  // search results when 2+ chars typed
  const { data: searchData, isFetching: searchFetching } = useQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: () => queryFn({ search: debouncedSearch.trim(), limit: 20 }),
    enabled: isSearching,
    staleTime: 30_000,
  })

  const results = isSearching ? (searchData?.data ?? []) : (defaultData?.data ?? [])
  const isFetching = isSearching ? searchFetching : defaultFetching
  const showDropdown = isFocused && !selected

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (item: any) => {
    onSelect({ id: item[idKey], name: item[nameKey] })
    setInput('')
    setIsFocused(false)
  }

  const handleClear = () => {
    onSelect(null)
    setInput('')
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block mb-2 text-sm font-medium text-dark">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* selected chip */}
      {selected ? (
        <div className="flex items-center gap-2 h-11 px-4 bg-blue/5 border border-blue/20 rounded-lg">
          <span className="text-sm text-dark truncate flex-1">{selected.name}</span>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-5 h-5 rounded-full bg-blue/20 hover:bg-blue/30 flex items-center justify-center transition-colors"
            aria-label={`Clear ${label}`}
          >
            <svg className="w-3 h-3 text-blue" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full h-11 pl-10 pr-4 text-sm border border-gray-3 rounded-lg bg-gray-1 text-dark placeholder:text-dark-5 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition"
          />
          <SearchIcon />
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-dark-4/20 hover:bg-dark-4/30 flex items-center justify-center transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-3 h-3 text-dark-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* dropdown results */}
      {showDropdown && (
        <div className="absolute left-0 right-0 z-30 mt-1 border border-gray-3 rounded-lg bg-white shadow-2 max-h-[220px] overflow-y-auto scrollbar-hide">
          {isFetching ? (
            <div className="px-3 py-5 text-center">
              <img src="/spepasLogo.gif" alt="Loading..." className="h-8 w-8 object-contain mx-auto" />
              <p className="text-xs text-dark-4 mt-1.5">{isSearching ? 'Searching...' : 'Loading...'}</p>
            </div>
          ) : results.length === 0 ? (
            <p className="text-sm text-dark-4 px-3 py-4 text-center">
              {isSearching ? `No results for "${debouncedSearch}"` : 'No items available'}
            </p>
          ) : (
            <>
              {!isSearching && (
                <p className="text-[10px] text-dark-4 px-3 pt-2.5 pb-1 uppercase tracking-wide font-medium">Popular</p>
              )}
              {results.map((item: any) => {
                const count = getCount?.(item)
                return (
                  <button
                    key={item[idKey]}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center justify-between text-sm px-3 py-2.5 hover:bg-gray-1 transition-colors text-left gap-2"
                  >
                    <span className="truncate text-dark">{item[nameKey]}</span>
                    {count != null && count > 0 && (
                      <span className="shrink-0 text-[10px] font-medium text-dark-4 bg-gray-2 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                        {count > 999 ? '999+' : count}
                      </span>
                    )}
                  </button>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══ MAIN FORM ═══ */
const PostRequestForm: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SelectedFilter>(null)
  const [selectedManufacturer, setSelectedManufacturer] = useState<SelectedFilter>(null)
  const [selectedBrand, setSelectedBrand] = useState<SelectedFilter>(null)
  const [selectedModel, setSelectedModel] = useState<SelectedFilter>(null)

  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [desc, setDesc] = useState('')
  const [requireImage, setRequireImage] = useState(false)

  const navigate = useNavigate()

  const qtyInvalid = qty <= 0

  /* count extractors from nested API data */
  const countManufacturer = useCallback((m: any): number | undefined => {
    const brands = m?.brands
    if (!Array.isArray(brands)) return undefined
    return brands.reduce((sum: number, b: any) =>
      sum + (b?.models?.reduce((s: number, md: any) => s + (md?.spareParts?.length ?? 0), 0) ?? 0), 0)
  }, [])

  const countBrand = useCallback((b: any): number | undefined => {
    const models = b?.models
    if (!Array.isArray(models)) return undefined
    return models.reduce((sum: number, m: any) => sum + (m?.spareParts?.length ?? 0), 0)
  }, [])

  const countModel = useCallback((m: any): number | undefined => {
    const parts = m?.spareParts
    if (!Array.isArray(parts)) return undefined
    return parts.length
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (qtyInvalid || !selectedModel) return

    const apiPromise = requestNonInventorySparePartAPI({
      require_image: requireImage ? 1 : 0,
      quantity: qty,
      sparePartDetail: {
        name,
        description: desc,
        carModel_ID: selectedModel.id,
      },
    })

    toast
      .promise(
        apiPromise,
        {
          loading: 'Posting your request...',
          success: 'Request posted!',
          error: 'Failed to post request. Please try again.',
        },
        { duration: 3000, position: 'bottom-center' }
      )
      .then(() => {
        setName('')
        setQty(1)
        setDesc('')
        setRequireImage(false)
        setSelectedCategory(null)
        setSelectedManufacturer(null)
        setSelectedBrand(null)
        setSelectedModel(null)
        navigate('/95668339501103956045/buyer/requests')
      })
      .catch(() => {})
  }

  const inputClasses = 'w-full h-11 rounded-lg border border-gray-3 bg-gray-1 px-4 text-sm text-dark placeholder:text-dark-5 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition'

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <button
          type="button"
          onClick={() => navigate('/95668339501103956045/buyer/requests')}
          className="inline-flex items-center gap-2 bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
        >
          <ClipboardList className="h-4 w-4" />
          My Requests
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-7 space-y-5"
      >
        {/* Row 1: Category */}
        <SearchableFilter
          label="Category"
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          queryKey="form-categories"
          queryFn={getSparePartCategories}
          idKey="Category_ID"
          nameKey="name"
          placeholder="Search spare part categories..."
        />

        {/* Row 2: Manufacturer & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SearchableFilter
            label="Manufacturer"
            selected={selectedManufacturer}
            onSelect={(f) => {
              setSelectedManufacturer(f)
              if (!f) { setSelectedBrand(null); setSelectedModel(null) }
            }}
            queryKey="form-manufacturers"
            queryFn={getCarManufacturers}
            idKey="Manufacturer_ID"
            nameKey="name"
            placeholder="Search manufacturers..."
            required
            getCount={countManufacturer}
          />

          <SearchableFilter
            label="Brand"
            selected={selectedBrand}
            onSelect={(f) => {
              setSelectedBrand(f)
              if (!f) setSelectedModel(null)
            }}
            queryKey="form-brands"
            queryFn={getCarBrands}
            idKey="CarBrand_ID"
            nameKey="name"
            placeholder="Search brands..."
            required
            getCount={countBrand}
          />
        </div>

        {/* Row 3: Model & Part Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SearchableFilter
            label="Model"
            selected={selectedModel}
            onSelect={setSelectedModel}
            queryKey="form-models"
            queryFn={getCarModels}
            idKey="CarModel_ID"
            nameKey="name"
            placeholder="Search models..."
            required
            getCount={countModel}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-dark">
              Part Name<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. Brake pad, Radiator"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Row 4: Quantity & Photos Required */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          <div>
            <label className="block mb-2 text-sm font-medium text-dark">
              Quantity<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="number"
              value={qty}
              onChange={e => setQty(+e.target.value)}
              min={1}
              required
              aria-invalid={qtyInvalid}
              className={`${inputClasses} ${qtyInvalid ? '!border-red-400 !focus:border-red-400 !focus:ring-red-400/20' : ''}`}
            />
            {qtyInvalid && (
              <p className="mt-1.5 text-xs text-red-500">Quantity must be at least 1</p>
            )}
          </div>

          <div className="flex items-center gap-2.5 h-11">
            <input
              type="checkbox"
              checked={requireImage}
              onChange={e => setRequireImage(e.target.checked)}
              id="reqImg"
              className="h-4 w-4 rounded border-gray-3 text-blue focus:ring-blue/20"
            />
            <label htmlFor="reqImg" className="text-sm font-medium text-dark">
              Require photos from sellers
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium text-dark">Description</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={4}
            placeholder="Describe the part you need..."
            className="w-full rounded-lg border border-gray-3 bg-gray-1 px-4 py-3 text-sm text-dark placeholder:text-dark-5 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={qtyInvalid || !selectedModel}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue text-white font-medium text-sm py-3 px-8 rounded-xl hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Send className="h-4 w-4" />
          Post Request
        </button>
      </form>
    </>
  )
}

export default PostRequestForm
