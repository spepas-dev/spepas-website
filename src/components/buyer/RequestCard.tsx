// src/components/buyer/RequestCard.tsx 
import React from 'react';
import { Link } from 'react-router-dom';

interface RequestCardProps {
  req: any;
}

const RequestCard: React.FC<RequestCardProps> = ({ req }) => {
  const img = req.sparePart.images?.[0];

  return (
    <div
      className="
        flex flex-col
        sm:flex-row
        items-start sm:items-center
        bg-white shadow rounded-lg
        overflow-hidden
        mb-4
      "
    >
      {img && (
        <img
          src={img}
          alt={req.sparePart.name}
          className="
            w-full h-48
            sm:w-16 sm:h-16
            object-cover
          "
        />
      )}

      <div className="flex-grow p-4 space-y-2">
        <h2 className="text-lg sm:text-base font-semibold text-gray-800">
          {req.sparePart.name}
        </h2>
        <p className="text-sm sm:text-xs text-gray-600 line-clamp-3">
          {req.sparePart.description}
        </p>
      </div>

      <div className="p-4">
        <Link
          to={`/95668339501103956045/buyer/requests/${req.request_ID}/offers`}
          className="
            block w-full text-center
            bg-indigo-500 hover:bg-indigo-600
            text-white font-medium
            py-2 px-4 rounded-md
            transition
            sm:inline-block sm:w-auto sm:text-sm
          "
        >
          View Offers
        </Link>
      </div>
    </div>
  );
};

export default RequestCard;
