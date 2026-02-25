// src/components/seller/Filters.tsx
import React from 'react';

interface FiltersProps {
  filter: 'all' | 'have' | 'accepted';
  onChange: (f: FiltersProps['filter']) => void;
}

const labelMap = {
  all: 'All',
  have: 'Items I have',
  accepted: 'Accepted',
};

const Filters: React.FC<FiltersProps> = ({ filter, onChange }) => (
  <div className="flex gap-2">
    {(['all', 'have'] as const).map((key) => (
      <button
        key={key}
        type="button"
        onClick={() => onChange(key)}
        className={`font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200 ${
          filter === key
            ? 'bg-blue text-white'
            : 'bg-white text-dark-2 border border-gray-3 hover:bg-gray-2'
        }`}
      >
        {labelMap[key]}
      </button>
    ))}
  </div>
);

export default Filters;
