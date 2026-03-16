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
  const selectedBrand = sp('brand');
  const selectedModel = sp('model');
  const selectedFuelType = sp('fuel');
  const selectedBodyType = sp('body');
  const selectedDriveType = sp('drive');
  const selectedEngine = sp('engine');
  const selectedCategory = sp('cat');
  const search = sp('q');
  const page = Math.max(1, parseInt(sp('page') || '1', 10));

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

  const { data: manufacturersData, isLoading: makesLoading } = useQuery({
    queryKey: ['car-manufacturers'],
    queryFn: () => getCarManufacturers(),
    staleTime: 10 * 60_000,
    enabled: !yearsLoading,
    retry: 1,
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

  const brandsForMake = useMemo(() => {
    if (!selectedMake) return [];

    const fromEndpoint = brandsData?.data ?? [];
    if (fromEndpoint.length > 0) {
      const mfr = manufacturersData?.data?.find((m: any) => m.Manufacturer_ID === selectedMake);
      const inlineBrands = mfr?.brands ?? [];
      const totalMfrs = manufacturersData?.data?.length ?? 0;
      if (inlineBrands.length > 0 && fromEndpoint.length > totalMfrs * 2) {
        return inlineBrands;
      }
      return fromEndpoint;
    }
    const mfr = manufacturersData?.data?.find((m: any) => m.Manufacturer_ID === selectedMake);
    return mfr?.brands ?? [];
  }, [selectedMake, brandsData, manufacturersData]);

  // ══════════════════════════════════════════════════════════════════════════
  // Query — car models for the selected brand (fuel/body/drive/engine values)
  // ══════════════════════════════════════════════════════════════════════════
  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['car-models', selectedBrand],
    queryFn: () => getCarModels({ brandId: selectedBrand }),
    staleTime: 10 * 60_000,
    enabled: !!selectedBrand,
  });

  const modelsForBrand = useMemo(() => {
    return modelsData?.data ?? [];
  }, [modelsData]);

  // variantsData: all models under the selected brand (used for fuel/body/drive/engine filtering)
  const variantsData = modelsData;

  // Dynamic filter options — each adapts based on what's selected in the others
  // Returns { value, count } pairs so chips can show how many variants match
  const fuelTypeOptions = useMemo(() => {
    let variants = variantsData?.data ?? [];
    if (selectedBodyType) variants = variants.filter((v: any) => v.bodyType === selectedBodyType);
    if (selectedDriveType) variants = variants.filter((v: any) => v.driveType === selectedDriveType);
    if (selectedEngine) variants = variants.filter((v: any) => v.name === selectedEngine);
    const counts = new Map<string, number>();
    for (const v of variants) {
      const ft = (v as any).fuelType;
      if (ft) counts.set(ft, (counts.get(ft) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }, [variantsData, selectedBodyType, selectedDriveType, selectedEngine]);

  const bodyTypeOptions = useMemo(() => {
    let variants = variantsData?.data ?? [];
    if (selectedFuelType) variants = variants.filter((v: any) => v.fuelType === selectedFuelType);
    if (selectedDriveType) variants = variants.filter((v: any) => v.driveType === selectedDriveType);
    if (selectedEngine) variants = variants.filter((v: any) => v.name === selectedEngine);
    const counts = new Map<string, number>();
    for (const v of variants) {
      const bt = (v as any).bodyType;
      if (bt) counts.set(bt, (counts.get(bt) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }, [variantsData, selectedFuelType, selectedDriveType, selectedEngine]);

  const driveTypeOptions = useMemo(() => {
    let variants = variantsData?.data ?? [];
    if (selectedFuelType) variants = variants.filter((v: any) => v.fuelType === selectedFuelType);
    if (selectedBodyType) variants = variants.filter((v: any) => v.bodyType === selectedBodyType);
    if (selectedEngine) variants = variants.filter((v: any) => v.name === selectedEngine);
    const counts = new Map<string, number>();
    for (const v of variants) {
      const dt = (v as any).driveType;
      if (dt) counts.set(dt, (counts.get(dt) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }, [variantsData, selectedFuelType, selectedBodyType, selectedEngine]);

  const engineOptions = useMemo(() => {
    let variants = variantsData?.data ?? [];
    if (selectedFuelType) variants = variants.filter((v: any) => v.fuelType === selectedFuelType);
    if (selectedBodyType) variants = variants.filter((v: any) => v.bodyType === selectedBodyType);
    if (selectedDriveType) variants = variants.filter((v: any) => v.driveType === selectedDriveType);
    const counts = new Map<string, number>();
    for (const v of variants) {
      const en = (v as any).name;
      if (en) counts.set(en, (counts.get(en) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }, [variantsData, selectedFuelType, selectedBodyType, selectedDriveType]);

  // ══════════════════════════════════════════════════════════════════════════
  // Cascade derived options
  // ══════════════════════════════════════════════════════════════════════════
  const yearOptions = useMemo(() => {
    return (yearsData?.data ?? []).map((y) => String(y));
  }, [yearsData]);

  const makeOptions = useMemo(() => {
    return manufacturersData?.data ?? [];
  }, [manufacturersData]);

  const brandOptions = useMemo(() => {
    return brandsForMake;
  }, [brandsForMake]);

  const modelOptions = useMemo(() => {
    return modelsForBrand;
  }, [modelsForBrand]);

  // ══════════════════════════════════════════════════════════════════════════
  // Queries — categories (scoped to selected brand)
  // ══════════════════════════════════════════════════════════════════════════
  const categoryFilters = useMemo(
    () => (selectedBrand ? {
      brandId: selectedBrand,
      ...(selectedFuelType ? { fuelType: selectedFuelType } : {}),
      ...(selectedBodyType ? { bodyType: selectedBodyType } : {}),
      ...(selectedDriveType ? { driveType: selectedDriveType } : {}),
      ...(selectedEngine ? { engineType: selectedEngine } : {}),
    } : undefined),
    [selectedBrand, selectedFuelType, selectedBodyType, selectedDriveType, selectedEngine]
  );

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ['sparepart-categories', categoryFilters],
    queryFn: () => getSparePartCategories(categoryFilters),
    staleTime: 5 * 60_000,
    enabled: !!selectedBrand,
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
  // Flatten categories to max 2 levels (top-level parents + direct children).
  // 3rd-level categories are folded into their parent's results.
  const orderedCategories = useMemo(() => {
    const allCats = categoriesData?.data ?? [];
    const byId = new Map(allCats.map(c => [c.Category_ID, c]));

    const topLevel: typeof allCats = [];
    const childrenOf = new Map<string, typeof allCats>();

    for (const cat of allCats) {
      if (!cat.parent_ID || !byId.has(cat.parent_ID)) {
        topLevel.push(cat);
      } else {
        const arr = childrenOf.get(cat.parent_ID) ?? [];
        arr.push(cat);
        childrenOf.set(cat.parent_ID, arr);
      }
    }

    topLevel.sort((a, b) => a.name.localeCompare(b.name));

    type CatNode = {
      Category_ID: string;
      name: string;
      count?: number;
      isParent: boolean;
      depth: number;
      parentCategoryId?: string;
    };
    const result: CatNode[] = [];

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

  // Top-level categories start expanded; clicking toggles them
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((catId: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  // A parent is visible (expanded) unless the user explicitly collapsed it
  const isExpanded = useCallback((catId: string) => {
    return !collapsedCategories.has(catId);
  }, [collapsedCategories]);

  // ══════════════════════════════════════════════════════════════════════════
  // Query — parts (server-side filtered + paginated)
  // ══════════════════════════════════════════════════════════════════════════
  const partsFilters = useMemo(
    () => ({
      ...(selectedBrand ? { brandId: selectedBrand } : {}),
      ...(selectedCategory ? { categoryId: selectedCategory } : {}),
      ...(selectedFuelType ? { fuelType: selectedFuelType } : {}),
      ...(selectedBodyType ? { bodyType: selectedBodyType } : {}),
      ...(selectedDriveType ? { driveType: selectedDriveType } : {}),
      ...(selectedEngine ? { engineType: selectedEngine } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
      limit: PAGE_SIZE,
      page,
    }),
    [selectedBrand, selectedCategory, selectedFuelType, selectedBodyType, selectedDriveType, selectedEngine, search, page]
  );

  const vehicleSelected = !!selectedBrand;

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

  const total = partsData?.meta?.total ?? partsData?.total ?? partsData?.data?.length ?? 0;
  const totalPages = partsData?.meta?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Build a category uuid→name lookup for enriching items
  const catNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of categoriesData?.data ?? []) {
      map.set(c.Category_ID, c.name);
    }
    return map;
  }, [categoriesData]);

  const items: ProductVM[] = useMemo(() => {
    return (partsData?.data ?? []).map((sp: any) => ({
      linkId: String(sp.id ?? sp.SparePart_ID ?? ''),
      title: sp.name,
      image:
        sp.images?.find((i: any) => !!i?.image_url)?.image_url ??
        '/images/placeholder.jpg',
      articleNo: sp.article_no ?? sp.articleNo ?? undefined,
      supplierName: sp.supplier_name ?? sp.supplierName ?? undefined,
      categoryName: sp.category_ID ? catNameById.get(sp.category_ID) : undefined,
    }));
  }, [partsData, catNameById]);

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
        label: selectedFuelType,
        onClear: () => updateParams({ fuel: '', page: '' }),
      });
    }
    if (selectedBodyType) {
      chips.push({
        key: 'bodyType',
        label: selectedBodyType,
        onClear: () => updateParams({ body: '', page: '' }),
      });
    }
    if (selectedDriveType) {
      chips.push({
        key: 'driveType',
        label: selectedDriveType,
        onClear: () => updateParams({ drive: '', page: '' }),
      });
    }
    if (selectedEngine) {
      chips.push({
        key: 'engine',
        label: selectedEngine,
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
  // Vehicle context summary (for the persistent banner)
  // ══════════════════════════════════════════════════════════════════════════
  const vehicleSummary = useMemo(() => {
    if (!selectedMake || !selectedBrand) return null;
    const mfr = manufacturersData?.data?.find((m: any) => m.Manufacturer_ID === selectedMake);
    const brand = brandsForMake.find((b: any) => b.CarBrand_ID === selectedBrand);
    const mdl = selectedModel ? modelsForBrand.find((m: any) => m.CarModel_ID === selectedModel) : null;
    const parts = [mfr?.name, brand?.name, mdl?.name].filter(Boolean);
    if (selectedYear) parts.unshift(selectedYear);
    return parts.join(' ');
  }, [selectedMake, selectedBrand, selectedModel, selectedYear, manufacturersData, brandsForMake, modelsForBrand]);

  // ══════════════════════════════════════════════════════════════════════════
  // Cascade change handlers (reset children)
  // ══════════════════════════════════════════════════════════════════════════
  const onChangeYear = (val: string) => {
    updateParams({ year: val, make: '', brand: '', model: '', cat: '', fuel: '', body: '', drive: '', engine: '', page: '', q: '' });
  };
  const onChangeMake = (val: string) => {
    updateParams({ make: val, brand: '', model: '', cat: '', fuel: '', body: '', drive: '', engine: '', page: '', q: '' });
  };
  const onChangeBrand = (val: string) => {
    updateParams({ brand: val, model: '', cat: '', fuel: '', body: '', drive: '', engine: '', page: '' });
  };
  const onChangeModel = (val: string) => {
    updateParams({ model: val, cat: '', fuel: '', body: '', drive: '', engine: '', page: '' });
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Render
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <Breadcrumb title="Browse Spare Parts" pages={['shop']} />

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Vehicle selector ──────────────────────────────────── */}
          <div className="bg-white rounded-xl px-6 py-5 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Find parts for your vehicle
            </h2>
            <div className={`grid grid-cols-1 gap-3 ${hasYears ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
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

              {/* Manufacturer */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Manufacturer
                </label>
                <SearchableCombobox
                  options={makeOptions.map((m: any) => ({ value: m.Manufacturer_ID, label: m.name, count: m.brands?.length > 0 ? m.brands.length : undefined }))}
                  value={selectedMake}
                  onChange={onChangeMake}
                  placeholderLabel={hasYears && !selectedYear ? 'Select a year first' : 'e.g. Toyota, BMW, Hyundai'}
                  isLoading={makesLoading}
                  disabled={hasYears && !selectedYear}
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Brand
                </label>
                <SearchableCombobox
                  options={brandOptions.map((b: any) => ({ value: b.CarBrand_ID, label: b.name, count: b.models?.length > 0 ? b.models.length : undefined }))}
                  value={selectedBrand}
                  onChange={onChangeBrand}
                  placeholderLabel={selectedMake ? 'e.g. Corolla, 3 Series' : 'Select manufacturer first'}
                  isLoading={brandsLoading}
                  disabled={!selectedMake}
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Model
                </label>
                <SearchableCombobox
                  options={modelOptions.map((m: any) => ({ value: m.CarModel_ID, label: `${m.name}${m.yearOfMake ? ` (${m.yearOfMake})` : ''}`, count: m.spareParts?.length > 0 ? m.spareParts.length : undefined }))}
                  value={selectedModel}
                  onChange={onChangeModel}
                  placeholderLabel={selectedBrand ? 'e.g. 1.6 VTEC, 2.0 TDI' : 'Select brand first'}
                  isLoading={modelsLoading}
                  disabled={!selectedBrand}
                />
              </div>
            </div>

            {/* Vehicle attribute filters — inline strip, visible after model selection */}
            {selectedBrand && (fuelTypeOptions.length > 0 || bodyTypeOptions.length > 0 || driveTypeOptions.length > 0 || engineOptions.length > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                  {/* Chip groups for low-cardinality filters */}
                  {fuelTypeOptions.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-0.5">Fuel</span>
                      {fuelTypeOptions.map((ft) => (
                        <button
                          key={ft.value}
                          onClick={() => updateParams({ fuel: selectedFuelType === ft.value ? '' : ft.value, page: '' })}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            selectedFuelType === ft.value
                              ? 'bg-[var(--color-primary-500)] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {ft.value}
                          <span className={`ml-1 text-[10px] ${selectedFuelType === ft.value ? 'text-white/70' : 'text-gray-400'}`}>
                            {ft.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {bodyTypeOptions.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-0.5">Body</span>
                      {bodyTypeOptions.map((bt) => (
                        <button
                          key={bt.value}
                          onClick={() => updateParams({ body: selectedBodyType === bt.value ? '' : bt.value, page: '' })}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            selectedBodyType === bt.value
                              ? 'bg-[var(--color-primary-500)] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {bt.value}
                          <span className={`ml-1 text-[10px] ${selectedBodyType === bt.value ? 'text-white/70' : 'text-gray-400'}`}>
                            {bt.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {driveTypeOptions.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-0.5">Drive</span>
                      {driveTypeOptions.map((dt) => (
                        <button
                          key={dt.value}
                          onClick={() => updateParams({ drive: selectedDriveType === dt.value ? '' : dt.value, page: '' })}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            selectedDriveType === dt.value
                              ? 'bg-[var(--color-primary-500)] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {dt.value}
                          <span className={`ml-1 text-[10px] ${selectedDriveType === dt.value ? 'text-white/70' : 'text-gray-400'}`}>
                            {dt.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Engine — searchable combobox styled to match the chip row */}
                  {engineOptions.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-0.5">Engine</span>
                      <SearchableCombobox
                        options={[
                          { value: '', label: 'Any' },
                          ...engineOptions.map((e) => ({ value: e.value, label: e.value, count: e.count })),
                        ]}
                        value={selectedEngine}
                        onChange={(val) => updateParams({ engine: val, page: '' })}
                        placeholderLabel="Any"
                        compact
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Vehicle context banner ─────────────────────────────── */}
          {vehicleSelected && vehicleSummary && (
            <div className="flex items-center gap-2.5 bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] rounded-lg px-4 py-2.5 mb-6">
              <svg className="w-5 h-5 text-[var(--color-primary-400)] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-6.867c0-.298-.119-.585-.33-.796l-3.525-3.525A1.125 1.125 0 0016.618 6H15m-3 0H9.375a1.125 1.125 0 00-1.125 1.125v11.25" />
              </svg>
              <span className="text-sm font-semibold text-[var(--color-primary-700)]">
                {vehicleSummary}
              </span>
              <span className="text-xs text-[var(--color-primary-400)] ml-auto hidden sm:inline">
                {total.toLocaleString()} part{total !== 1 ? 's' : ''} available
              </span>
            </div>
          )}

          {/* ── Main layout: sidebar + content ────────────────────── */}
          <div className="flex gap-6">
            {/* Sidebar — categories (hidden until vehicle selected) */}
            <aside className={`w-72 shrink-0 ${vehicleSelected ? 'hidden lg:block' : 'hidden'}`}>
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
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
                  // Hide children if their parent is collapsed
                  if (cat.depth > 0 && cat.parentCategoryId && !isExpanded(cat.parentCategoryId)) {
                    return null;
                  }

                  const isActive = selectedCategory === cat.Category_ID;

                  if (cat.isParent) {
                    const expanded = isExpanded(cat.Category_ID);
                    return (
                      <button
                        key={cat.Category_ID}
                        onClick={() => {
                          toggleCategory(cat.Category_ID);
                          updateParams({ cat: cat.Category_ID, page: '' });
                        }}
                        className={`w-full flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm transition-colors mt-1 ${
                          isActive
                            ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
                          fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="flex-1 text-left font-medium truncate" title={cat.name}>{cat.name}</span>
                        {cat.count != null && cat.count > 0 && (
                          <span className="shrink-0 text-xs text-gray-400 font-normal">
                            {cat.count}
                          </span>
                        )}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={cat.Category_ID}
                      onClick={() => updateParams({ cat: cat.Category_ID, page: '' })}
                      className={`w-full flex items-baseline justify-between gap-2 py-1.5 pl-7 pr-3 rounded-lg text-sm transition-colors ${
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
              {/* Search + filter chips (hidden until vehicle selected) */}
              {vehicleSelected && <div className="flex flex-col gap-3 mb-6">
                {/* Row: search + result count */}
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <input
                        value={search}
                        onChange={(e) => updateParams({ q: e.target.value, page: '' })}
                        placeholder="Search by part name or number…"
                        className="h-10 w-64 sm:w-80 rounded-lg border border-gray-200 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
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
                      {total.toLocaleString()} part{total !== 1 ? 's' : ''} found
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
                        count: cat.count != null && cat.count > 0 ? cat.count : undefined,
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
                <div className={
                  view === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'flex flex-col gap-1'
                }>
                  {Array.from({ length: view === 'grid' ? 12 : 8 }).map((_, i) => (
                    view === 'grid' ? (
                      <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="aspect-[4/3] bg-gray-100" />
                        <div className="px-3.5 py-3 space-y-2">
                          <div className="h-4 bg-gray-100 rounded w-3/4" />
                          <div className="h-3 bg-gray-50 rounded w-1/2" />
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="animate-pulse flex items-center gap-3 bg-white rounded-lg border border-gray-100 px-3 py-2 h-[60px]">
                        <div className="w-11 h-11 bg-gray-100 rounded-md shrink-0" />
                        <div className="flex-1 h-4 bg-gray-100 rounded w-1/3" />
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Error state */}
              {partsError && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-error-50)] flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-[var(--color-error-400)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-1.5">Something went wrong</p>
                  <p className="text-sm text-gray-400">Could not load parts. Please try again.</p>
                </div>
              )}

              {/* Prompt to select vehicle */}
              {!vehicleSelected && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-6.867c0-.298-.119-.585-.33-.796l-3.525-3.525A1.125 1.125 0 0016.618 6H15m-3 0H9.375a1.125 1.125 0 00-1.125 1.125v11.25" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-1.5">Select your vehicle to get started</p>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Choose a {hasYears ? 'year, manufacturer, and brand' : 'manufacturer and brand'} above to browse available spare parts.
                  </p>
                </div>
              )}

              {/* Empty state */}
              {vehicleSelected && !partsLoading && !partsError && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-1.5">No parts found</p>
                  <p className="text-sm text-gray-400 max-w-xs mb-4">
                    Try a different model or clear some filters above.
                  </p>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}

              {/* Parts grid / list */}
              {!partsLoading && !partsError && items.length > 0 && (
                <>
                  {/* List view column headers */}
                  {view === 'list' && (
                    <div className="flex items-center gap-3 px-3 py-1.5 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      <span className="w-11 shrink-0" />
                      <span className="flex-1 min-w-0">Part name</span>
                      <span className="hidden sm:block w-28 shrink-0 text-right">Article no.</span>
                      <span className="hidden md:block w-24 shrink-0 text-right">Supplier</span>
                      <span className="hidden lg:block w-36 shrink-0 text-right">Category</span>
                      <span className="w-4 shrink-0" />
                    </div>
                  )}
                  <div
                    className={
                      view === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                        : 'flex flex-col gap-1'
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
