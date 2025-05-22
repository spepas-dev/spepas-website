// src/components/seller/Filters.tsx
import React from 'react';

interface FiltersProps {
  filter: 'all'|'have'|'accepted';
  onChange: (f: FiltersProps['filter']) => void;
}

const labelMap = {
  all: 'All',
  have: 'Items I have',
  accepted: 'Accepted',
};

const Filters: React.FC<FiltersProps> = ({ filter, onChange }) => (
  <div>
    {(['all','have'] as const).map(key => (
      <button
        key={key}
        className={`ml-2 px-2 py-1 rounded-full text-xs ${
          filter===key ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
        }`}
        onClick={() => onChange(key)}
      >
        {labelMap[key]}
      </button>
    ))}
  </div>
);

export default Filters;
