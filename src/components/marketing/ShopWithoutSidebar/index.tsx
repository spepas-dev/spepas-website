import React, { useMemo, useState } from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import SingleGridItem from '../Shop/SingleGridItem';
import SingleListItem from '../Shop/SingleListItem';
import CustomSelect from '../ShopWithSidebar/CustomSelect';
import { useQuery } from '@tanstack/react-query';
import { getSpareParts, getSparePartCategories } from '@/lib/inventoryApis';
import { ProductVM } from '../Shop/shopTypes';

const options = [
  { label: 'Latest Products', value: '0' },
  { label: 'Best Selling',   value: '1' },
  { label: 'Old Products',   value: '2' },
];

const ShopWithoutSidebar: React.FC = () => {
  const [view] = useState<'grid' | 'list'>('grid'); // keeping your original (toggles are commented out)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const {
    data: partsData,
    isLoading: partsLoading,
    isError: partsError,
  } = useQuery({
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

  // Filter raw API response by selected category (client-side)
  const filteredRaw = useMemo(() => {
    const raw = partsData?.data ?? [];
    if (!selectedCategory || selectedCategory === 'ALL') return raw;
    return raw.filter((sp: any) => sp.category_ID === selectedCategory);
  }, [partsData, selectedCategory]);

  // Map to your lightweight UI VM
  const items: ProductVM[] = useMemo(() => {
    return filteredRaw.map((sp: any) => ({
      linkId: String(sp.id),               // we’ll use numeric id for details route param
      title: sp.name,
      price: sp.price ?? 0,
      reviews: 0,                          // API has no ratings; keep UI stable
      image:
        sp.images?.find((i: any) => !!i?.image_url)?.image_url ??
        '/images/placeholder.jpg',
    }));
  }, [filteredRaw]);

  const pills = useMemo(() => {
    const list = categoriesData?.data ?? [];
    return [{ Category_ID: 'ALL', name: 'All' }, ...list];
  }, [categoriesData]);

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition
     ${active
       ? 'bg-blue-600 text-white border-blue-600'
       : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
     }`;

  return (
    <>
      <Breadcrumb title="Explore All Products" pages={['shop']} />

      <section className="py-8 lg:py-16 flex justify-center">
        <div className="w-[80%] mx-auto">
          {/* Top bar */}
          <div className="flex flex-col gap-4 bg-white rounded-lg px-6 py-4 mb-8">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <CustomSelect options={options} />
                {/* keep count/commented bits same as your original */}
              </div>
              {/* View toggles left commented out (per your original) */}
            </div>

            {/* Category pill bar */}
            <div className="overflow-x-auto">
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

                {!categoriesLoading && !categoriesError && pills.map((c: any) => (
                  <button
                    key={c.Category_ID}
                    className={pillClass(selectedCategory === c.Category_ID)}
                    onClick={() => setSelectedCategory(c.Category_ID)}
                  >
                    {c.name}
                  </button>
                ))}

                {!categoriesLoading && categoriesError && (
                  <span className="text-sm text-red-600">Failed to load categories</span>
                )}
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

          {/* Product grid / list */}
          {!partsLoading && !partsError && (
            <div className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                : 'flex flex-col gap-6'
            }>
              {items.map(item =>
                view === 'grid'
                  ? <SingleGridItem item={item} key={item.linkId} />
                  : <SingleListItem item={item} key={item.linkId} />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;
