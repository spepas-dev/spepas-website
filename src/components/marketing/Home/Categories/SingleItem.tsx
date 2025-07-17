// src/components/SingleItem.tsx
import React from 'react';
import type { Category } from '@/types/category';

interface SingleItemProps {
  item: Category;
}

const SingleItem: React.FC<SingleItemProps> = ({ item }) => {
  return (
    <a href="#" className="group flex flex-col items-center">
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4">
        <img
          src={item.img}
          alt={item.title}
          width={82}
          height={62}
          className="object-contain"
        />
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {item.title}
        </h3>
      </div>
    </a>
  );
};

export default SingleItem;
