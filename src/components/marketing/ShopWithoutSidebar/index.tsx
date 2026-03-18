import React from 'react';

import Breadcrumb from '../Common/Breadcrumb';
import CategorySidebar from './CategorySidebar';
import PartsContent from './PartsContent';
import PartsToolbar from './PartsToolbar';
import { useShopFilters } from './useShopFilters';
import VehicleBanner from './VehicleBanner';
import VehicleSelector from './VehicleSelector';

const ShopWithoutSidebar: React.FC = () => {
  const f = useShopFilters();

  return (
    <>
      <Breadcrumb title="Browse Spare Parts" pages={['shop']} />

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* Left column — categories */}
            <CategorySidebar
              selectedCategory={f.selectedCategory}
              total={f.total}
              categoriesLoading={f.categoriesLoading}
              orderedCategories={f.orderedCategories}
              isExpanded={f.isExpanded}
              toggleCategory={f.toggleCategory}
              updateParams={f.updateParams}
            />

            {/* Right column — everything else */}
            <div className="flex-1 min-w-0">
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
                selectedCategory={f.selectedCategory}
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
