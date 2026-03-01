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

      // Try the detail endpoint if param looks numeric
      if (isNumericId) {
        try {
          const detail = await getSparePartDetailByCode(id);
          if (detail?.data) return { source: 'detail', item: detail.data };
        } catch {
          // swallow & fall back to list
        }
      }

      // Fall back to list search (works for numeric id or UUID)
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
  const title = item?.name ?? 'Product';

  // Article / Supplier info
  const articleNo = item?.article_no;
  const supplierName = item?.supplier_name;

  // Vehicle info — Make & Model only
  const make = item?.carModel?.carBrand?.manufacturer?.name;
  const model = item?.carModel?.carBrand?.name;

  // Loading skeleton
  if (query.isLoading) {
    return (
      <>
        <Breadcrumb title="Part Details" pages={['Shop']} />
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-8 animate-pulse">
                <div className="w-full md:w-1/2 h-80 bg-gray-200 rounded-lg" />
                <div className="w-full md:flex-1 space-y-4">
                  <div className="h-8 w-3/4 bg-gray-200 rounded" />
                  <div className="h-6 w-1/3 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-4 w-2/5 bg-gray-200 rounded" />
                  </div>
                  <div className="h-12 w-40 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Graceful "not found" UI
  if (!item) {
    return (
      <>
        <Breadcrumb title="Part Details" pages={['Shop']} />
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <p className="text-xl text-gray-700 mb-4">Part not found.</p>
            <button
              className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </section>
      </>
    );
  }

  const imgSrc =
    item?.images?.find((i: any) => i?.image_url)?.image_url ?? '/images/placeholder.jpg';

  return (
    <>
      <Breadcrumb title="Part Details" pages={['Shop', title]} />

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Shop */}
          <Link
            to="../shop"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[var(--color-primary-600)] mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Shop
          </Link>

          {/* Detail card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={imgSrc}
                  alt={title}
                  loading="lazy"
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>

              {/* Details */}
              <div className="w-full md:flex-1 space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>

                {(articleNo || supplierName) && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {articleNo && (
                      <div>
                        <span className="font-semibold">Article No:</span> {articleNo}
                      </div>
                    )}
                    {supplierName && (
                      <div>
                        <span className="font-semibold">Supplier:</span> {supplierName}
                      </div>
                    )}
                  </div>
                )}

                <span className="inline-block text-lg text-gray-500 italic">
                  Contact Seller for Price
                </span>

                {(make || model) && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {make && (
                      <div>
                        <span className="font-semibold">Make:</span> {make}
                      </div>
                    )}
                    {model && (
                      <div>
                        <span className="font-semibold">Model:</span> {model}
                      </div>
                    )}
                  </div>
                )}

                <Link
                  to="../buyer/post-request"
                  state={{
                    partName: title,
                    manufacturerName: make,
                    brandName: model,
                  }}
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  Request This Part
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopDetails;
