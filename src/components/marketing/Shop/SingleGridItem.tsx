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
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image & overlay (now clickable) */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        <Link
          to={`/shop/${item.linkId}`}
          className="absolute inset-0"
          aria-label={`Open ${item.title}`}
        >
          {/* Visual overlay (kept inactive, only for hover effect) */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col items-center text-center space-y-1">
        <Link
          to={`/shop/${item.linkId}`}
          className="text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-150"
        >
          {item.title}
        </Link>

        <div className="flex items-baseline gap-1">
          <span className="text-blue-600 text-lg font-bold">
            GH₵{Number(item.price ?? 0).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src="/images/icons/icon-star.svg"
              alt="star"
              width={14}
              height={14}
              className={`${i < Math.round((item.reviews ?? 0) / 3) ? 'opacity-100' : 'opacity-30'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({item.reviews ?? 0})</span>
        </div>
      </div>
    </div>
  );
};

export default SingleGridItem;
