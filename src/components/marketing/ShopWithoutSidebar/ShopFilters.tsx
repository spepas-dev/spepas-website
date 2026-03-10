import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getSparePartCategories,
  getCarManufacturers,
  getCarBrands,
  getCarModels,
} from '@/lib/inventoryApis'

/* ─── types ─── */
export type SelectedFilter = { id: string; name: string } | null

export type ShopFiltersProps = {
  selectedCategory: SelectedFilter
  selectedManufacturer: SelectedFilter
  selectedBrand: SelectedFilter
  selectedModel: SelectedFilter
  onCategoryChange: (f: SelectedFilter) => void
  onManufacturerChange: (f: SelectedFilter) => void
  onBrandChange: (f: SelectedFilter) => void
  onModelChange: (f: SelectedFilter) => void
  onClearAll: () => void
}

/* ─── icons ─── */
const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`w-4 h-4 text-dark-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const SearchIcon: React.FC = () => (
  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-4 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const ClearIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-dark-4/20 hover:bg-dark-4/30 flex items-center justify-center transition-colors"
    aria-label="Clear"
  >
    <svg className="w-2.5 h-2.5 text-dark-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
)

/* ─── collapsible section ─── */
const Section: React.FC<{
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}> = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-3/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3.5 text-sm font-semibold text-dark hover:text-blue transition-colors"
      >
        {title}
        <Chevron open={open} />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[800px] pb-4' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  )
}

/* ─── debounce hook ─── */
function useDebounce(value: string, ms = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

/* ─── searchable filter field ─── */
const SearchableFilter: React.FC<{
  label: string
  selected: SelectedFilter
  onSelect: (f: SelectedFilter) => void
  queryKey: string
  queryFn: (params: { search?: string; limit?: number }) => Promise<{ data: any[]; meta?: any }>
  idKey: string
  nameKey: string
  placeholder: string
  getCount?: (item: any) => number | undefined
}> = ({ label, selected, onSelect, queryKey, queryFn, idKey, nameKey, placeholder, getCount }) => {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce(input, 300)

  const isSearching = debouncedSearch.trim().length >= 2

  // default results: fetch page 1 when focused (no search term)
  const { data: defaultData, isFetching: defaultFetching, error: defaultError } = useQuery({
    queryKey: [queryKey, '__defaults__'],
    queryFn: () => queryFn({ limit: 15 }),
    staleTime: 60_000,
    enabled: isFocused && !isSearching && !selected,
  })

  // search results: fetch when 2+ chars typed
  const { data: searchData, isFetching: searchFetching, error: searchError } = useQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: () => queryFn({ search: debouncedSearch.trim(), limit: 20 }),
    enabled: isSearching,
    staleTime: 30_000,
  })

  // log errors
  useEffect(() => {
    if (defaultError) console.error(`[ShopFilters] ${queryKey} defaults error:`, defaultError)
    if (searchError) console.error(`[ShopFilters] ${queryKey} search error:`, searchError)
  }, [defaultError, searchError, queryKey])

  // log successful loads
  useEffect(() => {
    if (defaultData) console.log(`[ShopFilters] ${queryKey} defaults loaded:`, defaultData.data?.length ?? 0, 'items')
  }, [defaultData, queryKey])

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
    <div ref={wrapperRef}>
      <label className="block text-xs font-medium text-dark-4 mb-1.5">{label}</label>

      {/* selected chip */}
      {selected ? (
        <div className="flex items-center gap-2 h-9 px-3 bg-blue/5 border border-blue/20 rounded-lg">
          <span className="text-sm text-dark truncate flex-1">{selected.name}</span>
          <button
            onClick={handleClear}
            className="shrink-0 w-4 h-4 rounded-full bg-blue/20 hover:bg-blue/30 flex items-center justify-center transition-colors"
            aria-label={`Clear ${label}`}
          >
            <svg className="w-2.5 h-2.5 text-blue" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
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
            className="w-full h-9 pl-8 pr-8 text-sm border border-gray-3 rounded-lg bg-white focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-colors"
          />
          <SearchIcon />
          {input && <ClearIcon onClick={() => setInput('')} />}
        </div>
      )}

      {/* inline results list (flows inside sidebar scroll) */}
      {showDropdown && (
        <div className="mt-1 border border-gray-3 rounded-lg bg-gray-1/50 max-h-[200px] overflow-y-auto scrollbar-hide">
          {isFetching ? (
            <div className="px-3 py-4 text-center">
              <img src="/spepasLogo.gif" alt="Loading..." className="h-8 w-8 object-contain mx-auto" />
              <p className="text-xs text-dark-4 mt-1">{isSearching ? 'Searching...' : 'Loading...'}</p>
            </div>
          ) : results.length === 0 ? (
            <p className="text-xs text-dark-4 px-3 py-3 text-center">
              {isSearching ? `No results for "${debouncedSearch}"` : 'No items available'}
            </p>
          ) : (
            <>
              {!isSearching && (
                <p className="text-[10px] text-dark-4 px-3 pt-2 pb-1 uppercase tracking-wide">Popular</p>
              )}
              {results.map((item: any) => {
                const count = getCount?.(item)
                return (
                  <button
                    key={item[idKey]}
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center justify-between text-sm px-3 py-2 hover:bg-white rounded transition-colors gap-2"
                  >
                    <span className="truncate">{item[nameKey]}</span>
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

/* ═══ MAIN FILTER COMPONENT ═══ */
const ShopFilters: React.FC<ShopFiltersProps> = ({
  selectedCategory,
  selectedManufacturer,
  selectedBrand,
  selectedModel,
  onCategoryChange,
  onManufacturerChange,
  onBrandChange,
  onModelChange,
  onClearAll,
}) => {
  const hasActiveFilters = selectedCategory || selectedManufacturer || selectedBrand || selectedModel

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

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-3/50 mb-1">
        <h3 className="font-semibold text-dark text-base">Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClearAll} className="text-xs font-medium text-blue hover:text-blue-dark transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <Section title="Categories">
        <SearchableFilter
          label="Category"
          selected={selectedCategory}
          onSelect={onCategoryChange}
          queryKey="filter-categories"
          queryFn={getSparePartCategories}
          idKey="Category_ID"
          nameKey="name"
          placeholder="Search categories..."
        />
      </Section>

      {/* Vehicle */}
      <Section title="Vehicle">
        <div className="space-y-3">
          <SearchableFilter
            label="Manufacturer"
            selected={selectedManufacturer}
            onSelect={(f) => {
              onManufacturerChange(f)
              if (!f) { onBrandChange(null); onModelChange(null) }
            }}
            queryKey="filter-manufacturers"
            queryFn={getCarManufacturers}
            idKey="Manufacturer_ID"
            nameKey="name"
            placeholder="Search manufacturers..."
            getCount={countManufacturer}
          />
          <SearchableFilter
            label="Brand"
            selected={selectedBrand}
            onSelect={(f) => {
              onBrandChange(f)
              if (!f) onModelChange(null)
            }}
            queryKey="filter-brands"
            queryFn={getCarBrands}
            idKey="CarBrand_ID"
            nameKey="name"
            placeholder="Search brands..."
            getCount={countBrand}
          />
          <SearchableFilter
            label="Model"
            selected={selectedModel}
            onSelect={onModelChange}
            queryKey="filter-models"
            queryFn={getCarModels}
            idKey="CarModel_ID"
            nameKey="name"
            placeholder="Search models..."
            getCount={countModel}
          />
        </div>
      </Section>
    </div>
  )
}

export default ShopFilters
