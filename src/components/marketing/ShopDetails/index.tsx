// src/components/marketing/ShopDetails/index.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

  // Loading skeleton
  if (query.isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8 mt-8 animate-pulse">
          <div className="w-full md:w-1/2 h-80 bg-gray-200 rounded-lg" />
          <div className="w-full md:flex-1 space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-4 w-2/5 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>
            <div className="h-12 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const item = query.data?.item;

  // Graceful "not found" UI
  if (!item) {
    return (
      <div className="w-full max-w-lg mx-auto py-20 text-center px-4">
        <p className="text-xl text-gray-700 mb-4">Product not found.</p>
        <button
          className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded hover:bg-[var(--color-primary-600)] transition"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const imgSrc =
    item?.images?.find((i: any) => i?.image_url)?.image_url ?? '/images/placeholder.jpg';
  const title = item?.name ?? 'Product';

  // Vehicle info — renamed: Make / Model / Variant
  const make = item?.carModel?.carBrand?.manufacturer?.name;
  const model = item?.carModel?.carBrand?.name;
  const variant = item?.carModel?.name;
  const year = item?.carModel?.yearOfMake;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={imgSrc}
            alt={title}
            loading="lazy"
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Details */}
        <div className="w-full md:flex-1 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>

          <span className="inline-block text-lg text-gray-500 italic">
            Price on request
          </span>

          {(make || model || variant || year) && (
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
              {variant && (
                <div>
                  <span className="font-semibold">Variant:</span> {variant}
                </div>
              )}
              {year && (
                <div>
                  <span className="font-semibold">Year:</span> {year}
                </div>
              )}
            </div>
          )}

          <button className="w-full sm:w-auto block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
