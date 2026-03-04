// src/components/marketing/Shop/SingleGridItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ProductVM } from './shopTypes';

interface SingleGridItemProps {
  item: ProductVM;
}

const SingleGridItem: React.FC<SingleGridItemProps> = ({ item }) => {
  const imgSrc = item.image ?? '/images/placeholder.jpg';

  return (
    <Link
      to={`${item.linkId}`}
      className="group relative flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-[var(--color-primary-200)] hover:shadow-md transition-all duration-200"
      aria-label={`View ${item.title}`}
    >
      {/* Image — neutral background, object-contain for technical parts */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.title}
          loading="lazy"
          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      {/* Content — supplier prominent since many parts share the same name */}
      <div className="flex-1 flex flex-col gap-0.5 px-3.5 py-3 border-t border-gray-50">
        {item.supplierName && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-600)]">
            {item.supplierName}
          </span>
        )}

        <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-[var(--color-primary-600)] transition-colors">
          {item.title}
        </h3>

        {item.articleNo && (
          <span className="text-[11px] text-gray-400 font-mono tracking-wide mt-0.5" title={item.articleNo}>
            {item.articleNo}
          </span>
        )}
      </div>
    </Link>
  );
};

export default SingleGridItem;
