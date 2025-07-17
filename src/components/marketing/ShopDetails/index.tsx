// src/components/marketing/ShopDetails/index.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import shopData, { Product } from '@/components/marketing/Shop/shopData';
import Breadcrumb from '@/components/common/Breadcrumb';

const ShopDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);
  const item = shopData.find((p) => p.id === productId);

  if (!item) {
    return (
      <div className="w-full max-w-lg mx-auto py-20 text-center px-4">
        <p className="text-xl text-red-500 mb-4">Product not found.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        title={item.title}
        pages={['shop', `/shop/${item.id}`, item.title]}
      />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={item.imgs?.previews?.[0] ?? '/images/placeholder.jpg'}
            alt={item.title}
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Details */}
        <div className="w-full md:flex-1 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{item.title}</h1>

          {/* Price */}
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            GH₵{item.price.toFixed(2)}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                src="/images/icons/icon-star.svg"
                alt="star"
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  i < Math.round(item.reviews / 3) ? 'opacity-100' : 'opacity-30'
                }`}
              />
            ))}
            <span className="ml-2 text-sm sm:text-base text-gray-600">
              ({item.reviews} review{item.reviews !== 1 && 's'})
            </span>
          </div>

          {/* Add to cart */}
          <button className="w-full sm:w-auto block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
