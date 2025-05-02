// src/components/gopa/RequestCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  request: any;
}

const RequestCard: React.FC<Props> = ({ request }) => (
  <div className="p-4 border rounded flex justify-between items-center">
    <div>
      <h2 className="font-semibold">{request.sparePartDetail?.name || request.SparePart_ID}</h2>
      <p className="text-sm text-gray-600">Qty: {request.quantity}</p>
    </div>
    <Link
      to={`/gopa/${request.Gopa_ID}/requests/${request.request_id}/sellers`}
      className="text-indigo-500 hover:underline"
    >
      View Sellers
    </Link>
  </div>
);

export default RequestCard;
