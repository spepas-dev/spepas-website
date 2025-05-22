import React from 'react';
import { Link } from 'react-router-dom';

interface RequestCardProps {
  req: any;
}

const RequestCard: React.FC<RequestCardProps> = ({ req }) => {
  const img = req.sparePart.images?.[0];

  return (
    <div className="flex items-center p-4 bg-white shadow rounded mb-4">
      {img && (
        <img src={img} alt="" className="w-16 h-16 object-cover mr-4 rounded" />
      )}
      <div className="flex-grow">
        <h2 className="font-semibold">{req.sparePart.name}</h2>
        <p>{req.sparePart.description}</p>
      </div>
      <Link
        to={`/buyer/requests/${req.request_ID}/offers`}
        className="bg-indigo-500 text-white px-3 py-1 rounded"
      >
        View Offers
      </Link>
    </div>
  );
};

export default RequestCard;
