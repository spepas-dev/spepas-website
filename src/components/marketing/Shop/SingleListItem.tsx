// src/components/marketing/Shop/SingleListItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ProductVM } from './shopTypes';

interface SingleListItemProps {
  item: ProductVM;
}

const SingleListItem: React.FC<SingleListItemProps> = ({ item }) => {
  return (
    <Link
      to={`${item.linkId}`}
      className="group flex items-center gap-3 rounded-lg bg-white border border-gray-100 px-3 py-2 hover:border-[var(--color-primary-200)] hover:shadow-sm transition-all"
      aria-label={`View ${item.title}`}
    >
      {/* Small thumbnail — object-contain on neutral bg */}
      <div className="w-11 h-11 shrink-0 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center p-1">
        <img
          src={item.image ?? '/images/placeholder.jpg'}
          alt=""
          loading="lazy"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Part name — primary column */}
      <span className="flex-1 min-w-0 text-sm font-medium text-gray-800 truncate group-hover:text-[var(--color-primary-600)] transition-colors">
        {item.title}
      </span>

      {/* Article number */}
      {item.articleNo && (
        <span className="hidden sm:block shrink-0 text-[11px] text-gray-400 font-mono w-28 truncate text-right" title={item.articleNo}>
          {item.articleNo}
        </span>
      )}

      {/* Supplier */}
      {item.supplierName && (
        <span className="hidden md:block shrink-0 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-24 truncate text-right" title={item.supplierName}>
          {item.supplierName}
        </span>
      )}

      {/* Category */}
      {item.categoryName && (
        <span className="hidden lg:block shrink-0 text-[11px] text-gray-400 w-36 truncate text-right" title={item.categoryName}>
          {item.categoryName}
        </span>
      )}

      {/* Arrow */}
      <svg className="w-4 h-4 shrink-0 text-gray-300 group-hover:text-[var(--color-primary-400)] transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
};

export default SingleListItem;
