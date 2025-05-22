// src/components/marketing/Shop/SingleListItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from './shopData';

interface SingleListItemProps {
  item: Product;
}

const SingleListItem: React.FC<SingleListItemProps> = ({ item }) => {
  return (
    <div className="group rounded-lg bg-white shadow">
      <div className="flex">
        <div className="relative overflow-hidden flex items-center justify-center w-64 h-64 p-4">
          <img
            src={item.imgs.previews[0]}
            alt={item.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium mb-2">
              <Link to="/shop-details">{item.title}</Link>
            </h3>
            <div className="flex items-center gap-2 text-xl font-semibold">
              <span className="line-through text-gray-500">GHc{item.price}</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src="/images/icons/icon-star.svg"
                  alt="star"
                  width={15}
                  height={15}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({item.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
