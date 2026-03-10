// src/components/marketing/ShopDetails/index.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../Common/Breadcrumb'; // <- same path used elsewhere
import { useQuery } from '@tanstack/react-query';
import { getSparePartDetailByCode, getSpareParts } from '@/lib/inventoryApis';
import SpepasLoader from '@/components/common/SpepasLoader';

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
        } catch (e) {
          // swallow & fall back to list
          // console.debug('detail endpoint failed; falling back to list', e);
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
        // If list fetch/parsing fails, don’t throw to the router
        return { source: 'error', item: null, reason: e };
      }
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  // Loading shell
  if (query.isLoading) {
    return <SpepasLoader size="lg" label="Loading product..." fullSection />;
  }

  const item = query.data?.item;

  // Graceful “not found / failed” UI — no throws
  if (!item) {
    return (
      <div className="w-full max-w-lg mx-auto py-20 text-center px-4">
        <p className="text-xl text-gray-700 mb-4">Product not found.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
  const price = Number(item?.price ?? 0);

  const brand = item?.carModel?.carBrand?.name;
  const model = item?.carModel?.name;
  const year = item?.carModel?.yearOfMake;
  const manufacturer = item?.carModel?.carBrand?.manufacturer?.name;

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

          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            GH₵{price.toFixed(2)}
          </div>

          {(brand || model || year || manufacturer) && (
            <div className="text-sm text-gray-600 space-y-1">
              {manufacturer && (
                <div>
                  <span className="font-semibold">Manufacturer:</span> {manufacturer}
                </div>
              )}
              {brand && (
                <div>
                  <span className="font-semibold">Brand:</span> {brand}
                </div>
              )}
              {model && (
                <div>
                  <span className="font-semibold">Model:</span> {model}
                </div>
              )}
              {year && (
                <div>
                  <span className="font-semibold">Year:</span> {year}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                src="/images/icons/icon-star.svg"
                alt="star"
                className="w-4 h-4 sm:w-5 sm:h-5 opacity-30"
              />
            ))}
            <span className="ml-2 text-sm sm:text-base text-gray-600">(0 reviews)</span>
          </div>

          <button className="w-full sm:w-auto block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
