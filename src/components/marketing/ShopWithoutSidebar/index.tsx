// src/components/marketing/ShopWithoutSidebar.tsx
import React, { useState } from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import shopData from '../Shop/shopData';
import SingleGridItem from '../Shop/SingleGridItem';
import SingleListItem from '../Shop/SingleListItem';
import CustomSelect from '../ShopWithSidebar/CustomSelect';

const ShopWithoutSidebar: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const options = [
    { label: 'Latest Products', value: '0' },
    { label: 'Best Selling',   value: '1' },
    { label: 'Old Products',    value: '2' },
  ];

  return (
    <>
      <Breadcrumb title="Explore All Products" pages={['shop']} />

      <section className="py-8 lg:py-16 flex justify-center">
        <div className="w-[80%] mx-auto">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between bg-white  rounded-lg px-6 py-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <CustomSelect options={options} />
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">9 of 50</span> Products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('grid')}
                aria-label="Grid view"
                className={`
                  flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full
                  transition-colors duration-200
                  ${view === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                {/* simple grid icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3h4v4H5V3zm6 0h4v4h-4V3zM5 9h4v4H5V9zm6 0h4v4h-4V9z" />
                </svg>
                <span>Grid</span>
              </button>

              <button
                onClick={() => setView('list')}
                aria-label="List view"
                className={`
                  flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full
                  transition-colors duration-200
                  ${view === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                {/* simple list icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z" />
                </svg>
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Product grid / list */}
          <div className={
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'flex flex-col gap-6'
          }>
            {shopData.map(item =>
              view === 'grid'
                ? <SingleGridItem item={item} key={item.id} />
                : <SingleListItem item={item} key={item.id}/>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;
