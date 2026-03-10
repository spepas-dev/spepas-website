// src/components/gopa/RequestCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Package, Hash, ArrowRight } from "lucide-react";

interface Props {
  request: any;
}

const RequestCard: React.FC<Props> = ({ request }) => (
  <div className="bg-white rounded-2xl border border-gray-3 shadow-1 hover:shadow-2 transition-shadow p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      {/* Left: spare part info */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center shrink-0">
          <Package className="h-5 w-5 text-blue" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-dark truncate">
            {request.sparePartDetail?.name || request.SparePart_ID}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Hash className="h-3.5 w-3.5 text-dark-4" />
            <span className="text-xs text-dark-4">
              Qty: {request.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Right: view sellers link */}
      <Link
        to={`/95668339501103956045/gopa/${request.Gopa_ID}/requests/${request.request_id}/sellers`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue hover:text-blue-dark transition-colors duration-200 shrink-0"
      >
        View Sellers
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  </div>
);

export default RequestCard;
