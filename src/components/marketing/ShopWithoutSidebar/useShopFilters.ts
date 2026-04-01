/* eslint-disable @typescript-eslint/no-explicit-any */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getActiveCategories, getCarBrands, getCarManufacturers, getCarModels, getCarYears, getSpareParts } from '@/lib/inventoryApis';

import { ProductVM } from '../Shop/shopTypes';

type ViewMode = 'grid' | 'list';
const PAGE_SIZE = 48;
const STATIC_STALE = 10 * 60_000; // 10 min — rarely changes (years, makes, brands, models)
const DYNAMIC_STALE = 5 * 60_000; // 5 min — parts
const CATEGORY_STALE = 30 * 60_000; // 30 min — active categories barely change

// ── Pagination helper ──────────────────────────────────────────────────────
export function pageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | '...')[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) {
    pages.push('...');
  }
  for (let i = left; i <= right; i++) {
    pages.push(i);
  }
  if (right < total - 1) {
    pages.push('...');
  }
  pages.push(total);
  return pages;
}

export function useShopFilters() {
  // ── URL-backed state ────────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();

  const sp = useCallback((key: string) => searchParams.get(key) ?? '', [searchParams]);

  const selectedYear = sp('year');
  const selectedMake = sp('make');
  const selectedBrand = sp('brand');
  const selectedModel = sp('model');
  const selectedFuelType = sp('fuel');
  const selectedBodyType = sp('body');
  const selectedDriveType = sp('drive');
  const selectedEngine = sp('engine');
  const selectedCategoryRaw = sp('cat');
  const selectedCategories: string[] = useMemo(
    () => selectedCategoryRaw ? selectedCategoryRaw.split(',').filter(Boolean) : [],
    [selectedCategoryRaw]
  );
  // Back-compat alias: first selected category (used where a single value is needed)
  const selectedCategory = selectedCategoryRaw;
  const search = sp('q');
  const page = Math.max(1, parseInt(sp('page') || '1', 10));

  const [view, setView] = useState<ViewMode>('grid');

  const updateParams = useCallback(
    (updates: Record<string, string | number>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, val] of Object.entries(updates)) {
            const str = String(val);
            if (str && str !== '0') {
              next.set(key, str);
            } else {
              next.delete(key);
            }
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setPage = (v: number) => updateParams({ page: v <= 1 ? '' : String(v) });


  // ── Queries — vehicle cascade ───────────────────────────────────────────
  // Years & manufacturers load in PARALLEL on mount (no dependency between them)
  const {
    data: yearsData,
    isLoading: yearsLoading,
    isError: yearsError
  } = useQuery({
    queryKey: ['car-years'],
    queryFn: getCarYears,
    staleTime: STATIC_STALE,
    retry: false
  });

  const hasYearsEndpoint = !yearsError && (yearsData?.data?.length ?? 0) > 0;
  let hasYears = hasYearsEndpoint;

  const { data: manufacturersData, isLoading: makesLoading } = useQuery({
    queryKey: ['car-manufacturers'],
    queryFn: () => getCarManufacturers(),
    staleTime: STATIC_STALE,
    retry: 1
    // No `enabled` gate — loads immediately in parallel with years
  });

  const brandFilters = useMemo(() => (selectedMake ? { manufacturerId: selectedMake } : undefined), [selectedMake]);
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['car-brands', brandFilters],
    queryFn: () => getCarBrands(brandFilters),
    staleTime: STATIC_STALE,
    enabled: !!selectedMake
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

  // ── Query — car models ──────────────────────────────────────────────────
  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['car-models', selectedBrand],
    queryFn: () => getCarModels({ brandId: selectedBrand }),
    staleTime: STATIC_STALE,
    enabled: !!selectedBrand
  });

  const modelsForBrand = useMemo(() => modelsData?.data ?? [], [modelsData]);
  const variantsData = modelsData;

  // ── Dynamic filter options (cross-filtering) ────────────────────────────
  const fuelTypeOptions = useMemo(() => {
    let variants = variantsData?.data ?? [];
    if (selectedBodyType) variants = variants.filter((v: any) => v.bodyTypes?.includes(selectedBodyType));
    if (selectedDriveType) variants = variants.filter((v: any) => v.driveTypes?.includes(selectedDriveType));
    if (selectedEngine) variants = variants.filter((v: any) => v.name === selectedEngine);
    const counts = new Map<string, number>();
    for (const v of variants) {
      for (const ft of (v as any).fuelTypes ?? []) {
        if (ft) counts.set(ft, (counts.get(ft) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }, [variantsData, selectedBodyType, selectedDriveType, selectedEngine]);

  const bodyTypeOptions = useMemo(() => {
    let variants = variantsData?.data ?? [];
    if (selectedFuelType) variants = variants.filter((v: any) => v.fuelTypes?.includes(selectedFuelType));
    if (selectedDriveType) variants = variants.filter((v: any) => v.driveTypes?.includes(selectedDriveType));
    if (selectedEngine) variants = variants.filter((v: any) => v.name === selectedEngine);
    const counts = new Map<string, number>();
    for (const v of variants) {
      for (const bt of (v as any).bodyTypes ?? []) {
        if (bt) counts.set(bt, (counts.get(bt) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }, [variantsData, selectedFuelType, selectedDriveType, selectedEngine]);

  const driveTypeOptions = useMemo(() => {
    let variants = variantsData?.data ?? [];
    if (selectedFuelType) variants = variants.filter((v: any) => v.fuelTypes?.includes(selectedFuelType));
    if (selectedBodyType) variants = variants.filter((v: any) => v.bodyTypes?.includes(selectedBodyType));
    if (selectedEngine) variants = variants.filter((v: any) => v.name === selectedEngine);
    const counts = new Map<string, number>();
    for (const v of variants) {
      for (const dt of (v as any).driveTypes ?? []) {
        if (dt) counts.set(dt, (counts.get(dt) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }, [variantsData, selectedFuelType, selectedBodyType, selectedEngine]);

  const engineOptions = useMemo(() => {
    let variants = variantsData?.data ?? [];
    if (selectedFuelType) variants = variants.filter((v: any) => v.fuelTypes?.includes(selectedFuelType));
    if (selectedBodyType) variants = variants.filter((v: any) => v.bodyTypes?.includes(selectedBodyType));
    if (selectedDriveType) variants = variants.filter((v: any) => v.driveTypes?.includes(selectedDriveType));
    const counts = new Map<string, number>();
    for (const v of variants) {
      const en = (v as any).name;
      if (en) counts.set(en, (counts.get(en) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }, [variantsData, selectedFuelType, selectedBodyType, selectedDriveType]);

  // ── Cascade derived options ─────────────────────────────────────────────
  const yearOptions = useMemo(() => (yearsData?.data ?? []).map((y) => String(y)), [yearsData]);

  const makeOptions = useMemo(() => {
    const all = manufacturersData?.data ?? [];
    if (!selectedYear) return all;
    const yr = Number(selectedYear);
    if (Number.isNaN(yr)) return all;
    return all.filter((m: any) => {
      const brands = m.brands ?? [];
      if (brands.length === 0) return true;
      return brands.some((b: any) => {
        const from = b.yearFrom ?? null;
        const to = b.yearTo ?? null;
        if (from === null && to === null) return true;
        if (from !== null && yr < from) return false;
        if (to !== null && yr > to) return false;
        return true;
      });
    });
  }, [manufacturersData, selectedYear]);

  const brandOptions = useMemo(() => {
    if (!selectedYear) return brandsForMake;
    const yr = Number(selectedYear);
    if (Number.isNaN(yr)) return brandsForMake;
    return brandsForMake.filter((b: any) => {
      const from = b.yearFrom ?? null;
      const to = b.yearTo ?? null;
      if (from === null && to === null) return true;
      if (from !== null && yr < from) return false;
      if (to !== null && yr > to) return false;
      return true;
    });
  }, [brandsForMake, selectedYear]);

  const modelOptions = useMemo(() => modelsForBrand, [modelsForBrand]);

  // ── Query — active categories (fetched once, cached 30 min) ────────────
  const { data: allCategoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['active-categories'],
    queryFn: getActiveCategories,
    staleTime: CATEGORY_STALE,
    gcTime: CATEGORY_STALE, // keep in memory for 30 min even after unmount
    retry: 2
  });

  // Toggle a category in/out of the multi-select list
  const toggleCategoryFilter = useCallback(
    (catId: string) => {
      const current = selectedCategoryRaw ? selectedCategoryRaw.split(',').filter(Boolean) : [];
      const next = current.includes(catId) ? current.filter((id) => id !== catId) : [...current, catId];
      updateParams({ cat: next.join(','), page: '' });
    },
    [selectedCategoryRaw, updateParams]
  );

  const removeCategoryFilter = useCallback(
    (catId: string) => {
      const current = selectedCategoryRaw ? selectedCategoryRaw.split(',').filter(Boolean) : [];
      const next = current.filter((id) => id !== catId);
      updateParams({ cat: next.join(','), page: '' });
    },
    [selectedCategoryRaw, updateParams]
  );

  // categoriesData is the same as allCategoriesData — single source of truth
  const categoriesData = allCategoriesData;

  // ── Category tree ───────────────────────────────────────────────────────
  type CatNode = {
    Category_ID: string;
    name: string;
    count: number;
    isParent: boolean;
    depth: number;
    parentCategoryId?: string;
  };

  const orderedCategories = useMemo(() => {
    const allCats = categoriesData?.data ?? [];
    // Build a set of known IDs so we can detect orphaned children
    const knownIds = new Set(allCats.map((c) => c.Category_ID));
    const childrenOf = new Map<string, typeof allCats>();
    for (const cat of allCats) {
      if (cat.parent_ID && knownIds.has(cat.parent_ID)) {
        const arr = childrenOf.get(cat.parent_ID) ?? [];
        arr.push(cat);
        childrenOf.set(cat.parent_ID, arr);
      }
    }
    // Top-level = no parent OR parent not in the active set (orphaned)
    const topLevel = allCats.filter((c) => !c.parent_ID || !knownIds.has(c.parent_ID));
    topLevel.sort((a, b) => a.name.localeCompare(b.name));

    const result: CatNode[] = [];
    const walk = (items: typeof allCats, depth: number, parentId?: string) => {
      for (const cat of items) {
        const count = cat._count?.spareParts ?? cat.count ?? 0;
        const children = (childrenOf.get(cat.Category_ID) ?? []).sort((a, b) => a.name.localeCompare(b.name));
        result.push({
          Category_ID: cat.Category_ID,
          name: cat.name,
          count,
          isParent: children.length > 0,
          depth,
          parentCategoryId: parentId
        });
        if (children.length > 0) walk(children, depth + 1, cat.Category_ID);
      }
    };
    walk(topLevel, 0);
    return result;
  }, [categoriesData]);

  // Start with all categories collapsed (empty set = nothing expanded)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  const isExpanded = useCallback((catId: string) => expandedCategories.has(catId), [expandedCategories]);

  // ── Query — parts ───────────────────────────────────────────────────────
  // For the API, resolve all selected categories to their root ancestors.
  // If they all share the same root, send that root. Otherwise send nothing and filter client-side.
  const categoryForApi = useMemo(() => {
    if (selectedCategories.length === 0) return '';
    const allCats = allCategoriesData?.data;
    if (!allCats) return selectedCategories[0]; // data not loaded yet, send as-is

    const parentMap = new Map<string, string>();
    for (const cat of allCats) {
      if (cat.parent_ID) parentMap.set(cat.Category_ID, cat.parent_ID);
    }
    const toRoot = (id: string) => {
      let c = id;
      while (parentMap.has(c)) c = parentMap.get(c)!;
      return c;
    };

    const roots = new Set(selectedCategories.map(toRoot));
    // All selected categories share the same root → send that root to API
    if (roots.size === 1) return [...roots][0];
    // Different roots → can't use a single categoryId, omit and filter client-side
    return '';
  }, [selectedCategories, allCategoriesData]);

  console.log('[PARTS QUERY]', {
    selectedCategories,
    categoryForApi: categoryForApi || '(none - multi or empty)',
    selectedBrand: selectedBrand || '(none)',
  });
  const partsFilters = useMemo(
    () => ({
      ...(selectedBrand ? { brandId: selectedBrand } : {}),
      ...(categoryForApi ? { categoryId: categoryForApi } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
      limit: PAGE_SIZE,
      page
    }),
    [selectedBrand, categoryForApi, search, page]
  );

  const vehicleSelected = !!selectedBrand;
  const showResults = !!(selectedBrand || selectedCategories.length > 0 || search.trim());

  const {
    data: partsData,
    isLoading: partsLoading,
    isError: partsErrorRaw,
    isPlaceholderData
  } = useQuery({
    queryKey: ['spareparts', partsFilters],
    queryFn: () => getSpareParts(partsFilters),
    staleTime: DYNAMIC_STALE,
    enabled: showResults,
    placeholderData: keepPreviousData,
    retry: 1
  });

  // Don't show error state if we still have placeholder data to display
  const partsError = partsErrorRaw && !isPlaceholderData && !partsData;

  if (partsData?.data) {
    const sample = partsData.data.slice(0, 3).map((p: any) => ({ name: p.name, category_ID: p.category_ID, catName: p.category?.name, catLevel: p.category?.level })); // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log('[PARTS RESPONSE]', { totalFromServer: partsData.meta?.total ?? partsData.data.length, sampleParts: sample });
  }

  // ── Client-side attribute filtering ─────────────────────────────────────
  const hasAttributeFilters = !!(selectedFuelType || selectedBodyType || selectedDriveType || selectedEngine || selectedModel);
  const hasYearFilter = !!selectedYear;

  const matchingModelIds = useMemo(() => {
    if (!hasAttributeFilters) return null;
    let variants = modelsForBrand;
    if (selectedModel) variants = variants.filter((v: any) => v.CarModel_ID === selectedModel);
    if (selectedFuelType) variants = variants.filter((v: any) => v.fuelTypes?.includes(selectedFuelType));
    if (selectedBodyType) variants = variants.filter((v: any) => v.bodyTypes?.includes(selectedBodyType));
    if (selectedDriveType) variants = variants.filter((v: any) => v.driveTypes?.includes(selectedDriveType));
    if (selectedEngine) variants = variants.filter((v: any) => v.name === selectedEngine);
    return new Set(variants.map((v: any) => v.CarModel_ID as string));
  }, [modelsForBrand, selectedModel, selectedFuelType, selectedBodyType, selectedDriveType, selectedEngine, hasAttributeFilters]);

  // Build parent lookup from raw category data for ancestor expansion
  const categoryParentMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of allCategoriesData?.data ?? []) {
      if (cat.parent_ID) map.set(cat.Category_ID, cat.parent_ID);
    }
    return map;
  }, [allCategoriesData]);

  const filteredParts = useMemo(() => {
    let all = partsData?.data ?? [];
    // Client-side category filter: expand selected categories to include their ancestors
    // (parts may be tagged with parent category_ID even when child is selected)
    if (selectedCategories.length > 0) {
      const catSet = new Set(selectedCategories);
      for (const catId of selectedCategories) {
        let current = categoryParentMap.get(catId);
        while (current) {
          catSet.add(current);
          current = categoryParentMap.get(current);
        }
      }
      // Only filter if the set doesn't just contain a single root category that was sent to API directly
      // (i.e., skip filtering when user selected a root category — API already handles it)
      const isJustOneRoot = selectedCategories.length === 1 && !categoryParentMap.has(selectedCategories[0]);
      if (!isJustOneRoot) {
        all = all.filter((sp: any) => {
          const catId = sp.category_ID ?? sp.category?.Category_ID;
          return catId && catSet.has(catId);
        });
      }
    }
    const needsModelFilter = !!matchingModelIds;
    const needsYearFilter = hasYearFilter;
    if (!needsModelFilter && !needsYearFilter) return all;
    const yearNum = needsYearFilter ? parseInt(selectedYear, 10) : NaN;
    return all.filter((sp: any) => {
      const pvs: any[] = sp.partVehicles ?? [];
      if (pvs.length === 0) {
        if (needsYearFilter) return false;
        return !needsModelFilter || (sp.carModel_ID && matchingModelIds!.has(sp.carModel_ID));
      }
      return pvs.some((pv: any) => {
        const modelId = pv.carModel?.CarModel_ID ?? pv.carModel_ID;
        if (needsModelFilter && !(modelId && matchingModelIds!.has(modelId))) return false;
        if (needsYearFilter) {
          const start = pv.carModel?.constructionStart ?? pv.carModel?.yearOfMake;
          const end = pv.carModel?.constructionEnd;
          if (start != null && start > yearNum) return false;
          if (end != null && end < yearNum) return false;
          if (start == null && end == null) return false;
        }
        return true;
      });
    });
  }, [partsData, matchingModelIds, hasYearFilter, selectedYear]);

  // ── Year options (merge endpoint + parts-derived) ───────────────────────
  const partsYearOptions = useMemo(() => {
    const years = new Set<number>();
    for (const sp of partsData?.data ?? []) {
      for (const pv of (sp as any).partVehicles ?? []) {
        const y = pv.carModel?.yearOfMake;
        if (typeof y === 'number' && y > 0) years.add(y);
      }
    }
    return [...years].sort((a, b) => b - a).map(String);
  }, [partsData]);

  const allYearOptions = useMemo(() => (yearOptions.length > 0 ? yearOptions : partsYearOptions), [yearOptions, partsYearOptions]);
  hasYears = hasYearsEndpoint || allYearOptions.length > 0;

  // ── Totals & pagination ─────────────────────────────────────────────────
  const serverTotal = partsData?.meta?.total ?? partsData?.total ?? partsData?.data?.length ?? 0;
  const hasAnyCategoryChild = selectedCategories.length > 0 && selectedCategories.some((id) => categoryParentMap.has(id));
  const hasClientFilter = hasAttributeFilters || hasYearFilter || selectedCategories.length > 1 || hasAnyCategoryChild;
  const total = hasClientFilter ? filteredParts.length : serverTotal;
  const totalPages = hasClientFilter
    ? Math.max(1, Math.ceil(total / PAGE_SIZE))
    : (partsData?.meta?.totalPages ?? Math.max(1, Math.ceil(serverTotal / PAGE_SIZE)));

  // ── Category IDs that contain matching results ─────────────────────────
  const matchingCategoryIds = useMemo(() => {
    if (!showResults || filteredParts.length === 0) return new Set<string>();
    const ids = new Set<string>();
    for (const sp of filteredParts as any[]) {
      const catId = sp.category_ID ?? sp.category?.Category_ID;
      if (catId) ids.add(catId);
    }
    return ids;
  }, [filteredParts, showResults]);

  // ── Items view model ────────────────────────────────────────────────────
  const catNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of categoriesData?.data ?? []) map.set(c.Category_ID, c.name);
    return map;
  }, [categoriesData]);

  const items: ProductVM[] = useMemo(() => {
    return filteredParts.map((sp: any) => ({
      linkId: String(sp.id ?? sp.SparePart_ID ?? ''),
      title: sp.name,
      image: sp.images?.find((i: any) => !!i?.image_url)?.image_url ?? '/images/placeholder.jpg',
      articleNo: sp.article_no ?? sp.articleNo ?? undefined,
      supplierName: sp.supplier_name ?? sp.supplierName ?? undefined,
      categoryName: sp.category?.name ?? (sp.category_ID ? catNameById.get(sp.category_ID) : undefined)
    }));
  }, [filteredParts, catNameById]);

  // ── Filter chips ────────────────────────────────────────────────────────
  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; onClear: () => void }[] = [];
    for (const catId of selectedCategories) {
      const catName = categoriesData?.data?.find((c) => c.Category_ID === catId)?.name ?? 'Category';
      chips.push({ key: `category-${catId}`, label: catName, onClear: () => removeCategoryFilter(catId) });
    }
    if (selectedFuelType) chips.push({ key: 'fuelType', label: selectedFuelType, onClear: () => updateParams({ fuel: '', page: '' }) });
    if (selectedBodyType) chips.push({ key: 'bodyType', label: selectedBodyType, onClear: () => updateParams({ body: '', page: '' }) });
    if (selectedDriveType) chips.push({ key: 'driveType', label: selectedDriveType, onClear: () => updateParams({ drive: '', page: '' }) });
    if (selectedEngine) chips.push({ key: 'engine', label: selectedEngine, onClear: () => updateParams({ engine: '', page: '' }) });
    if (search.trim()) chips.push({ key: 'search', label: `"${search.trim()}"`, onClear: () => updateParams({ q: '', page: '' }) });
    return chips;
  }, [selectedCategories, selectedFuelType, selectedBodyType, selectedDriveType, selectedEngine, search, categoriesData, removeCategoryFilter]);

  const clearAllFilters = () => updateParams({ cat: '', fuel: '', body: '', drive: '', engine: '', q: '', page: '' });

  // ── Vehicle summary ─────────────────────────────────────────────────────
  const vehicleSummary = useMemo(() => {
    if (!selectedMake || !selectedBrand) return null;
    const mfr = manufacturersData?.data?.find((m: any) => m.Manufacturer_ID === selectedMake);
    const brand = brandsForMake.find((b: any) => b.CarBrand_ID === selectedBrand);
    const mdl = selectedModel ? modelsForBrand.find((m: any) => m.CarModel_ID === selectedModel) : null;
    const parts = [mfr?.name, brand?.name, mdl?.name].filter(Boolean);
    if (selectedYear) parts.unshift(selectedYear);
    return parts.join(' ');
  }, [selectedMake, selectedBrand, selectedModel, selectedYear, manufacturersData, brandsForMake, modelsForBrand]);

  // ── Cascade change handlers ─────────────────────────────────────────────
  const onChangeYear = (val: string) =>
    updateParams({ year: val, make: '', brand: '', model: '', fuel: '', body: '', drive: '', engine: '', page: '' });
  const onChangeMake = (val: string) =>
    updateParams({ make: val, brand: '', model: '', fuel: '', body: '', drive: '', engine: '', page: '' });
  const onChangeBrand = (val: string) => updateParams({ brand: val, model: '', fuel: '', body: '', drive: '', engine: '', page: '' });
  const onChangeModel = (val: string) => updateParams({ model: val, fuel: '', body: '', drive: '', engine: '', page: '' });

  return {
    // URL state
    selectedYear,
    selectedMake,
    selectedBrand,
    selectedModel,
    selectedFuelType,
    selectedBodyType,
    selectedDriveType,
    selectedEngine,
    selectedCategory,
    selectedCategories,
    toggleCategoryFilter,
    removeCategoryFilter,
    search,
    page,
    view,
    setView,
    updateParams,
    setPage,

    // Loading states
    yearsLoading,
    makesLoading,
    brandsLoading,
    modelsLoading,
    categoriesLoading,
    partsLoading,
    partsError,

    // Options
    hasYears,
    allYearOptions,
    makeOptions,
    brandOptions,
    modelOptions,
    fuelTypeOptions,
    bodyTypeOptions,
    driveTypeOptions,
    engineOptions,
    orderedCategories,

    // Category tree
    toggleCategory,
    isExpanded,
    matchingCategoryIds,

    // Cascade handlers
    onChangeYear,
    onChangeMake,
    onChangeBrand,
    onChangeModel,

    // Results
    vehicleSelected,
    showResults,
    vehicleSummary,
    total,
    totalPages,
    items,

    // Filters
    activeFilters,
    clearAllFilters
  };
}

export type ShopFilters = ReturnType<typeof useShopFilters>;
