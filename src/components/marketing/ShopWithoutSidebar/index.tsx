import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Breadcrumb from '../Common/Breadcrumb';
import SingleGridItem from '../Shop/SingleGridItem';
import SingleListItem from '../Shop/SingleListItem';
import CustomSelect from '../ShopWithSidebar/CustomSelect';

import {
  getSpareParts,
  getSparePartCategories,
  getCarManufacturers,
  getCarBrands,
  getCarModels,
} from '@/lib/inventoryApis';

import { ProductVM } from '../Shop/shopTypes';

const sortOptions = [
  { label: 'Latest Products', value: 'latest' },
  { label: 'Best Selling', value: 'popular' }, // placeholder
  { label: 'Old Products', value: 'oldest' },
];

type ViewMode = 'grid' | 'list';

function normalizeStr(x: unknown) {
  return String(x ?? '').toLowerCase();
}

// ---- robust getters that tolerate both shapes ----
// manufacturer: object.Manufacturer_ID OR string manufacturer_ID
const getManufacturerId = (sp: any): string =>
  sp?.carModel?.carBrand?.manufacturer?.Manufacturer_ID ??
  sp?.carModel?.carBrand?.manufacturer_ID ??
  '';

// brand: object.CarBrand_ID OR string carBrand_ID
const getBrandId = (sp: any): string =>
  sp?.carModel?.carBrand?.CarBrand_ID ??
  sp?.carModel?.carBrand_ID ??
  '';

// model: object.CarModel_ID OR string carModel_ID
const getModelId = (sp: any): string =>
  sp?.carModel?.CarModel_ID ??
  sp?.carModel_ID ??
  '';

const ShopWithoutSidebar: React.FC = () => {
  const [view] = useState<ViewMode>('grid');

  // Top filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [sort, setSort] = useState<string>('latest');
  const [search, setSearch] = useState<string>('');

  // ======================
  // Queries
  // ======================
  const { data: partsData, isLoading: partsLoading, isError: partsError } = useQuery({
    queryKey: ['spareparts'],
    queryFn: getSpareParts,
    staleTime: 60_000,
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ['sparepart-categories'],
    queryFn: getSparePartCategories,
    staleTime: 5 * 60_000,
  });

  const { data: manufacturersData, isLoading: manufacturersLoading } = useQuery({
    queryKey: ['car-manufacturers'],
    queryFn: getCarManufacturers,
    staleTime: 10 * 60_000,
  });

  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['car-brands'],
    queryFn: getCarBrands,
    staleTime: 10 * 60_000,
  });

  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['car-models'],
    queryFn: getCarModels,
    staleTime: 10 * 60_000,
  });

  // ======================
  // Option lists (derived)
  // ======================
  const manufacturerOptions = useMemo(() => {
    const list = manufacturersData?.data ?? [];
    return list.map((m: any) => ({ value: m.Manufacturer_ID, label: m.name }));
  }, [manufacturersData]);

  const brandOptions = useMemo(() => {
    const all = brandsData?.data ?? [];
    const scoped = selectedManufacturer
      ? all.filter((b: any) => b.manufacturer_ID === selectedManufacturer)
      : all;
    return scoped.map((b: any) => ({
      value: b.CarBrand_ID,
      label: b.name,
      manufacturer_ID: b.manufacturer_ID,
    }));
  }, [brandsData, selectedManufacturer]);

  const modelOptions = useMemo(() => {
    const all = modelsData?.data ?? [];

    // if brand is selected, show models under that brand
    if (selectedBrand) {
      return all
        .filter((m: any) => m.carBrand_ID === selectedBrand)
        .map((m: any) => ({ value: m.CarModel_ID, label: m.name, carBrand_ID: m.carBrand_ID }));
    }

    // if only manufacturer selected, include models that belong to any brand of that manufacturer
    if (selectedManufacturer) {
      const brandIdsForMfr = new Set(
        brandOptions
          .filter(b => b.manufacturer_ID === selectedManufacturer)
          .map(b => b.value)
      );
      return all
        .filter((m: any) => brandIdsForMfr.has(m.carBrand_ID))
        .map((m: any) => ({ value: m.CarModel_ID, label: m.name, carBrand_ID: m.carBrand_ID }));
    }

    // otherwise all
    return all.map((m: any) => ({ value: m.CarModel_ID, label: m.name, carBrand_ID: m.carBrand_ID }));
  }, [modelsData, selectedBrand, selectedManufacturer, brandOptions]);

  // ======================
  // Category pills
  // ======================
  const categoryPills = useMemo(() => {
    const list = categoriesData?.data ?? [];
    return [{ Category_ID: 'ALL', name: 'All' }, ...list];
  }, [categoriesData]);

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition
     ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;

  // ======================
  // Filtering logic (client-side)
  // ======================
  const filteredRaw = useMemo(() => {
    let raw = partsData?.data ?? [];

    // 1) Category
    if (selectedCategory && selectedCategory !== 'ALL') {
      raw = raw.filter((sp: any) => sp?.category_ID === selectedCategory);
    }

    // 2) Manufacturer (check both shapes)
    if (selectedManufacturer) {
      raw = raw.filter((sp: any) => getManufacturerId(sp) === selectedManufacturer);
    }

    // 3) Brand (check both shapes)
    if (selectedBrand) {
      raw = raw.filter((sp: any) => getBrandId(sp) === selectedBrand);
    }

    // 4) Model (check both shapes)
    if (selectedModel) {
      raw = raw.filter((sp: any) => getModelId(sp) === selectedModel);
    }

    // 5) Search in name
    if (search.trim()) {
      const q = normalizeStr(search);
      raw = raw.filter((sp: any) => normalizeStr(sp?.name).includes(q));
    }

    // 6) Sort (createdAt best-effort)
    if (sort === 'latest') {
      raw = [...raw].sort((a: any, b: any) =>
        String(b?.createdAt ?? '').localeCompare(String(a?.createdAt ?? ''))
      );
    } else if (sort === 'oldest') {
      raw = [...raw].sort((a: any, b: any) =>
        String(a?.createdAt ?? '').localeCompare(String(b?.createdAt ?? ''))
      );
    }

    return raw;
  }, [partsData, selectedCategory, selectedManufacturer, selectedBrand, selectedModel, search, sort]);

  // Map to VM for cards
  const items: ProductVM[] = useMemo(() => {
    return (filteredRaw ?? []).map((sp: any) => ({
      linkId: String(sp.id ?? sp.SparePart_ID ?? ''),
      title: sp.name,
      price: sp.price ?? 0,
      reviews: 0,
      image:
        sp.images?.find((i: any) => !!i?.image_url)?.image_url ??
        '/images/placeholder.jpg',
    }));
  }, [filteredRaw]);

  // ======================
  // Helpers
  // ======================
  const clearFilters = () => {
    setSelectedCategory('ALL');
    setSelectedManufacturer('');
    setSelectedBrand('');
    setSelectedModel('');
    setSearch('');
    setSort('latest');
  };

  // Reset child filters when parent changes
  const onChangeManufacturer = (val: string) => {
    setSelectedManufacturer(val);
    setSelectedBrand('');
    setSelectedModel('');
  };
  const onChangeBrand = (val: string) => {
    setSelectedBrand(val);
    setSelectedModel('');
  };

  // ======================
  // UI (cleaner/minimal filter bar, no heavy border)
  // ======================
  return (
    <>
      <Breadcrumb title="Explore All Products" pages={['shop']} />

      <section className="py-8 lg:py-16 flex justify-center">
        <div className="w-[80%] mx-auto">
          {/* Controls */}
          <div className="flex flex-col gap-4 bg-white rounded-xl px-6 py-5 mb-8 shadow-sm">
            {/* Row: sort + search + count + clear */}
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <CustomSelect
                  options={sortOptions}
                  value={sort}
                  onChange={(v: any) => setSort(v?.value ?? v)}
                />

                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search parts…"
                    className="h-10 w-56 sm:w-64 rounded-lg border border-gray-200 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* clean magnifying-glass */}
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

                <span className="text-sm text-gray-600 hidden sm:inline">
                  {items.length} result{items.length !== 1 ? 's' : ''}
                </span>
              </div>

              <button
                onClick={clearFilters}
                className="text-sm px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
                title="Clear all filters"
              >
                Clear filters
              </button>
            </div>

            {/* Category pills */}
            <div className="overflow-x-auto -mx-1 px-1">
              <div className="flex items-center gap-2 min-w-max pb-1">
                {categoriesLoading && (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-20 rounded-full bg-gray-100 animate-pulse"
                      />
                    ))}
                  </>
                )}

                {!categoriesLoading &&
                  !categoriesError &&
                  categoryPills.map((c: any) => (
                    <button
                      key={c.Category_ID}
                      className={pillClass(selectedCategory === c.Category_ID)}
                      onClick={() => setSelectedCategory(c.Category_ID)}
                    >
                      {c.name}
                    </button>
                  ))}

                {!categoriesLoading && categoriesError && (
                  <span className="text-sm text-red-600">
                    Failed to load categories
                  </span>
                )}
              </div>
            </div>

            {/* Cascading selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Manufacturer */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Manufacturer
                </label>
                <select
                  value={selectedManufacturer}
                  onChange={(e) => onChangeManufacturer(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                  disabled={manufacturersLoading}
                >
                  <option value="">All manufacturers</option>
                  {manufacturerOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => onChangeBrand(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                  disabled={brandsLoading || (!brandOptions.length && !selectedManufacturer)}
                >
                  <option value="">All brands</option>
                  {brandOptions.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                  disabled={modelsLoading || (!modelOptions.length && !selectedBrand && !selectedManufacturer)}
                >
                  <option value="">All models</option>
                  {modelOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading / error states for products */}
          {partsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg h-60" />
              ))}
            </div>
          )}

          {partsError && (
            <div className="text-center text-red-600">Failed to load products.</div>
          )}

          {/* Product list */}
          {!partsLoading && !partsError && (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                  : 'flex flex-col gap-6'
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
          )}
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;
