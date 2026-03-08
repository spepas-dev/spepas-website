// src/components/marketing/ShopDetails/index.tsx
import React from 'react';
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

  // Vehicle info
  const manufacturer = item?.carModel?.carBrand?.manufacturer?.name;
  const model = item?.carModel?.carBrand?.name;
  const engineVariant = item?.carModel?.name;
  const year = item?.carModel?.yearOfMake;
  // live API returns arrays (INV-6); local mock returns singular strings
  const fuelType = item?.carModel?.fuelTypes?.[0] ?? item?.carModel?.fuelType;
  const bodyType = item?.carModel?.bodyTypes?.[0] ?? item?.carModel?.bodyType;
  const driveType = item?.carModel?.driveTypes?.[0] ?? item?.carModel?.driveType;

  const hasVehicle = manufacturer || model || year || fuelType || bodyType || driveType;

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

  // Spec items for the grid
  const specs: { label: string; value: string }[] = [];
  if (manufacturer) specs.push({ label: 'Manufacturer', value: manufacturer });
  if (model) specs.push({ label: 'Model', value: model });
  if (engineVariant) specs.push({ label: 'Engine variant', value: engineVariant });
  if (year) specs.push({ label: 'Year', value: String(year) });
  if (fuelType) specs.push({ label: 'Fuel', value: fuelType });
  if (bodyType) specs.push({ label: 'Body style', value: bodyType });
  if (driveType) specs.push({ label: 'Drivetrain', value: driveType });

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

              {/* Article number */}
              {articleNo && (
                <p className="text-sm text-gray-500 font-mono tracking-wide mb-5">
                  Art. {articleNo}
                </p>
              )}

              {/* Vehicle compatibility */}
              {hasVehicle && (
                <div className="border border-gray-150 rounded-xl overflow-hidden mb-6">
                  {/* Section header */}
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-150 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-6.867c0-.298-.119-.585-.33-.796l-3.525-3.525A1.125 1.125 0 0016.618 6H15m-3 0H9.375a1.125 1.125 0 00-1.125 1.125v11.25" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Compatible vehicle</span>
                  </div>

                  {/* Spec grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-gray-100">
                    {specs.map((spec) => (
                      <div key={spec.label} className="px-4 py-3">
                        <dt className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          {spec.label}
                        </dt>
                        <dd className="text-sm font-medium text-gray-800 truncate" title={spec.value}>
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  to="../buyer/post-request"
                  state={{
                    partName: title,
                    manufacturerName: manufacturer,
                    brandName: model,
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
