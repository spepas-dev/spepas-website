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
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        <Link
          to={`${item.linkId}`}
          className="absolute inset-0"
          aria-label={`View ${item.title}`}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col items-center text-center space-y-1">
        <Link
          to={`${item.linkId}`}
          className="text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-150"
        >
          {item.title}
        </Link>

        <span className="text-sm text-gray-500 italic">Price on request</span>
      </div>
    </div>
  );
};

export default SingleGridItem;
