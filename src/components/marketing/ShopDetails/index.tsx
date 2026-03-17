/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/marketing/ShopDetails/index.tsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Breadcrumb from '../Common/Breadcrumb';
import { getSparePartDetailByCode, getSpareParts } from '@/lib/inventoryApis';

type DetailPayload =
  | { source: 'detail' | 'list'; item: any | null }
  | { source: 'error'; item: null; reason?: unknown };

const ShopDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNumericId = !!id && /^\d+$/.test(id ?? '');
  const [showAllVehicles, setShowAllVehicles] = useState(false);

  const query = useQuery({
    queryKey: ['shop-detail', id],
    queryFn: async (): Promise<DetailPayload> => {
      if (!id) return { source: 'error', item: null };

      if (isNumericId) {
        try {
          const detail = await getSparePartDetailByCode(id);
          if (detail?.data) return { source: 'detail', item: detail.data };
        } catch {
          // swallow & fall back to list
        }
      }

      try {
        const list = await getSpareParts();
        const items: any[] = list?.data ?? [];
        const item =
          (isNumericId ? items.find(p => p?.id === Number(id)) : undefined) ??
          (!isNumericId ? items.find(p => p?.SparePart_ID === id) : undefined) ??
          null;
        return { source: 'list', item };
      } catch (e) {
        return { source: 'error', item: null, reason: e };
      }
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const item = query.data?.item;
  const title = item?.name ?? 'Part';

  // Part info
  const articleNo = item?.article_no ?? item?.articleNo;
  const supplierName = item?.supplier_name ?? item?.supplierName;
  const categoryName = item?.category?.name;

  // All compatible vehicles from partVehicles array
  const partVehicles: any[] = item?.partVehicles ?? [];
  const totalVehicleCount = item?._count?.partVehicles ?? partVehicles.length;

  // Group vehicles by brand for a cleaner display
  const vehiclesByBrand = React.useMemo(() => {
    const map = new Map<string, { brand: string; manufacturer: string; yearRange: string; vehicles: any[] }>();
    for (const pv of partVehicles) {
      const cm = pv?.carModel;
      if (!cm) continue;
      const brandName = cm.carBrand?.name ?? 'Unknown';
      const mfrName = cm.carBrand?.manufacturer?.name ?? '';
      const brandKey = cm.carBrand_ID ?? brandName;
      if (!map.has(brandKey)) {
        const yFrom = cm.carBrand?.yearFrom;
        const yTo = cm.carBrand?.yearTo;
        const yearRange = yFrom ? `${yFrom}–${yTo ?? 'present'}` : '';
        map.set(brandKey, { brand: brandName, manufacturer: mfrName, yearRange, vehicles: [] });
      }
      map.get(brandKey)!.vehicles.push(cm);
    }
    return [...map.values()].sort((a, b) => a.brand.localeCompare(b.brand));
  }, [partVehicles]);

  const hasVehicles = vehiclesByBrand.length > 0;

  // Loading skeleton
  if (query.isLoading) {
    return (
      <>
        <Breadcrumb title="Part Details" pages={['Browse Spare Parts']} />
        <section className="py-8 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-5 w-32 bg-gray-200 rounded mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-2 aspect-square bg-gray-100 rounded-2xl" />
                <div className="md:col-span-3 space-y-5">
                  <div className="h-4 w-20 bg-gray-200 rounded-full" />
                  <div className="h-8 w-3/4 bg-gray-200 rounded" />
                  <div className="h-5 w-1/3 bg-gray-200 rounded" />
                  <div className="h-px bg-gray-100 my-4" />
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-10 bg-gray-100 rounded-lg" />
                    ))}
                  </div>
                  <div className="h-12 w-48 bg-gray-200 rounded-xl mt-6" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Not found
  if (!item) {
    return (
      <>
        <Breadcrumb title="Part Details" pages={['Browse Spare Parts']} />
        <section className="py-8 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-5">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-800 mb-2">Part not found</p>
            <p className="text-sm text-gray-500 mb-6">The part you're looking for may have been removed or the link is incorrect.</p>
            <button
              className="px-5 py-2.5 bg-[var(--color-primary-500)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-600)] transition-colors"
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
          </div>
        </section>
      </>
    );
  }

  const imgSrc =
    item?.images?.find((i: any) => i?.image_url)?.image_url ?? '/images/placeholder.jpg';

  // For the CTA link — use first vehicle's info
  const firstVehicle = partVehicles[0]?.carModel;
  const firstManufacturer = firstVehicle?.carBrand?.manufacturer?.name;
  const firstBrand = firstVehicle?.carBrand?.name;

  // How many brand groups to show before "Show more"
  const INITIAL_BRANDS = 3;
  const visibleBrands = showAllVehicles ? vehiclesByBrand : vehiclesByBrand.slice(0, INITIAL_BRANDS);
  const hasMoreBrands = vehiclesByBrand.length > INITIAL_BRANDS;

  return (
    <>
      <Breadcrumb title="Part Details" pages={['Browse Spare Parts', title]} />

      <section className="py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary-600)] mb-6 transition-colors"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to results
          </button>

          {/* Main layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10">
            {/* ── Image ────────────────────────────── */}
            <div className="md:col-span-2">
              <div className="sticky top-24">
                <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center aspect-square overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={title}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* ── Details ──────────────────────────── */}
            <div className="md:col-span-3">
              {/* Supplier badge */}
              {supplierName && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs font-semibold tracking-wide uppercase mb-3">
                  {supplierName}
                </div>
              )}

              {/* Part name */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-dark)] leading-tight mb-2">
                {title}
              </h1>

              {/* Article number & category */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5">
                {articleNo && (
                  <span className="text-sm text-gray-500 font-mono tracking-wide">
                    Art. {articleNo}
                  </span>
                )}
                {categoryName && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {categoryName}
                  </span>
                )}
              </div>

              {/* Compatible vehicles */}
              {hasVehicles && (
                <div className="border border-gray-150 rounded-xl overflow-hidden mb-6">
                  {/* Section header */}
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-150 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-6.867c0-.298-.119-.585-.33-.796l-3.525-3.525A1.125 1.125 0 0016.618 6H15m-3 0H9.375a1.125 1.125 0 00-1.125 1.125v11.25" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Compatible vehicles
                    </span>
                    {totalVehicleCount > 0 && (
                      <span className="ml-auto text-[11px] font-medium text-gray-400">
                        {totalVehicleCount} variant{totalVehicleCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Vehicle groups by brand */}
                  <div className="divide-y divide-gray-100">
                    {visibleBrands.map((group) => (
                      <div key={group.brand} className="px-4 py-3">
                        {/* Brand header */}
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-xs font-bold text-[var(--color-primary-700)] uppercase tracking-wider">
                            {group.manufacturer}
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            {group.brand}
                          </span>
                          {group.yearRange && (
                            <span className="text-[11px] text-gray-400">
                              ({group.yearRange})
                            </span>
                          )}
                        </div>

                        {/* Model variants */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {group.vehicles.map((v: any, idx: number) => (
                            <div key={v.CarModel_ID ?? idx} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-2.5 py-1.5">
                              <span className="font-medium text-gray-700 truncate flex-1" title={v.name}>
                                {v.name}
                              </span>
                              {v.powerPs && (
                                <span className="shrink-0 text-gray-400">{v.powerPs} hp</span>
                              )}
                              {v.fuelTypes?.[0] && (
                                <span className="shrink-0 text-gray-400">{v.fuelTypes[0]}</span>
                              )}
                              {v.constructionStart && (
                                <span className="shrink-0 text-gray-400">
                                  {v.constructionStart}–{v.constructionEnd ?? '...'}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show more / less toggle */}
                  {hasMoreBrands && (
                    <button
                      onClick={() => setShowAllVehicles(!showAllVehicles)}
                      className="w-full text-center text-xs font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] py-2.5 border-t border-gray-100 transition-colors"
                    >
                      {showAllVehicles
                        ? 'Show fewer'
                        : `Show all ${vehiclesByBrand.length} vehicle groups`}
                    </button>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  to="../buyer/post-request"
                  state={{
                    partName: title,
                    manufacturerName: firstManufacturer,
                    brandName: firstBrand,
                  }}
                  className="inline-flex items-center gap-2 bg-[var(--color-secondary-500)] hover:bg-[var(--color-secondary-600)] text-white font-semibold py-3 px-7 rounded-xl transition-colors shadow-sm hover:shadow"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.086-.777 2.328-1.874l1.518-6.694A1.125 1.125 0 0019.32 4.5H6.23" />
                  </svg>
                  Request This Part
                </Link>
                <span className="text-xs text-gray-400">Price available on request</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopDetails;
