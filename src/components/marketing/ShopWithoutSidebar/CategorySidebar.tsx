import React from 'react';

import { ShopFilters } from './useShopFilters';

type Props = Pick<
  ShopFilters,
  'selectedCategory' | 'total' | 'categoriesLoading' | 'orderedCategories' | 'isExpanded' | 'toggleCategory' | 'updateParams'
>;

const CategorySidebar: React.FC<Props> = ({
  selectedCategory,
  total,
  categoriesLoading,
  orderedCategories,
  isExpanded,
  toggleCategory,
  updateParams
}) => (
  <aside className="w-72 shrink-0 hidden lg:block">
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>

      {/* All parts button */}
      <button
        onClick={() => updateParams({ cat: '', page: '' })}
        className={`w-full flex items-baseline justify-between gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
          !selectedCategory ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium' : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span className="text-left">All parts</span>
        {total > 0 && !selectedCategory && <span className="shrink-0 text-xs text-gray-400">{total}</span>}
      </button>

      {/* Loading skeleton */}
      {categoriesLoading && (
        <div className="space-y-2 mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Category tree */}
      {!categoriesLoading &&
        orderedCategories.map((cat) => {
          if (cat.depth > 0 && cat.parentCategoryId && !isExpanded(cat.parentCategoryId)) return null;

          const isActive = selectedCategory === cat.Category_ID;
          const padLeft = 12 + cat.depth * 16;

          if (cat.isParent) {
            const expanded = isExpanded(cat.Category_ID);
            return (
              <button
                key={cat.Category_ID}
                onClick={() => {
                  toggleCategory(cat.Category_ID);
                  updateParams({ cat: cat.Category_ID, page: '' });
                }}
                style={{ paddingLeft: padLeft, paddingRight: 12 }}
                className={`w-full flex items-center gap-1.5 py-2 rounded-lg text-sm transition-colors ${cat.depth === 0 ? 'mt-1' : ''} ${
                  isActive ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg
                  className={`w-3 h-3 shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className={`flex-1 text-left truncate ${cat.depth === 0 ? 'font-medium' : ''}`} title={cat.name}>
                  {cat.name}
                </span>
                {cat.count > 0 && <span className="shrink-0 text-xs text-gray-400 font-normal">{cat.count}</span>}
              </button>
            );
          }

          return (
            <button
              key={cat.Category_ID}
              onClick={() => updateParams({ cat: cat.Category_ID, page: '' })}
              style={{ paddingLeft: padLeft, paddingRight: 12 }}
              className={`w-full flex items-baseline justify-between gap-2 py-1.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="text-left truncate" title={cat.name}>
                {cat.name}
              </span>
              {cat.count > 0 && <span className="shrink-0 text-xs text-gray-400">{cat.count}</span>}
            </button>
          );
        })}
    </div>
  </aside>
);

export default CategorySidebar;
