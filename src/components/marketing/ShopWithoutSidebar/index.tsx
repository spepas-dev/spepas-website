import React, { useState } from 'react';

import Breadcrumb from '../Common/Breadcrumb';
import CategorySidebar from './CategorySidebar';
import PartsContent from './PartsContent';
import PartsToolbar from './PartsToolbar';
import { useShopFilters } from './useShopFilters';
import VehicleBanner from './VehicleBanner';
import VehicleSelector from './VehicleSelector';

const ShopWithoutSidebar: React.FC = () => {
  const f = useShopFilters();
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Count how many filters are active (for the badge)
  const activeFilterCount =
    [
      f.selectedYear,
      f.selectedMake,
      f.selectedBrand,
      f.selectedModel,
      f.selectedFuelType,
      f.selectedBodyType,
      f.selectedDriveType,
      f.selectedEngine,
      f.search.trim()
    ].filter(Boolean).length + f.selectedCategories.length;

  return (
    <>
      <Breadcrumb title="Browse Spare Parts" pages={['shop']} />

      <section className="py-4 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* Left column — categories (desktop only) */}
            <CategorySidebar
              selectedCategories={f.selectedCategories}
              toggleCategoryFilter={f.toggleCategoryFilter}
              total={f.total}
              categoriesLoading={f.categoriesLoading}
              orderedCategories={f.orderedCategories}
              isExpanded={f.isExpanded}
              toggleCategory={f.toggleCategory}
              updateParams={f.updateParams}
              matchingCategoryIds={f.matchingCategoryIds}
            />

            {/* Right column — everything else */}
            <div className="flex-1 min-w-0">
              {/* Filters toggle button */}
              <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                <button
                  onClick={() => setFiltersOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    filtersOpen
                      ? 'bg-[var(--color-primary-500)] text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        filtersOpen ? 'bg-white/20 text-white' : 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]'
                      }`}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {activeFilterCount > 0 && !filtersOpen && (
                  <button
                    onClick={() =>
                      f.updateParams({
                        year: '',
                        make: '',
                        brand: '',
                        model: '',
                        fuel: '',
                        body: '',
                        drive: '',
                        engine: '',
                        cat: '',
                        q: '',
                        page: ''
                      })
                    }
                    className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Vehicle filters — toggled by Filters button */}
              {filtersOpen && (
                <VehicleSelector
                  hasYears={f.hasYears}
                  allYearOptions={f.allYearOptions}
                  selectedYear={f.selectedYear}
                  onChangeYear={f.onChangeYear}
                  yearsLoading={f.yearsLoading}
                  makeOptions={f.makeOptions}
                  selectedMake={f.selectedMake}
                  onChangeMake={f.onChangeMake}
                  makesLoading={f.makesLoading}
                  brandOptions={f.brandOptions}
                  selectedBrand={f.selectedBrand}
                  onChangeBrand={f.onChangeBrand}
                  brandsLoading={f.brandsLoading}
                  modelOptions={f.modelOptions}
                  selectedModel={f.selectedModel}
                  onChangeModel={f.onChangeModel}
                  modelsLoading={f.modelsLoading}
                  selectedFuelType={f.selectedFuelType}
                  selectedBodyType={f.selectedBodyType}
                  selectedDriveType={f.selectedDriveType}
                  selectedEngine={f.selectedEngine}
                  fuelTypeOptions={f.fuelTypeOptions}
                  bodyTypeOptions={f.bodyTypeOptions}
                  driveTypeOptions={f.driveTypeOptions}
                  engineOptions={f.engineOptions}
                  updateParams={f.updateParams}
                />
              )}

              {f.vehicleSelected && f.vehicleSummary && <VehicleBanner vehicleSummary={f.vehicleSummary} total={f.total} />}

              <PartsToolbar
                search={f.search}
                updateParams={f.updateParams}
                showResults={f.showResults}
                total={f.total}
                view={f.view}
                setView={f.setView}
                activeFilters={f.activeFilters}
                clearAllFilters={f.clearAllFilters}
                orderedCategories={f.orderedCategories}
                categoriesLoading={f.categoriesLoading}
                selectedCategories={f.selectedCategories}
                toggleCategoryFilter={f.toggleCategoryFilter}
              />

              <PartsContent
                showResults={f.showResults}
                partsLoading={f.partsLoading}
                partsError={f.partsError}
                view={f.view}
                items={f.items}
                activeFilters={f.activeFilters}
                clearAllFilters={f.clearAllFilters}
                page={f.page}
                setPage={f.setPage}
                totalPages={f.totalPages}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;
