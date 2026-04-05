import React from 'react';

import SearchableCombobox from '../Common/SearchableCombobox';
import { ShopFilters } from './useShopFilters';

type Props = Pick<
  ShopFilters,
  | 'hasYears'
  | 'allYearOptions'
  | 'selectedYear'
  | 'onChangeYear'
  | 'yearsLoading'
  | 'makeOptions'
  | 'selectedMake'
  | 'onChangeMake'
  | 'makesLoading'
  | 'brandOptions'
  | 'selectedBrand'
  | 'onChangeBrand'
  | 'brandsLoading'
  | 'modelOptions'
  | 'selectedModel'
  | 'onChangeModel'
  | 'modelsLoading'
  | 'selectedFuelType'
  | 'selectedBodyType'
  | 'selectedDriveType'
  | 'selectedEngine'
  | 'fuelTypeOptions'
  | 'bodyTypeOptions'
  | 'driveTypeOptions'
  | 'engineOptions'
  | 'updateParams'
>;

const VehicleSelector: React.FC<Props> = ({
  hasYears,
  allYearOptions,
  selectedYear,
  onChangeYear,
  yearsLoading,
  makeOptions,
  selectedMake,
  onChangeMake,
  makesLoading,
  brandOptions,
  selectedBrand,
  onChangeBrand,
  brandsLoading,
  modelOptions,
  selectedModel,
  onChangeModel,
  modelsLoading,
  selectedFuelType,
  selectedBodyType,
  selectedDriveType,
  selectedEngine,
  fuelTypeOptions,
  bodyTypeOptions,
  driveTypeOptions,
  engineOptions,
  updateParams
}) => {
  return (
    <div className="bg-white rounded-xl px-4 sm:px-6 py-4 sm:py-5 mb-4 sm:mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs sm:text-sm font-semibold text-gray-700">Find parts for your vehicle</h2>
        {selectedMake && (
          <button
            onClick={() =>
              updateParams({
                year: '',
                make: '',
                brand: '',
                model: '',
                cat: '',
                fuel: '',
                body: '',
                drive: '',
                engine: '',
                q: '',
                page: ''
              })
            }
            className="text-xs font-medium text-gray-400 hover:text-[var(--color-primary-600)] transition-colors"
          >
            Reset all filters
          </button>
        )}
      </div>

      <div className={`grid grid-cols-2 gap-2 sm:gap-3 ${hasYears ? 'lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
        {hasYears && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
            <SearchableCombobox
              options={allYearOptions.map((y) => ({ value: y, label: y }))}
              value={selectedYear}
              onChange={onChangeYear}
              placeholderLabel="All years"
              isLoading={yearsLoading}
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Manufacturer</label>
          <SearchableCombobox
            options={(makeOptions as any[]).map((m) => ({
              value: m.Manufacturer_ID,
              label: m.name,
              count: m.filteredBrandCount ?? m._count?.brands ?? m.brandCount ?? (m.brands?.length > 0 ? m.brands.length : undefined)
            }))}
            value={selectedMake}
            onChange={onChangeMake}
            placeholderLabel={hasYears && !selectedYear ? 'Select a year first' : 'e.g. Toyota, BMW, Hyundai'}
            isLoading={makesLoading}
            disabled={hasYears && !selectedYear}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
          <SearchableCombobox
            options={(brandOptions as any[]).map((b) => ({
              value: b.CarBrand_ID,
              label: b.name
            }))}
            value={selectedBrand}
            onChange={onChangeBrand}
            placeholderLabel={selectedMake ? 'e.g. Corolla, 3 Series' : 'Select manufacturer first'}
            isLoading={brandsLoading}
            disabled={!selectedMake}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Model</label>
          <SearchableCombobox
            options={(modelOptions as any[]).map((m) => ({
              value: m.CarModel_ID,
              label: `${m.name}${m.yearOfMake ? ` (${m.yearOfMake})` : ''}`
            }))}
            value={selectedModel}
            onChange={onChangeModel}
            placeholderLabel={selectedBrand ? 'e.g. 1.6 VTEC, 2.0 TDI' : 'Select brand first'}
            isLoading={modelsLoading}
            disabled={!selectedBrand}
          />
        </div>
      </div>

      {/* Attribute filter chips */}
      {selectedBrand &&
        (fuelTypeOptions.length > 0 || bodyTypeOptions.length > 0 || driveTypeOptions.length > 0 || engineOptions.length > 0) && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2">
              {fuelTypeOptions.length > 0 && (
                <ChipGroup
                  label="Fuel"
                  options={fuelTypeOptions}
                  selected={selectedFuelType}
                  onToggle={(val) => updateParams({ fuel: selectedFuelType === val ? '' : val, page: '' })}
                />
              )}
              {bodyTypeOptions.length > 0 && (
                <ChipGroup
                  label="Body"
                  options={bodyTypeOptions}
                  selected={selectedBodyType}
                  onToggle={(val) => updateParams({ body: selectedBodyType === val ? '' : val, page: '' })}
                />
              )}
              {driveTypeOptions.length > 0 && (
                <ChipGroup
                  label="Drive"
                  options={driveTypeOptions}
                  selected={selectedDriveType}
                  onToggle={(val) => updateParams({ drive: selectedDriveType === val ? '' : val, page: '' })}
                />
              )}
              {engineOptions.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-0.5">Engine</span>
                  <SearchableCombobox
                    options={[
                      { value: '', label: 'Any' },
                      ...engineOptions.map((e) => ({ value: e.value, label: e.value, count: e.count }))
                    ]}
                    value={selectedEngine}
                    onChange={(val) => updateParams({ engine: val, page: '' })}
                    placeholderLabel="Any"
                    compact
                  />
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

// ── Small helper for repeating chip groups ─────────────────────────────────
const ChipGroup: React.FC<{
  label: string;
  options: { value: string; count: number }[];
  selected: string;
  onToggle: (value: string) => void;
}> = ({ label, options, selected, onToggle }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-0.5">{label}</span>
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onToggle(opt.value)}
        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
          selected === opt.value ? 'bg-[var(--color-primary-500)] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {opt.value}
        <span className={`ml-1 text-[10px] ${selected === opt.value ? 'text-white/70' : 'text-gray-400'}`}>{opt.count}</span>
      </button>
    ))}
  </div>
);

export default VehicleSelector;
