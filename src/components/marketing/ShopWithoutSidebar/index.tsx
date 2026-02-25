import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Breadcrumb from '../Common/Breadcrumb';
import SingleGridItem from '../Shop/SingleGridItem';
import SingleListItem from '../Shop/SingleListItem';

import {
  getSpareParts,
  getSparePartCategories,
  getCarYears,
  getCarManufacturers,
  getCarBrands,
} from '@/lib/inventoryApis';

import { ProductVM } from '../Shop/shopTypes';

type ViewMode = 'grid' | 'list';

const PAGE_SIZE = 48;

// ── Pagination helper ──────────────────────────────────────────────────────
function pageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}

// ── Component ──────────────────────────────────────────────────────────────
const ShopWithoutSidebar: React.FC = () => {
  // View
  const [view, setView] = useState<ViewMode>('grid');

  // Vehicle selector
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>(''); // brand = model line

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // ══════════════════════════════════════════════════════════════════════════
  // Queries — vehicle cascade
  // ══════════════════════════════════════════════════════════════════════════
  const { data: yearsData, isLoading: yearsLoading } = useQuery({
    queryKey: ['car-years'],
    queryFn: getCarYears,
    staleTime: 10 * 60_000,
  });

  const mfrFilters = useMemo(
    () => (selectedYear ? { year: selectedYear } : undefined),
    [selectedYear]
  );
  const { data: manufacturersData, isLoading: makesLoading } = useQuery({
    queryKey: ['car-manufacturers', mfrFilters],
    queryFn: () => getCarManufacturers(mfrFilters),
    staleTime: 10 * 60_000,
    enabled: !!selectedYear,
  });

  const brandFilters = useMemo(
    () => ({
      ...(selectedYear ? { year: selectedYear } : {}),
      ...(selectedMake ? { manufacturerId: selectedMake } : {}),
    }),
    [selectedYear, selectedMake]
  );
  const { data: brandsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['car-brands', brandFilters],
    queryFn: () => getCarBrands(brandFilters),
    staleTime: 10 * 60_000,
    enabled: !!selectedMake,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Cascade derived options
  // ══════════════════════════════════════════════════════════════════════════
  const yearOptions = useMemo(() => {
    return (yearsData?.data ?? []).map((y) => String(y));
  }, [yearsData]);

  const makeOptions = useMemo(() => {
    return manufacturersData?.data ?? [];
  }, [manufacturersData]);

  const modelOptions = useMemo(() => {
    return brandsData?.data ?? [];
  }, [brandsData]);

  // ══════════════════════════════════════════════════════════════════════════
  // Queries — categories (scoped to selected brand)
  // ══════════════════════════════════════════════════════════════════════════
  const categoryFilters = useMemo(
    () => (selectedModel ? { brandId: selectedModel } : undefined),
    [selectedModel]
  );

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ['sparepart-categories', categoryFilters],
    queryFn: () => getSparePartCategories(categoryFilters),
    staleTime: 5 * 60_000,
    enabled: !!selectedModel,
  });

  // Group categories by parent
  const categoryGroups = useMemo(() => {
    const list = categoriesData?.data ?? [];
    const groups = new Map<
      string | null,
      Array<{ Category_ID: string; name: string; count?: number; parent_ID: string | null }>
    >();
    for (const cat of list) {
      const key = cat.parent_ID ?? null;
      const arr = groups.get(key) ?? [];
      arr.push(cat);
      groups.set(key, arr);
    }
    return groups;
  }, [categoriesData]);

  // Top-level parents first, then their children
  const orderedCategories = useMemo(() => {
    const topLevel = categoryGroups.get(null) ?? [];
    const result: Array<{
      Category_ID: string;
      name: string;
      count?: number;
      isParent: boolean;
    }> = [];
    for (const parent of topLevel) {
      result.push({ ...parent, isParent: true });
      const children = categoryGroups.get(parent.Category_ID) ?? [];
      for (const child of children) {
        result.push({ ...child, isParent: false });
      }
    }
    // Also include categories with no parent grouping (flat list from real API)
    if (topLevel.length === 0) {
      const list = categoriesData?.data ?? [];
      for (const cat of list) {
        result.push({ ...cat, isParent: false });
      }
    }
    return result;
  }, [categoryGroups, categoriesData]);

  // ══════════════════════════════════════════════════════════════════════════
  // Query — parts (server-side filtered + paginated)
  // ══════════════════════════════════════════════════════════════════════════
  const partsFilters = useMemo(
    () => ({
      ...(selectedModel ? { brandId: selectedModel } : {}),
      ...(selectedCategory ? { categoryId: selectedCategory } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    [selectedModel, selectedCategory, search, page]
  );

  const vehicleSelected = !!selectedModel;

  const {
    data: partsData,
    isLoading: partsLoading,
    isError: partsError,
  } = useQuery({
    queryKey: ['spareparts', partsFilters],
    queryFn: () => getSpareParts(partsFilters),
    staleTime: 60_000,
    enabled: vehicleSelected,
  });

  const total = partsData?.total ?? partsData?.data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const items: ProductVM[] = useMemo(() => {
    return (partsData?.data ?? []).map((sp: any) => ({
      linkId: String(sp.id ?? sp.SparePart_ID ?? ''),
      title: sp.name,
      image:
        sp.images?.find((i: any) => !!i?.image_url)?.image_url ??
        '/images/placeholder.jpg',
    }));
  }, [partsData]);

  // ══════════════════════════════════════════════════════════════════════════
  // Filter chips
  // ══════════════════════════════════════════════════════════════════════════
  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; onClear: () => void }[] = [];
    if (selectedCategory) {
      const catName =
        categoriesData?.data?.find((c) => c.Category_ID === selectedCategory)?.name ?? 'Category';
      chips.push({
        key: 'category',
        label: catName,
        onClear: () => { setSelectedCategory(''); setPage(1); },
      });
    }
    if (search.trim()) {
      chips.push({
        key: 'search',
        label: `"${search.trim()}"`,
        onClear: () => { setSearch(''); setPage(1); },
      });
    }
    return chips;
  }, [selectedCategory, search, categoriesData]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSearch('');
    setPage(1);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Cascade change handlers (reset children)
  // ══════════════════════════════════════════════════════════════════════════
  const onChangeYear = (val: string) => {
    setSelectedYear(val);
    setSelectedMake('');
    setSelectedModel('');
    setSelectedCategory('');
    setPage(1);
  };
  const onChangeMake = (val: string) => {
    setSelectedMake(val);
    setSelectedModel('');
    setSelectedCategory('');
    setPage(1);
  };
  const onChangeModel = (val: string) => {
    setSelectedModel(val);
    setSelectedCategory('');
    setPage(1);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Render
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <Breadcrumb title="Explore All Products" pages={['shop']} />

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Vehicle selector ──────────────────────────────────── */}
          <div className="bg-white rounded-xl px-6 py-5 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Select your vehicle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Year */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => onChangeYear(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                  disabled={yearsLoading}
                >
                  <option value="">All years</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Make */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Make
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => onChangeMake(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                  disabled={makesLoading || !selectedYear}
                >
                  <option value="">
                    {selectedYear ? 'All makes' : 'Select a year first'}
                  </option>
                  {makeOptions.map((m: any) => (
                    <option key={m.Manufacturer_ID} value={m.Manufacturer_ID}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => onChangeModel(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                  disabled={modelsLoading || !selectedMake}
                >
                  <option value="">
                    {selectedMake ? 'All models' : 'Select a make first'}
                  </option>
                  {modelOptions.map((b: any) => (
                    <option key={b.CarBrand_ID} value={b.CarBrand_ID}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Main layout: sidebar + content ────────────────────── */}
          <div className="flex gap-6">
            {/* Sidebar — categories (hidden until vehicle selected) */}
            <aside className={`w-64 shrink-0 ${vehicleSelected ? 'hidden lg:block' : 'hidden'}`}>
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Categories
                </h3>

                {/* All parts button */}
                <button
                  onClick={() => { setSelectedCategory(''); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                    !selectedCategory
                      ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All parts
                  {total > 0 && !selectedCategory && (
                    <span className="float-right text-xs text-gray-400">
                      {total}
                    </span>
                  )}
                </button>

                {categoriesLoading && (
                  <div className="space-y-2 mt-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                )}

                {!categoriesLoading && orderedCategories.map((cat) => (
                  <button
                    key={cat.Category_ID}
                    onClick={() => { setSelectedCategory(cat.Category_ID); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      cat.isParent ? 'font-medium mt-2' : 'pl-6'
                    } ${
                      selectedCategory === cat.Category_ID
                        ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                    {cat.count != null && cat.count > 0 && (
                      <span className="float-right text-xs text-gray-400">
                        {cat.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Search + view toggle + filter chips (hidden until vehicle selected) */}
              {vehicleSelected && <div className="flex flex-col gap-3 mb-6">
                {/* Row: search, result count, view toggle */}
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search parts…"
                        className="h-10 w-56 sm:w-64 rounded-lg border border-gray-200 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                      />
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m1.1-4.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
                        />
                      </svg>
                    </div>

                    <span className="text-sm text-gray-500 hidden sm:inline">
                      {total} result{total !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* View toggle */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setView('grid')}
                      className={`p-2 ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      aria-label="Grid view"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={`p-2 ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      aria-label="List view"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 5.25h16.5m-16.5-10.5h16.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Filter chips */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {activeFilters.map((chip) => (
                      <span
                        key={chip.key}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-sm"
                      >
                        {chip.label}
                        <button
                          onClick={chip.onClear}
                          className="ml-0.5 hover:text-[var(--color-primary-900)]"
                          aria-label={`Remove ${chip.label} filter`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {activeFilters.length > 1 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                )}

                {/* Mobile category selector (visible on small screens) */}
                <div className="lg:hidden">
                  <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                    className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                  >
                    <option value="">All categories</option>
                    {orderedCategories.map((cat) => (
                      <option key={cat.Category_ID} value={cat.Category_ID}>
                        {cat.isParent ? cat.name : `  ${cat.name}`}
                        {cat.count != null ? ` (${cat.count})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>}

              {/* Loading skeleton */}
              {partsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-lg h-60" />
                  ))}
                </div>
              )}

              {/* Error state */}
              {partsError && (
                <div className="text-center text-red-600 py-12">
                  Failed to load products.
                </div>
              )}

              {/* Prompt to select vehicle */}
              {!vehicleSelected && (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg font-medium mb-1">Select your vehicle to get started</p>
                  <p className="text-sm">
                    Choose a year, make, and model above to browse available parts.
                  </p>
                </div>
              )}

              {/* Empty state */}
              {vehicleSelected && !partsLoading && !partsError && items.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg font-medium mb-1">No parts found</p>
                  <p className="text-sm">
                    Try adjusting your vehicle selection or clearing filters.
                  </p>
                </div>
              )}

              {/* Product grid / list */}
              {!partsLoading && !partsError && items.length > 0 && (
                <>
                  <div
                    className={
                      view === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'flex flex-col gap-4'
                    }
                  >
                    {items.map((item) =>
                      view === 'grid' ? (
                        <SingleGridItem item={item} key={item.linkId} />
                      ) : (
                        <SingleListItem item={item} key={item.linkId} />
                      )
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="flex justify-center items-center gap-1 mt-10">
                      <button
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-2 rounded-lg text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                      >
                        Prev
                      </button>

                      {pageNumbers(page, totalPages).map((p, idx) =>
                        p === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                            &hellip;
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-2 rounded-lg text-sm border ${
                              p === page
                                ? 'bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}

                      <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-2 rounded-lg text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;
