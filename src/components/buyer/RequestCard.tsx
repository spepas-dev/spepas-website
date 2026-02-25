import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';

interface RequestCardProps {
  req: any;
}

const RequestCard: React.FC<RequestCardProps> = ({ req }) => {
  const img = req.sparePart?.images?.[0];
  const name = req.sparePart?.name || 'Unknown Part';
  const description = req.sparePart?.description || '';

  return (
    <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden hover:shadow-2 transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-1 flex items-center justify-center overflow-hidden">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-10 w-10 text-dark-5" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-dark truncate">{name}</h3>
        {description && (
          <p className="text-xs text-dark-4 mt-1 line-clamp-2">{description}</p>
        )}
        <Link
          to={`/95668339501103956045/buyer/requests/${req.request_ID}/offers`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue hover:text-blue-dark transition-colors"
        >
          View Offers
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default RequestCard;
