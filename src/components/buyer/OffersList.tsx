// src/components/buyer/OffersList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import SpepasLoader from '@/components/common/SpepasLoader';
import { addBidToCartAPI, getRequestBidsAllAPI, removeBidFromCartAPI } from '@/lib/orderBidsApis';

import OfferCard from './OfferCard';

const OffersList: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [cartMap, setCartMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requestId) {
      return;
    }
    setLoading(true);
    getRequestBidsAllAPI({ request_id: requestId })
      .then((res) => setOffers(
        (res.data ?? []).filter((o: any) => o.Seller_ID != null && o.seller) // eslint-disable-line @typescript-eslint/no-explicit-any
      ))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [requestId]);

  const handleAdd = (biddingId: string) =>
    addBidToCartAPI({ bidding_ID: biddingId })
      .then((res) => {
        const cartId = res.data?.cart_ID;
        if (cartId) {
          setCartMap((p) => ({ ...p, [biddingId]: cartId }));
        }
      })
      .catch(console.error);

  const handleRemove = (biddingId: string) => {
    const cartId = cartMap[biddingId];
    if (!cartId) {
      return;
    }
    removeBidFromCartAPI({ cart_ID: cartId })
      .then(() =>
        setCartMap((p) => {
          const copy = { ...p };
          delete copy[biddingId];
          return copy;
        })
      )
      .catch(console.error);
  };

  if (!requestId) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-sm text-red-500">No request selected.</p>
      </div>
    );
  }

  if (loading) {
    return <SpepasLoader size="lg" label="Loading offers..." />;
  }

  if (!offers.length) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No offers have been made yet for this request.</p>
        </div>
      </div>
    );
  }

  // Request details from first offer
  const { orderRequest } = offers[0];
  const { sparePart, quantity, createdAt } = orderRequest;
  const img = sparePart.images?.[0];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Requests
      </button>

      {/* Request Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Request Details</h2>
        <div className="flex flex-col sm:flex-row gap-5">
          {img && (
            <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <img src={img} alt={sparePart.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold text-gray-900">{sparePart.name}</h3>
            {sparePart.description && <p className="text-sm text-gray-500">{sparePart.description}</p>}
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Qty:</span>
                <span className="text-sm font-semibold text-gray-900">{quantity}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Requested:</span>
                <span className="text-sm text-gray-600">
                  {new Date(createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Offers:</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {offers.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div>
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
          {offers.length} {offers.length === 1 ? 'Offer' : 'Offers'} Available
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((o) => (
            <OfferCard key={o.bidding_ID} offer={o} inCart={!!cartMap[o.bidding_ID]} onAdd={handleAdd} onRemove={handleRemove} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersList;
