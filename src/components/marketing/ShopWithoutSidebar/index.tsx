import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Breadcrumb from '../Common/Breadcrumb';
import SearchableCombobox from '../Common/SearchableCombobox';
import SingleGridItem from '../Shop/SingleGridItem';
import SingleListItem from '../Shop/SingleListItem';

import {
  getSpareParts,
  getSparePartCategories,
  getCarYears,
  getCarManufacturers,
  getCarBrands,
  getCarModels,
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
  // ── URL-backed state (persists across refresh & back-navigation) ─────────
  const [searchParams, setSearchParams] = useSearchParams();

  const sp = useCallback(
    (key: string) => searchParams.get(key) ?? '',
    [searchParams]
  );

  const selectedYear = sp('year');
  const selectedMake = sp('make');
  const selectedModel = sp('model');
  const selectedFuelType = sp('fuel');
  const selectedBodyType = sp('body');
  const selectedDriveType = sp('drive');
  const selectedEngine = sp('engine');
  const selectedCategory = sp('cat');
  const search = sp('q');
  const page = Math.max(1, parseInt(sp('page') || '1', 10));

  // View mode — keep in local state (not worth persisting in URL)
  const [view, setView] = useState<ViewMode>('grid');

  /** Update one or more URL params. Empty strings are removed from the URL. */
  const updateParams = useCallback(
    (updates: Record<string, string | number>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, val] of Object.entries(updates)) {
          const str = String(val);
          if (str && str !== '0') next.set(key, str);
          else next.delete(key);
        }
        return next;
      }, { replace: true });
    },
    [setSearchParams]
  );

  // Convenience setters that mirror the old setState API
  const setSelectedYear = (v: string) => updateParams({ year: v });
  const setSelectedMake = (v: string) => updateParams({ make: v });
  const setSelectedModel = (v: string) => updateParams({ model: v });
  const setSelectedFuelType = (v: string) => updateParams({ fuel: v });
  const setSelectedBodyType = (v: string) => updateParams({ body: v });
  const setSelectedDriveType = (v: string) => updateParams({ drive: v });
  const setSelectedEngine = (v: string) => updateParams({ engine: v });
  const setSelectedCategory = (v: string) => updateParams({ cat: v });
  const setSearch = (v: string) => updateParams({ q: v });
  const setPage = (v: number) => updateParams({ page: v <= 1 ? '' : String(v) });

  // ══════════════════════════════════════════════════════════════════════════
  // Queries — vehicle cascade
  // ══════════════════════════════════════════════════════════════════════════
  // Years endpoint is local-only — gracefully degrade when it 404s on the live API
  const { data: yearsData, isLoading: yearsLoading, isError: yearsError } = useQuery({
    queryKey: ['car-years'],
    queryFn: getCarYears,
    staleTime: 10 * 60_000,
    retry: false,
  });

  const hasYears = !yearsError && (yearsData?.data?.length ?? 0) > 0;

  const mfrFilters = useMemo(
    () => (selectedYear ? { year: selectedYear } : undefined),
    [selectedYear]
  );
  const { data: manufacturersData, isLoading: makesLoading } = useQuery({
    queryKey: ['car-manufacturers', mfrFilters],
    queryFn: () => getCarManufacturers(mfrFilters),
    staleTime: 10 * 60_000,
    // When years are available, wait for selection; otherwise load immediately
    enabled: hasYears ? !!selectedYear : !yearsLoading,
  });

  // Fetch brands for the selected manufacturer via the dedicated endpoint.
  // Falls back to the manufacturer's inline `brands` array if the endpoint
  // returns unfiltered data (live API workaround — see INV-5).
  const brandFilters = useMemo(
    () => (selectedMake ? { manufacturerId: selectedMake } : undefined),
    [selectedMake]
  );
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['car-brands', brandFilters],
    queryFn: () => getCarBrands(brandFilters),
    staleTime: 10 * 60_000,
    enabled: !!selectedMake,
  });

  const { brandsForMake, modelsLoading } = useMemo(() => {
    if (!selectedMake) return { brandsForMake: [], modelsLoading: false };

    const fromEndpoint = brandsData?.data ?? [];
    if (fromEndpoint.length > 0) {
      // Check if the endpoint actually filtered by manufacturer.
      // The live API's car-brands-all ignores manufacturerId (INV-5) and returns
      // ALL brands. Detect this by checking if the count seems unreasonably large
      // compared to a single manufacturer, and fall back to inline brands.
      const mfr = manufacturersData?.data?.find((m: any) => m.Manufacturer_ID === selectedMake);
      const inlineBrands = mfr?.brands ?? [];
      const totalMfrs = manufacturersData?.data?.length ?? 0;
      if (inlineBrands.length > 0 && fromEndpoint.length > totalMfrs * 2) {
        // Endpoint returned unfiltered data — use inline brands instead
        return { brandsForMake: inlineBrands, modelsLoading: false };
      }
      return { brandsForMake: fromEndpoint, modelsLoading: false };
    }
    // Endpoint returned nothing — try inline brands as fallback
    const mfr = manufacturersData?.data?.find((m: any) => m.Manufacturer_ID === selectedMake);
    return { brandsForMake: mfr?.brands ?? [], modelsLoading: false };
  }, [selectedMake, brandsData, manufacturersData]);

  // ══════════════════════════════════════════════════════════════════════════
  // Query — car model variants (for fuel/body/drive filter values)
  // ══════════════════════════════════════════════════════════════════════════
  const { data: variantsData } = useQuery({
    queryKey: ['car-models-for-filters', selectedModel],
    queryFn: () => getCarModels({ brandId: selectedModel }),
    staleTime: 10 * 60_000,
    enabled: !!selectedModel,
  });

  const fuelTypeOptions = useMemo(() => {
    const variants = variantsData?.data ?? [];
    return [...new Set(variants.map((v: any) => v.fuelType).filter(Boolean))].sort();
  }, [variantsData]);

  const bodyTypeOptions = useMemo(() => {
    const variants = variantsData?.data ?? [];
    return [...new Set(variants.map((v: any) => v.bodyType).filter(Boolean))].sort();
  }, [variantsData]);

  const driveTypeOptions = useMemo(() => {
    const variants = variantsData?.data ?? [];
    return [...new Set(variants.map((v: any) => v.driveType).filter(Boolean))].sort();
  }, [variantsData]);

  const engineOptions = useMemo(() => {
    const variants = variantsData?.data ?? [];
    return [...new Set(variants.map((v: any) => v.name).filter(Boolean))].sort();
  }, [variantsData]);

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
    return brandsForMake;
  }, [brandsForMake]);

  // ══════════════════════════════════════════════════════════════════════════
  // Queries — categories (scoped to selected brand)
  // ══════════════════════════════════════════════════════════════════════════
  const categoryFilters = useMemo(
    () => (selectedModel ? {
      brandId: selectedModel,
      ...(selectedFuelType ? { fuelType: selectedFuelType } : {}),
      ...(selectedBodyType ? { bodyType: selectedBodyType } : {}),
      ...(selectedDriveType ? { driveType: selectedDriveType } : {}),
      ...(selectedEngine ? { engineType: selectedEngine } : {}),
    } : undefined),
    [selectedModel, selectedFuelType, selectedBodyType, selectedDriveType, selectedEngine]
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

  // Build ordered category tree: top-level items first, then children nested under parents.
  // Categories whose parent_ID doesn't match any returned category are promoted to top-level.
  const orderedCategories = useMemo(() => {
    const allCats = categoriesData?.data ?? [];
    const byId = new Map(allCats.map(c => [c.Category_ID, c]));

    const topLevel: typeof allCats = [];
    const childrenOf = new Map<string, typeof allCats>();

    for (const cat of allCats) {
      if (!cat.parent_ID || !byId.has(cat.parent_ID)) {
        // No parent, or parent not in the result set → treat as top-level
        topLevel.push(cat);
      } else {
        const arr = childrenOf.get(cat.parent_ID) ?? [];
        arr.push(cat);
        childrenOf.set(cat.parent_ID, arr);
      }
    }

    // Sort top-level alphabetically
    topLevel.sort((a, b) => a.name.localeCompare(b.name));

    const result: Array<{
      Category_ID: string;
      name: string;
      count?: number;
      isParent: boolean;
      depth: number;
      parentCategoryId?: string;
    }> = [];
    for (const parent of topLevel) {
      const children = childrenOf.get(parent.Category_ID) ?? [];
      result.push({ ...parent, isParent: children.length > 0, depth: 0 });
      children.sort((a, b) => a.name.localeCompare(b.name));
      for (const child of children) {
        result.push({ ...child, isParent: false, depth: 1, parentCategoryId: parent.Category_ID });
      }
    }
    return result;
  }, [categoriesData]);

  // Expand/collapse state for parent categories in the sidebar
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  // Auto-expand the parent of the currently selected category
  const expandedWithActive = useMemo(() => {
    const set = new Set(expandedCategories);
    if (selectedCategory) {
      const selected = orderedCategories.find(c => c.Category_ID === selectedCategory);
      if (selected?.parentCategoryId) {
        set.add(selected.parentCategoryId);
      }
      // If the selected category is itself a parent, expand it
      if (selected?.isParent) {
        set.add(selected.Category_ID);
      }
    }
    return set;
  }, [expandedCategories, selectedCategory, orderedCategories]);

  // ══════════════════════════════════════════════════════════════════════════
  // Query — parts (server-side filtered + paginated)
  // ══════════════════════════════════════════════════════════════════════════
  const partsFilters = useMemo(
    () => ({
      ...(selectedModel ? { brandId: selectedModel } : {}),
      ...(selectedCategory ? { categoryId: selectedCategory } : {}),
      ...(selectedFuelType ? { fuelType: selectedFuelType } : {}),
      ...(selectedBodyType ? { bodyType: selectedBodyType } : {}),
      ...(selectedDriveType ? { driveType: selectedDriveType } : {}),
      ...(selectedEngine ? { engineType: selectedEngine } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    [selectedModel, selectedCategory, selectedFuelType, selectedBodyType, selectedDriveType, selectedEngine, search, page]
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
      articleNo: sp.article_no ?? sp.articleNo ?? undefined,
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
        onClear: () => updateParams({ cat: '', page: '' }),
      });
    }
    if (selectedFuelType) {
      chips.push({
        key: 'fuelType',
        label: `Fuel: ${selectedFuelType}`,
        onClear: () => updateParams({ fuel: '', page: '' }),
      });
    }
    if (selectedBodyType) {
      chips.push({
        key: 'bodyType',
        label: `Body: ${selectedBodyType}`,
        onClear: () => updateParams({ body: '', page: '' }),
      });
    }
    if (selectedDriveType) {
      chips.push({
        key: 'driveType',
        label: `Drive: ${selectedDriveType}`,
        onClear: () => updateParams({ drive: '', page: '' }),
      });
    }
    if (selectedEngine) {
      chips.push({
        key: 'engine',
        label: `Engine: ${selectedEngine}`,
        onClear: () => updateParams({ engine: '', page: '' }),
      });
    }
    if (search.trim()) {
      chips.push({
        key: 'search',
        label: `"${search.trim()}"`,
        onClear: () => updateParams({ q: '', page: '' }),
      });
    }
    return chips;
  }, [selectedCategory, selectedFuelType, selectedBodyType, selectedDriveType, selectedEngine, search, categoriesData]);

  const clearAllFilters = () => {
    updateParams({ cat: '', fuel: '', body: '', drive: '', engine: '', q: '', page: '' });
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Cascade change handlers (reset children)
  // ══════════════════════════════════════════════════════════════════════════
  const onChangeYear = (val: string) => {
    updateParams({ year: val, make: '', model: '', cat: '', fuel: '', body: '', drive: '', engine: '', page: '', q: '' });
  };
  const onChangeMake = (val: string) => {
    updateParams({ make: val, model: '', cat: '', fuel: '', body: '', drive: '', engine: '', page: '', q: '' });
  };
  const onChangeModel = (val: string) => {
    updateParams({ model: val, cat: '', fuel: '', body: '', drive: '', engine: '', page: '' });
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
            <div className={`grid grid-cols-1 gap-3 ${hasYears ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              {/* Year — only shown when the years endpoint is available (local DB) */}
              {hasYears && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Year
                  </label>
                  <SearchableCombobox
                    options={yearOptions.map((y) => ({ value: y, label: y }))}
                    value={selectedYear}
                    onChange={onChangeYear}
                    placeholderLabel="All years"
                    isLoading={yearsLoading}
                  />
                </div>
              )}

              {/* Make */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Make
                </label>
                <SearchableCombobox
                  options={makeOptions.map((m: any) => ({ value: m.Manufacturer_ID, label: m.name }))}
                  value={selectedMake}
                  onChange={onChangeMake}
                  placeholderLabel={hasYears && !selectedYear ? 'Select a year first' : 'All makes'}
                  isLoading={makesLoading}
                  disabled={hasYears && !selectedYear}
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Model
                </label>
                <SearchableCombobox
                  options={modelOptions.map((b: any) => ({ value: b.CarBrand_ID, label: b.name }))}
                  value={selectedModel}
                  onChange={onChangeModel}
                  placeholderLabel={selectedMake ? 'All models' : 'Select a make first'}
                  isLoading={modelsLoading}
                  disabled={!selectedMake}
                />
              </div>
            </div>

            {/* Vehicle attribute filters — visible after model selection */}
            {selectedModel && (fuelTypeOptions.length > 0 || bodyTypeOptions.length > 0 || driveTypeOptions.length > 0 || engineOptions.length > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Refine by vehicle attributes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {fuelTypeOptions.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Fuel Type
                      </label>
                      <SearchableCombobox
                        options={[
                          { value: '', label: 'All fuel types' },
                          ...fuelTypeOptions.map((ft: string) => ({ value: ft, label: ft })),
                        ]}
                        value={selectedFuelType}
                        onChange={(val) => updateParams({ fuel: val, page: '' })}
                        placeholderLabel="All fuel types"
                      />
                    </div>
                  )}
                  {bodyTypeOptions.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Body Type
                      </label>
                      <SearchableCombobox
                        options={[
                          { value: '', label: 'All body types' },
                          ...bodyTypeOptions.map((bt: string) => ({ value: bt, label: bt })),
                        ]}
                        value={selectedBodyType}
                        onChange={(val) => updateParams({ body: val, page: '' })}
                        placeholderLabel="All body types"
                      />
                    </div>
                  )}
                  {driveTypeOptions.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Drive Type
                      </label>
                      <SearchableCombobox
                        options={[
                          { value: '', label: 'All drive types' },
                          ...driveTypeOptions.map((dt: string) => ({ value: dt, label: dt })),
                        ]}
                        value={selectedDriveType}
                        onChange={(val) => updateParams({ drive: val, page: '' })}
                        placeholderLabel="All drive types"
                      />
                    </div>
                  )}
                  {engineOptions.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Engine
                      </label>
                      <SearchableCombobox
                        options={[
                          { value: '', label: 'All engines' },
                          ...engineOptions.map((e: string) => ({ value: e, label: e })),
                        ]}
                        value={selectedEngine}
                        onChange={(val) => updateParams({ engine: val, page: '' })}
                        placeholderLabel="All engines"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
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
                  onClick={() => updateParams({ cat: '', page: '' })}
                  className={`w-full flex items-baseline justify-between gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                    !selectedCategory
                      ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-left">All parts</span>
                  {total > 0 && !selectedCategory && (
                    <span className="shrink-0 text-xs text-gray-400">
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

                {!categoriesLoading && orderedCategories.map((cat) => {
                  // Hide children unless their parent is expanded
                  if (cat.depth > 0 && cat.parentCategoryId && !expandedWithActive.has(cat.parentCategoryId)) {
                    return null;
                  }

                  const isActive = selectedCategory === cat.Category_ID;

                  if (cat.isParent) {
                    const isExpanded = expandedWithActive.has(cat.Category_ID);
                    return (
                      <div key={cat.Category_ID} className="mt-1">
                        <div
                          className={`w-full flex items-center gap-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <button
                            onClick={() => toggleCategory(cat.Category_ID)}
                            className="shrink-0 p-0.5 -ml-1 rounded hover:bg-gray-200 transition-colors"
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            <svg
                              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </button>
                          <button
                            onClick={() => updateParams({ cat: cat.Category_ID, page: '' })}
                            className="flex-1 flex items-baseline justify-between gap-2 text-left font-medium truncate"
                            title={cat.name}
                          >
                            <span className="truncate">{cat.name}</span>
                            {cat.count != null && cat.count > 0 && (
                              <span className="shrink-0 text-xs text-gray-400 font-normal">
                                {cat.count}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={cat.Category_ID}
                      onClick={() => updateParams({ cat: cat.Category_ID, page: '' })}
                      className={`w-full flex items-baseline justify-between gap-2 py-1.5 rounded-lg text-sm transition-colors ${
                        cat.depth > 0 ? 'pl-7 pr-3' : 'px-3'
                      } ${
                        isActive
                          ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      <span className="text-left truncate" title={cat.name}>{cat.name}</span>
                      {cat.count != null && cat.count > 0 && (
                        <span className="shrink-0 text-xs text-gray-400">
                          {cat.count}
                        </span>
                      )}
                    </button>
                  );
                })}
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
                        onChange={(e) => updateParams({ q: e.target.value, page: '' })}
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
                  <SearchableCombobox
                    options={[
                      { value: '', label: 'All categories' },
                      ...orderedCategories.map((cat) => ({
                        value: cat.Category_ID,
                        label: cat.depth > 0 ? `  ${cat.name}` : cat.name,
                      })),
                    ]}
                    value={selectedCategory}
                    onChange={(val) => updateParams({ cat: val, page: '' })}
                    placeholderLabel="All categories"
                    isLoading={categoriesLoading}
                  />
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
                    Choose a {hasYears ? 'year, make, and model' : 'make and model'} above to browse available parts.
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
