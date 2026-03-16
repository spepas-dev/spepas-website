/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/buyer/RequestWithOffersCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  req: any;
}

const RequestWithOffersCard: React.FC<Props> = ({ req }) => {
  const img = req.sparePart?.images?.[0];
  const name = req.sparePart?.name ?? 'Unknown Part';
  const description = req.sparePart?.description;
  const bids = Array.isArray(req.bidings) ? req.bidings : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{name}</h3>
        {description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{description}</p>}

        {/* Bids summary */}
        <div className="mt-auto space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Offers</span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                bids.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {bids.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
              {bids.length} {bids.length === 1 ? 'offer' : 'offers'}
            </span>
          </div>

          {bids.length > 0 && (
            <div className="space-y-1.5">
              {bids.slice(0, 3).map((b: any) => (
                <div key={b.bidding_ID} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-gray-700 truncate mr-2">{b.seller?.storeName ?? 'Unknown Seller'}</span>
                  <span className="font-semibold text-gray-900 whitespace-nowrap">GH₵{b.price}</span>
                </div>
              ))}
              {bids.length > 3 && <p className="text-[11px] text-gray-400 text-center">+{bids.length - 3} more</p>}
            </div>
          )}
        </div>

        {/* Action */}
        {bids.length > 0 ? (
          <Link
            to={`/95668339501103956045/buyer/requests/${req.request_ID}/offers`}
            className="inline-flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 rounded-xl shadow-sm hover:opacity-90 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View All Offers
          </Link>
        ) : (
          <div className="w-full text-center text-xs text-gray-400 py-2.5 bg-gray-50 rounded-xl">Waiting for offers...</div>
        )}
      </div>
    </div>
  );
};

export default RequestWithOffersCard;
