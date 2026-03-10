// src/components/marketing/Shop/SingleListItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ProductVM } from './shopTypes';

interface SingleListItemProps {
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

const SingleListItem: React.FC<SingleListItemProps> = ({ item }) => {
  const imgSrc = item.image ?? '/images/placeholder.jpg';
  const rating = Math.min(5, Math.max(0, Math.round((item.reviews ?? 0) / 3)));
  const detailUrl = `/95668339501103956045/shop/${item.linkId}`;

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link
          to={detailUrl}
          className="relative shrink-0 w-full sm:w-48 md:w-56 aspect-square sm:aspect-auto sm:h-48 bg-gray-50 overflow-hidden"
          aria-label={`View ${item.title}`}
        >
          <img
            src={imgSrc}
            alt={item.title}
            loading="lazy"
            className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Details */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <Link
            to={detailUrl}
            className="text-base font-medium text-gray-800 hover:text-blue transition-colors line-clamp-2 leading-snug"
          >
            {item.title}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} filled={i < rating} />
            ))}
            <span className="text-xs text-gray-500 ml-1.5">({item.reviews ?? 0})</span>
          </div>

          {/* Price */}
          <div className="mt-3">
            <span className="text-xl font-bold text-gray-900">
              GH₵{Number(item.price ?? 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-3">
            <Link
              to={detailUrl}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue hover:underline"
            >
              View Details
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
