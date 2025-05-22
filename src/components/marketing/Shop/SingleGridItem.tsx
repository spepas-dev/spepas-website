// src/components/marketing/Shop/SingleGridItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import { Product } from './shopData';

interface SingleGridItemProps {
  item: Product;
}

const SingleGridItem: React.FC<SingleGridItemProps> = ({ item }) => {
  const imgSrc = item.imgs?.previews?.[0] ?? '/images/placeholder.jpg';

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image & overlay */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        <button
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end justify-center pb-2
                     text-white text-xs font-medium transition-opacity duration-200"
        ></button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col items-center text-center space-y-1">
        {/* Title */}
        <Link to={`/shop/${item.id}`} className="text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-150">
          {item.title}
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-blue-600 text-lg font-bold">GH₵{item.price.toFixed(2)}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src="/images/icons/icon-star.svg"
              alt="star"
              width={14}
              height={14}
              className={`${i < Math.round(item.reviews / 3) ? 'opacity-100' : 'opacity-30'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({item.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default SingleGridItem;
