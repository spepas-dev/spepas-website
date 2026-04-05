import React, { useMemo, useState } from 'react';

import { ShopFilters } from './useShopFilters';

type Props = Pick<
  ShopFilters,
  'selectedCategories' | 'toggleCategoryFilter' | 'categoriesLoading' | 'orderedCategories' | 'updateParams' | 'dynamicCategoryCounts' | 'hasActiveFilters'
>;

const MobileCategoryDrawer: React.FC<Props> = ({
  selectedCategories,
  toggleCategoryFilter,
  categoriesLoading,
  orderedCategories,
  updateParams,
  dynamicCategoryCounts,
  hasActiveFilters
}) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const selectedSet = useMemo(() => new Set(selectedCategories), [selectedCategories]);

  const toggleExpand = (catId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const selectedCount = selectedCategories.length;

  return (
    <div className="lg:hidden">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700"
      >
        <span className="truncate">
          {selectedCount > 0
            ? `${selectedCount} categor${selectedCount === 1 ? 'y' : 'ies'} selected`
            : 'All categories'}
        </span>
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Backdrop + drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="relative bg-white rounded-t-2xl max-h-[75vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
              <div className="flex items-center gap-3">
                {selectedCount > 0 && (
                  <button
                    onClick={() => { updateParams({ cat: '', page: '' }); }}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-3 pt-2">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-400)]"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.1-4.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
                </svg>
              </div>
            </div>

            {/* Category list */}
            <div className="overflow-y-auto flex-1 p-3">
              {categoriesLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-9 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              )}

              {!categoriesLoading && (search
                ? // Flat search results
                  orderedCategories
                    .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
                    .map((cat) => {
                      const isSelected = selectedSet.has(cat.Category_ID);
                      return (
                        <button
                          key={cat.Category_ID}
                          onClick={() => toggleCategoryFilter(cat.Category_ID)}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            isSelected ? 'bg-[var(--color-primary-50)]' : ''
                          }`}
                        >
                          <span className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)]' : 'border-gray-300'
                          }`}>
                            {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                          </span>
                          <span className={`flex-1 text-left text-sm truncate ${isSelected ? 'text-[var(--color-primary-600)] font-medium' : 'text-gray-700'}`}>{cat.name}</span>
                          {hasActiveFilters && (dynamicCategoryCounts.get(cat.Category_ID) ?? 0) > 0 && (
                            <span className="shrink-0 text-xs text-gray-400">{(dynamicCategoryCounts.get(cat.Category_ID) ?? 0).toLocaleString()}</span>
                          )}
                        </button>
                      );
                    })
                : // Normal tree
                  orderedCategories.map((cat) => {
                // Hide children of collapsed parents
                if (cat.depth > 0 && cat.parentCategoryId && !expanded.has(cat.parentCategoryId)) return null;

                const isSelected = selectedSet.has(cat.Category_ID);
                const padLeft = 12 + cat.depth * 20;

                return (
                  <div
                    key={cat.Category_ID}
                    style={{ paddingLeft: padLeft, paddingRight: 12 }}
                    className={`flex items-center gap-2 py-2.5 rounded-lg transition-colors ${
                      isSelected ? 'bg-[var(--color-primary-50)]' : ''
                    }`}
                  >
                    {/* Expand chevron for parents */}
                    {cat.isParent ? (
                      <button
                        onClick={() => toggleExpand(cat.Category_ID)}
                        className="shrink-0 p-0.5"
                      >
                        <svg
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded.has(cat.Category_ID) ? 'rotate-90' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    ) : (
                      <span className="shrink-0 w-4 text-center text-gray-300 text-xs">•</span>
                    )}

                    {/* Checkbox */}
                    <button
                      onClick={() => toggleCategoryFilter(cat.Category_ID)}
                      className="shrink-0"
                    >
                      <span
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)]'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </span>
                    </button>

                    {/* Name — tap to expand (parent) or select (leaf) */}
                    <button
                      onClick={() => cat.isParent ? toggleExpand(cat.Category_ID) : toggleCategoryFilter(cat.Category_ID)}
                      className={`flex-1 text-left text-sm truncate ${
                        isSelected ? 'text-[var(--color-primary-600)] font-medium' : cat.depth === 0 ? 'text-gray-800 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>

                    {hasActiveFilters && (dynamicCategoryCounts.get(cat.Category_ID) ?? 0) > 0 && (
                      <span className="shrink-0 text-xs text-gray-400">{dynamicCategoryCounts.get(cat.Category_ID)}</span>
                    )}
                  </div>
                );
              }))}
            </div>

            {/* Done button */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2.5 bg-[var(--color-primary-500)] text-white text-sm font-medium rounded-xl"
              >
                Done{selectedCount > 0 ? ` (${selectedCount})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MobileCategoryDrawer;
