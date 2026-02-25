// src/components/seller/BidCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';

interface BidCardProps {
  bid: any;
}

const BidCard: React.FC<BidCardProps> = ({ bid }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden hover:shadow-2 transition-shadow duration-200">
      {/* Image area */}
      <div className="aspect-[4/3] bg-gray-1 relative overflow-hidden">
        {bid.imageUrl ? (
          <img
            src={bid.imageUrl}
            alt={bid.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-dark-4" />
          </div>
        )}

        {/* Condition badge */}
        <span
          className={`absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full font-medium ${
            bid.condition === 'New'
              ? 'bg-green-light-1 text-green-dark'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {bid.condition}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-dark truncate">{bid.title}</h3>
        <p className="text-xs text-dark-4 mt-1 line-clamp-2">{bid.description}</p>

        {/* Meta info */}
        <div className="flex items-center gap-3 mt-3 text-xs text-dark-4">
          {bid.make && (
            <span>
              Make: <span className="font-medium text-dark-2">{bid.make}</span>
            </span>
          )}
          {bid.model && (
            <span>
              Model: <span className="font-medium text-dark-2">{bid.model}</span>
            </span>
          )}
          {bid.year && (
            <span>
              Year: <span className="font-medium text-dark-2">{bid.year}</span>
            </span>
          )}
        </div>

        {/* Quantity and bids row */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-medium text-dark-2">
            Qty: {bid.quantity}
          </span>
          {bid.totalBids > 0 ? (
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-600">
              {bid.totalBids} bid{bid.totalBids !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-blue-light-5 text-blue">
              Be first to bid
            </span>
          )}
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={() => navigate(`/seller/request/${bid.requestId}`)}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BidCard;
