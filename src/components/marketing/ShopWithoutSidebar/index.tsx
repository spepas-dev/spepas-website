import React, { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

import Breadcrumb from '../Common/Breadcrumb'
import SingleGridItem from '../Shop/SingleGridItem'
import SingleListItem from '../Shop/SingleListItem'
import ShopFilters from './ShopFilters'
import type { ShopFiltersProps, SelectedFilter } from './ShopFilters'
import { ProductVM } from '../Shop/shopTypes'

import { getSpareParts } from '@/lib/inventoryApis'
import SpepasLoader from '@/components/common/SpepasLoader'

const LIMIT_OPTIONS = [15, 30, 60]

function compactNumber(n: number): string {
  if (n < 1_000) return String(n)
  if (n < 10_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  if (n < 1_000_000) return Math.round(n / 1_000) + 'k'
  return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
}

const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Oldest', value: 'oldest' },
]

type ViewMode = 'grid' | 'list'

/* ── debounce hook ── */
function useDebounce(value: string, ms = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

const ShopWithoutSidebar: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('q') ?? ''

  /* ── state ── */
  const [view, setView] = useState<ViewMode>('grid')
  const [sort, setSort] = useState('latest')
  const [search, setSearch] = useState(initialSearch)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // filter selections
  const [selectedCategory, setSelectedCategory] = useState<SelectedFilter>(null)
  const [selectedManufacturer, setSelectedManufacturer] = useState<SelectedFilter>(null)
  const [selectedBrand, setSelectedBrand] = useState<SelectedFilter>(null)
  const [selectedModel, setSelectedModel] = useState<SelectedFilter>(null)

  const debouncedSearch = useDebounce(search, 400)

  // Combine text search + filter names into one API search string
  const combinedSearch = React.useMemo(() => {
    const parts: string[] = []
    if (debouncedSearch.trim()) parts.push(debouncedSearch.trim())
    if (selectedCategory) parts.push(selectedCategory.name)
    if (selectedManufacturer) parts.push(selectedManufacturer.name)
    if (selectedBrand) parts.push(selectedBrand.name)
    if (selectedModel) parts.push(selectedModel.name)
    return parts.join(' ')
  }, [debouncedSearch, selectedCategory, selectedManufacturer, selectedBrand, selectedModel])

  /* ── spare parts query (server-side paginated + searchable) ── */
  const {
    data: partsResponse,
    isLoading: partsLoading,
    isError: partsError,
    error: partsErr,
  } = useQuery({
    queryKey: ['spareparts', { page, limit, search: combinedSearch }],
    queryFn: () => getSpareParts({ page, limit, search: combinedSearch || undefined }),
    staleTime: 30_000,
  })

  /* ── log API errors ── */
  useEffect(() => {
    if (partsErr) console.error('[Shop] sparepart-all error:', partsErr)
  }, [partsErr])

  /* ── log successful responses ── */
  useEffect(() => {
    if (partsResponse) {
      console.log('[Shop] sparepart-all response:', {
        items: partsResponse.data?.length ?? 0,
        meta: partsResponse.meta,
      })
    }
  }, [partsResponse])

  /* ── transform + client-side sort ── */
  const items: ProductVM[] = React.useMemo(() => {
    let raw = partsResponse?.data ?? []

    // client-side sort on current page
    if (sort === 'latest') raw = [...raw].sort((a: any, b: any) => String(b?.createdAt ?? '').localeCompare(String(a?.createdAt ?? '')))
    else if (sort === 'oldest') raw = [...raw].sort((a: any, b: any) => String(a?.createdAt ?? '').localeCompare(String(b?.createdAt ?? '')))
    else if (sort === 'price-asc') raw = [...raw].sort((a: any, b: any) => (a.price ?? 0) - (b.price ?? 0))
    else if (sort === 'price-desc') raw = [...raw].sort((a: any, b: any) => (b.price ?? 0) - (a.price ?? 0))

    return raw.map((sp: any) => ({
      linkId: String(sp.id ?? sp.SparePart_ID ?? ''),
      title: sp.name,
      price: sp.price ?? 0,
      reviews: 0,
      image: sp.images?.find((i: any) => !!i?.image_url)?.image_url ?? '/images/placeholder.jpg',
    }))
  }, [partsResponse, sort])

  /* ── pagination from API meta ── */
  const meta = partsResponse?.meta
  const totalPages = meta?.totalPages ?? 1
  const totalItems = meta?.total ?? items.length

  /* ── reset page when search, filters, or limit changes ── */
  useEffect(() => { setPage(1) }, [combinedSearch, limit])

  /* ── filter handlers ── */
  const clearFilters = useCallback(() => {
    setSelectedCategory(null)
    setSelectedManufacturer(null)
    setSelectedBrand(null)
    setSelectedModel(null)
    setSearch('')
    setSort('latest')
    setPage(1)
  }, [])

  /* ── active filter chips ── */
  const activeChips: { label: string; onRemove: () => void }[] = React.useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = []
    if (selectedCategory) chips.push({ label: selectedCategory.name, onRemove: () => setSelectedCategory(null) })
    if (selectedManufacturer) chips.push({ label: selectedManufacturer.name, onRemove: () => { setSelectedManufacturer(null); setSelectedBrand(null); setSelectedModel(null) } })
    if (selectedBrand) chips.push({ label: selectedBrand.name, onRemove: () => { setSelectedBrand(null); setSelectedModel(null) } })
    if (selectedModel) chips.push({ label: selectedModel.name, onRemove: () => setSelectedModel(null) })
    if (search.trim()) chips.push({ label: `"${search}"`, onRemove: () => setSearch('') })
    return chips
  }, [selectedCategory, selectedManufacturer, selectedBrand, selectedModel, search])

  /* ── shared filter props ── */
  const filterProps: ShopFiltersProps = {
    selectedCategory,
    selectedManufacturer,
    selectedBrand,
    selectedModel,
    onCategoryChange: setSelectedCategory,
    onManufacturerChange: (f) => { setSelectedManufacturer(f); if (!f) { setSelectedBrand(null); setSelectedModel(null) } },
    onBrandChange: (f) => { setSelectedBrand(f); if (!f) setSelectedModel(null) },
    onModelChange: setSelectedModel,
    onClearAll: clearFilters,
  }

  return (
    <>
      <Breadcrumb title="Shop" pages={['shop']} />

      <section className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-6 sm:py-8 lg:py-10">
        <div className="flex gap-6 lg:gap-8">
          {/* ═══ Desktop sidebar ═══ */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-3/50 shadow-1 p-5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
              <ShopFilters {...filterProps} />
            </div>
          </aside>

          {/* ═══ Main content ═══ */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Mobile filter trigger */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 h-10 px-4 text-sm font-medium text-dark bg-white border border-gray-3 rounded-lg hover:border-blue/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>

              {/* Search */}
              <div className="relative flex-1 min-w-[180px] max-w-sm">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search parts..."
                  className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-gray-3 rounded-lg focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-colors search-clear-button-hide"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-4 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Spacer */}
              <div className="hidden sm:block flex-1" />

              {/* Result count */}
              <span className="text-sm text-dark-4 hidden sm:block">
                {compactNumber(totalItems)} result{totalItems !== 1 ? 's' : ''}
              </span>

              {/* Per-page limit */}
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="h-10 px-3 pr-8 text-sm border border-gray-3 rounded-lg bg-white text-dark focus:outline-none focus:border-blue transition-colors"
              >
                {LIMIT_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} / page</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 px-3 pr-8 text-sm border border-gray-3 rounded-lg bg-white text-dark focus:outline-none focus:border-blue transition-colors"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* View toggle */}
              <div className="hidden sm:flex border border-gray-3 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-blue text-white' : 'bg-white text-dark-4 hover:bg-gray-1'}`}
                  aria-label="Grid view"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2.5 transition-colors ${view === 'list' ? 'bg-blue text-white' : 'bg-white text-dark-4 hover:bg-gray-1'}`}
                  aria-label="List view"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {activeChips.map((chip, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue/10 text-blue rounded-full pl-3 pr-1.5 py-1.5"
                  >
                    {chip.label}
                    <button
                      onClick={chip.onRemove}
                      className="w-4 h-4 rounded-full bg-blue/20 hover:bg-blue/30 flex items-center justify-center transition-colors"
                      aria-label={`Remove ${chip.label} filter`}
                    >
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-dark-4 hover:text-blue transition-colors ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Mobile result count */}
            <p className="text-sm text-dark-4 mb-3 sm:hidden">
              {compactNumber(totalItems)} result{totalItems !== 1 ? 's' : ''}
            </p>

            {/* Loading */}
            {partsLoading && (
              <SpepasLoader size="lg" label="Loading products..." fullSection />
            )}

            {/* Error */}
            {partsError && (
              <div className="text-center py-20">
                <svg className="w-12 h-12 text-dark-4 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-dark-3 font-medium">Failed to load products</p>
                <p className="text-sm text-dark-4 mt-1">Please try refreshing the page.</p>
              </div>
            )}

            {/* Product grid / list */}
            {!partsLoading && !partsError && (
              <>
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <svg className="w-12 h-12 text-dark-4 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <p className="text-dark-3 font-medium">No products found</p>
                    <p className="text-sm text-dark-4 mt-1">Try adjusting your search term.</p>
                    <button onClick={clearFilters} className="mt-4 text-sm font-medium text-blue hover:text-blue-dark transition-colors">
                      Clear all filters
                    </button>
                  </div>
                ) : view === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {items.map((item) => (
                      <SingleGridItem item={item} key={item.linkId} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {items.map((item) => (
                      <SingleListItem item={item} key={item.linkId} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-3 mt-8">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center justify-center h-9 px-3 rounded-lg border border-gray-3 text-dark-3 text-sm hover:bg-gray-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                      </button>

                      <span className="text-sm text-dark-4 px-3">
                        {page} / {compactNumber(totalPages)}
                      </span>

                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center justify-center h-9 px-3 rounded-lg border border-gray-3 text-dark-3 text-sm hover:bg-gray-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Mobile filter drawer ═══ */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-99999 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-3">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-3/50 flex-shrink-0">
              <h3 className="font-semibold text-dark text-lg">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-1 transition-colors"
              >
                <svg className="w-5 h-5 text-dark-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ShopFilters {...filterProps} />
            </div>
            <div className="flex gap-3 px-5 py-4 border-t border-gray-3/50 flex-shrink-0">
              <button
                onClick={() => { clearFilters(); setMobileFiltersOpen(false) }}
                className="flex-1 h-11 text-sm font-medium rounded-lg border border-gray-3 text-dark hover:bg-gray-1 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 h-11 text-sm font-medium rounded-lg bg-blue text-white hover:bg-blue-dark transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


export default ShopWithoutSidebar
