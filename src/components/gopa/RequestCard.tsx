// src/components/gopa/RequestCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/features/auth';

interface Props {
  request: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const RequestCard: React.FC<Props> = ({ request }) => {
  const { authData } = useAuth();
  const userId = authData?.user?.gopa?.User_ID;

  const sparePart = request.orderRequest?.sparePart;
  const partName = sparePart?.name ?? request.sparePartDetail?.name ?? 'Unnamed Part';
  const quantity = request.orderRequest?.quantity ?? request.quantity;
  const requestId = request.orderRequest?.request_ID ?? request.request_ID ?? request.request_id;
  const requesterName = request.orderRequest?.requester?.name;
  const sellerName = request.seller?.storeName;
  const carModel = sparePart?.carModel;
  const vehicleInfo = carModel
    ? [carModel.carBrand?.manufacturer?.name, carModel.carBrand?.name, carModel.name].filter(Boolean).join(' ')
    : null;
  const yearOfMake = carModel?.yearOfMake;
  const createdAt = request.orderRequest?.createdAt ?? request.createdAt;
  const requireImage = request.orderRequest?.require_image === 1;

  // Bid counts (injected by GopaHome grouping, fetched from real bids API)
  const totalBids: number | undefined = request._totalBids;
  const submittedBids: number | undefined = request._submittedBids;
  const bidCountsLoaded: boolean = request._bidCountsLoaded ?? false;

  // Status badge
  const status = request.status;
  const statusLabel = status === 1 ? 'Submitted' : status === 0 ? 'Pending' : `Status ${status}`;
  const statusColor = status === 1 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700';

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
      <div className="flex justify-between items-start gap-4">
        {/* Left — part info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{partName}</h3>
            <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor}`}>{statusLabel}</span>
            {bidCountsLoaded && totalBids != null && (
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600">
                {submittedBids}/{totalBids} bid{totalBids !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            {quantity && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                Qty: {quantity}
              </span>
            )}
            {vehicleInfo && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-6.867c0-.298-.119-.585-.33-.796l-3.525-3.525A1.125 1.125 0 0016.618 6H15m-3 0H9.375a1.125 1.125 0 00-1.125 1.125v11.25" />
                </svg>
                {vehicleInfo}
                {yearOfMake ? ` (${yearOfMake})` : ''}
              </span>
            )}
            {requesterName && <span>By: {requesterName}</span>}
            {sellerName && <span>Seller: {sellerName}</span>}
            {requireImage && (
              <span className="text-indigo-500 flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                Image required
              </span>
            )}
          </div>

          {createdAt && (
            <p className="text-[10px] text-gray-400 mt-1.5">{new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          )}
        </div>

        {/* Right — action */}
        {userId && requestId && (
          <Link
            to={`/95668339501103956045/gopa/${userId}/requests/${requestId}/sellers`}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            View Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
