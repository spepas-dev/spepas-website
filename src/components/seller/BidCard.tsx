// src/components/seller/BidCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BidCardProps {
  bid: unknown;
}

const BidCard: React.FC<BidCardProps> = ({ bid }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={bid.imageUrl} alt={bid.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-bold">{bid.title}</h2>
        <p className="text-gray-600">{bid.description}</p>
        <p className={`text-sm font-semibold ${bid.condition === 'New' ? 'text-green-500' : 'text-yellow-500'}`}>Qty: {bid.quantity}</p>
        <div className="flex items-center mt-2 space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${bid.condition === 'New' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}
          >
            {bid.condition}
          </span>
          {bid.totalBids > 0 ? (
            <>
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">{bid.totalBids}</span>
              <p className="font-semibold text-red-500">Bids</p>
            </>
          ) : (
            <p className="text-gray-600">Be the first one to bid</p>
          )}
        </div>
        <div className="mt-2 text-gray-600 text-sm">
          Make: <span className="font-semibold text-gray-800">{bid.make}</span>
          <span className="mx-4">
            Model: <span className="font-semibold">{bid.model}</span>
          </span>
          Year: <span className="font-semibold">{bid.year}</span>
        </div>
        <button
          className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg"
          onClick={() => navigate(`/seller/request/${bid.requestId}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default BidCard;
