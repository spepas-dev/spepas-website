// src/components/marketing/Shop/SingleListItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ProductVM } from './shopTypes';

interface SingleListItemProps {
  item: ProductVM;
}

const SingleListItem: React.FC<SingleListItemProps> = ({ item }) => {
  return (
    <div className="group rounded-lg bg-white shadow">
      <div className="flex">
        <Link
          to={`/95668339501103956045/shop/${item.linkId}`}
          className="relative overflow-hidden flex items-center justify-center w-64 h-48 p-4 shrink-0"
          aria-label={`Open ${item.title}`}
        >
          <img
            src={item.image ?? '/images/placeholder.jpg'}
            alt={item.title}
            className="object-cover w-full h-full rounded-l-lg"
          />
        </Link>

        <div className="flex-1 p-4 flex flex-col justify-center">
          <h3 className="text-lg font-medium mb-2">
            <Link
              to={`/95668339501103956045/shop/${item.linkId}`}
              className="hover:text-blue-600 transition-colors duration-150"
            >
              {item.title}
            </Link>
          </h3>
          <span className="text-sm text-gray-500 italic">Price on request</span>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
