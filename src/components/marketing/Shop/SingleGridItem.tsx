// src/components/marketing/Shop/SingleGridItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ProductVM } from './shopTypes';

interface SingleGridItemProps {
  item: ProductVM;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 20 20"
    fill={filled ? '#F59E0B' : 'none'}
    stroke={filled ? '#F59E0B' : '#D1D5DB'}
    strokeWidth="1.5"
  >
    <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z" />
  </svg>
);

const SingleGridItem: React.FC<SingleGridItemProps> = ({ item }) => {
  const imgSrc = item.image ?? '/images/placeholder.jpg';
  const rating = Math.min(5, Math.max(0, Math.round((item.reviews ?? 0) / 3)));
  const detailUrl = `/95668339501103956045/shop/${item.linkId}`;

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Product image */}
      <Link to={detailUrl} className="relative block aspect-square bg-gray-50 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.title}
          loading="lazy"
          className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product info */}
      <div className="p-3 flex flex-col flex-1">
        {/* Title — 2 lines max */}
        <Link
          to={detailUrl}
          className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 hover:text-blue transition-colors min-h-[2.5rem]"
        >
          {item.title}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < rating} />
          ))}
          <span className="text-xs text-gray-500 ml-1">({item.reviews ?? 0})</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-2">
          <span className="text-lg font-bold text-gray-900">
            GH₵{Number(item.price ?? 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Add-to-cart hint on hover */}
        <Link
          to={detailUrl}
          className="mt-2 block w-full text-center text-sm font-medium py-2 rounded-md bg-blue text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SingleGridItem;
