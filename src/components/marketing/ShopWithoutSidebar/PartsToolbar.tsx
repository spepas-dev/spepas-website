import React from 'react';

import SearchableCombobox from '../Common/SearchableCombobox';
import { ShopFilters } from './useShopFilters';

type ViewMode = 'grid' | 'list';

type Props = Pick<
  ShopFilters,
  | 'search'
  | 'updateParams'
  | 'showResults'
  | 'total'
  | 'activeFilters'
  | 'clearAllFilters'
  | 'orderedCategories'
  | 'categoriesLoading'
  | 'selectedCategory'
> & {
  view: ViewMode;
  setView: (v: ViewMode) => void;
};

const PartsToolbar: React.FC<Props> = ({
  search,
  updateParams,
  showResults,
  total,
  view,
  setView,
  activeFilters,
  clearAllFilters,
  orderedCategories,
  categoriesLoading,
  selectedCategory
}) => (
  <div className="flex flex-col gap-3 mb-6">
    {/* Row: search + result count + view toggle */}
    <div className="flex flex-wrap items-center gap-3 justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => updateParams({ q: e.target.value, page: '' })}
            placeholder="Search by part name or number…"
            className="h-10 w-64 sm:w-80 rounded-lg border border-gray-200 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.1-4.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
          </svg>
        </div>
        {showResults && (
          <span className="text-sm text-gray-500 hidden sm:inline">
            {total.toLocaleString()} part{total !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* View toggle */}
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setView('grid')}
          className={`p-2 ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          aria-label="Grid view"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
        </button>
        <button
          onClick={() => setView('list')}
          className={`p-2 ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          aria-label="List view"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 5.25h16.5m-16.5-10.5h16.5" />
          </svg>
        </button>
      </div>
    </div>

    {/* Active filter chips */}
    {activeFilters.length > 0 && (
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((chip) => (
          <span
            key={chip.key}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-sm"
          >
            {chip.label}
            <button
              onClick={chip.onClear}
              className="ml-0.5 hover:text-[var(--color-primary-900)]"
              aria-label={`Remove ${chip.label} filter`}
            >
              &times;
            </button>
          </span>
        ))}
        {activeFilters.length > 1 && (
          <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Clear all
          </button>
        )}
      </div>
    )}

    {/* Mobile category selector */}
    <div className="lg:hidden">
      <SearchableCombobox
        options={[
          { value: '', label: 'All categories' },
          ...orderedCategories.map((cat) => ({
            value: cat.Category_ID,
            label: '\u00A0\u00A0'.repeat(cat.depth) + cat.name,
            count: cat.count != null && cat.count > 0 ? cat.count : undefined
          }))
        ]}
        value={selectedCategory}
        onChange={(val) => updateParams({ cat: val, page: '' })}
        placeholderLabel="All categories"
        isLoading={categoriesLoading}
      />
    </div>
  </div>
);

export default PartsToolbar;
