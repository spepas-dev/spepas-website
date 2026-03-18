import React from 'react';

import { ProductVM } from '../Shop/shopTypes';
import SingleGridItem from '../Shop/SingleGridItem';
import SingleListItem from '../Shop/SingleListItem';
import { pageNumbers, ShopFilters } from './useShopFilters';

type ViewMode = 'grid' | 'list';

type Props = Pick<
  ShopFilters,
  'showResults' | 'partsLoading' | 'partsError' | 'activeFilters' | 'clearAllFilters' | 'page' | 'setPage' | 'totalPages'
> & {
  view: ViewMode;
  items: ProductVM[];
};

const PartsContent: React.FC<Props> = ({
  showResults,
  partsLoading,
  partsError,
  view,
  items,
  activeFilters,
  clearAllFilters,
  page,
  setPage,
  totalPages
}) => {
  // Loading skeleton
  if (partsLoading) {
    return (
      <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-1'}>
        {Array.from({ length: view === 'grid' ? 12 : 8 }).map((_, i) =>
          view === 'grid' ? (
            <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100" />
              <div className="px-3.5 py-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
              </div>
            </div>
          ) : (
            <div key={i} className="animate-pulse flex items-center gap-3 bg-white rounded-lg border border-gray-100 px-3 py-2 h-[60px]">
              <div className="w-11 h-11 bg-gray-100 rounded-md shrink-0" />
              <div className="flex-1 h-4 bg-gray-100 rounded w-1/3" />
            </div>
          )
        )}
      </div>
    );
  }

  // Error state
  if (partsError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-error-50)] flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-[var(--color-error-400)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-700 mb-1.5">Something went wrong</p>
        <p className="text-sm text-gray-400">Could not load parts. Please try again.</p>
      </div>
    );
  }

  // Prompt — no results criteria selected
  if (!showResults) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-700 mb-1.5">Browse spare parts</p>
        <p className="text-sm text-gray-400 max-w-xs">Pick a category, search by name, or select your vehicle above to find parts.</p>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-700 mb-1.5">No parts found</p>
        <p className="text-sm text-gray-400 max-w-xs mb-4">Try a different model or clear some filters above.</p>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  // Parts grid / list + pagination
  return (
    <>
      {view === 'list' && (
        <div className="flex items-center gap-3 px-3 py-1.5 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          <span className="w-11 shrink-0" />
          <span className="flex-1 min-w-0">Part name</span>
          <span className="hidden sm:block w-28 shrink-0 text-right">Article no.</span>
          <span className="hidden md:block w-24 shrink-0 text-right">Supplier</span>
          <span className="hidden lg:block w-36 shrink-0 text-right">Category</span>
          <span className="w-4 shrink-0" />
        </div>
      )}

      <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-1'}>
        {items.map((item) =>
          view === 'grid' ? <SingleGridItem item={item} key={item.linkId} /> : <SingleListItem item={item} key={item.linkId} />
        )}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center items-center gap-1 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Prev
          </button>
          {pageNumbers(page, totalPages).map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                &hellip;
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  p === page
                    ? 'bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
};

export default PartsContent;
