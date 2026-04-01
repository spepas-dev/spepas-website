// src/pages/gopa/RequestSellersPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import AssignSellerModal from '@/components/gopa/AssignSellerModal';
import { useAuth } from '@/features/auth';
import { assignRequestToSellerAPI, getGOPASellerForRequestAPI, getRequestBidsAllAPI } from '@/lib/orderBidsApis';

type Toast = { type: 'success' | 'error'; message: string } | null;

const STALE_TIME = 10 * 60_000; // 10 minutes

const RequestSellersPage: React.FC = () => {
  const { gopaId: paramGopaId, requestId } = useParams<{ gopaId: string; requestId: string }>();
  const { authData } = useAuth();
  const gopaProfile = authData?.user?.gopa;
  const queryClient = useQueryClient();

  const [modalOpenFor, setModalOpenFor] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const isAuthorized = gopaProfile && gopaProfile.User_ID === paramGopaId;

  // ── Fetch bids ─────────────────────────────────────────────────
  const bidsQuery = useQuery({
    queryKey: ['request-bids', requestId],
    queryFn: () => getRequestBidsAllAPI({ request_id: requestId! }),
    enabled: !!requestId && !!isAuthorized,
    staleTime: STALE_TIME,
    select: (res) => // eslint-disable-line @typescript-eslint/no-explicit-any
      ((Array.isArray(res?.data) ? res.data : []) as any[])
        .filter((b: any) => b.Seller_ID != null && b.seller?.storeName), // filter out unknown sellers
  });

  // ── Fetch available sellers ────────────────────────────────────
  const sellersQuery = useQuery({
    queryKey: ['gopa-sellers-for-request', gopaProfile?.Gopa_ID, requestId],
    queryFn: () => getGOPASellerForRequestAPI({ gopa_id: gopaProfile!.Gopa_ID, request_id: requestId! }),
    enabled: !!requestId && !!isAuthorized && !!gopaProfile?.Gopa_ID,
    staleTime: STALE_TIME,
    select: (res) => {
      const data = Array.isArray(res?.data) ? res.data : res?.data ? [res.data] : [];
      return data.filter((s: any) => s.Seller_ID != null); // filter out unknown sellers // eslint-disable-line @typescript-eslint/no-explicit-any
    },
  });

  // ── Assign mutation ────────────────────────────────────────────
  const assignMutation = useMutation({
    mutationFn: (sellerID: string) =>
      assignRequestToSellerAPI({ request_id: requestId!, sellerIDs: [sellerID] }),
    onSuccess: () => {
      setModalOpenFor(null);
      setToast({ type: 'success', message: 'Seller assigned successfully!' });
      // Refresh bids + sellers + home request lists
      queryClient.invalidateQueries({ queryKey: ['request-bids', requestId] });
      queryClient.invalidateQueries({ queryKey: ['gopa-sellers-for-request'] });
      queryClient.invalidateQueries({ queryKey: ['gopa-requests'] });
    },
    onError: (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      setToast({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'Failed to assign seller.',
      });
    },
  });

  const bids = bidsQuery.data ?? [];
  const sellers = sellersQuery.data ?? [];

  const orderRequest = bids[0]?.orderRequest;
  const sparePart = orderRequest?.sparePart;
  const carModel = sparePart?.carModel;
  const isLoading = bidsQuery.isLoading && sellersQuery.isLoading;
  const bidsLoading = bidsQuery.isLoading;
  const sellersLoading = sellersQuery.isLoading;
  const quantity = orderRequest?.quantity ?? 1;

  // Split bids into submitted and pending (assigned but no bid yet)
  const submittedBids = bids.filter((b: any) => b.status === 1); // eslint-disable-line @typescript-eslint/no-explicit-any
  const pendingBids = bids.filter((b: any) => b.status !== 1); // eslint-disable-line @typescript-eslint/no-explicit-any

  if (!gopaProfile || gopaProfile.User_ID !== paramGopaId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">
            {gopaProfile ? 'You are not authorized to view this request.' : 'No GOPA profile found.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      {/* Back link */}
      <Link
        to="/95668339501103956045/home"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to requests
      </Link>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            {toast.message}
          </div>
          <button onClick={() => setToast(null)} className="text-current opacity-50 hover:opacity-100 ml-2">&times;</button>
        </div>
      )}

      {/* ── Request summary card ─────────────────────────────── */}
      {sparePart && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{sparePart.name}</h1>
              {sparePart.description && sparePart.description !== 'Details of the description goes here' && (
                <p className="text-sm text-gray-500 mt-1">{sparePart.description}</p>
              )}
            </div>
            {orderRequest?.quantity && (
              <span className="shrink-0 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                Qty: {orderRequest.quantity}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
            {carModel && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-6.867c0-.298-.119-.585-.33-.796l-3.525-3.525A1.125 1.125 0 0016.618 6H15m-3 0H9.375a1.125 1.125 0 00-1.125 1.125v11.25" />
                </svg>
                {[carModel.carBrand?.manufacturer?.name, carModel.carBrand?.name, carModel.name].filter(Boolean).join(' ')}
                {carModel.yearOfMake ? ` (${carModel.yearOfMake})` : ''}
              </span>
            )}
            {orderRequest?.requester?.name && <span>Requested by: {orderRequest.requester.name}</span>}
            {orderRequest?.createdAt && (
              <span>{new Date(orderRequest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            )}
          </div>
        </div>
      )}
      {!sparePart && !isLoading && (
        <h1 className="text-xl font-bold text-gray-900 mb-6">Request Details</h1>
      )}

      {/* ── Submitted Bids section ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Seller Bids</h2>
          {!bidsLoading && (
            <span className="text-xs text-gray-400">{submittedBids.length} bid{submittedBids.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        <div className="p-5">
          {bidsLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-50 animate-pulse" />
              ))}
            </div>
          )}

          {!bidsLoading && submittedBids.length === 0 && (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No bids submitted yet</p>
            </div>
          )}

          {!bidsLoading && submittedBids.length > 0 && (
            <div className="space-y-3">
              {submittedBids.map((bid: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                <div key={bid.bidding_ID} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{bid.seller?.storeName ?? 'Unknown Seller'}</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700">
                          Submitted
                        </span>
                      </div>
                      {bid.seller?.shopAddress && <p className="text-xs text-gray-400 mt-0.5">{bid.seller.shopAddress}</p>}
                      {bid.description && <p className="text-sm text-gray-600 mt-1">{bid.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      {(bid.unitPrice > 0 || bid.price > 0) && (
                        <>
                          <p className="text-base font-bold text-gray-900">
                            GHS {(bid.unitPrice > 0 ? bid.unitPrice : bid.price).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-gray-400">per item</p>
                        </>
                      )}
                      {(bid.unitPrice > 0 || bid.price > 0) && quantity > 1 && (
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">
                          Total: GHS {((bid.unitPrice > 0 ? bid.unitPrice : bid.price) * quantity).toLocaleString()}
                          <span className="text-[10px] text-gray-400 font-normal"> ({quantity} items)</span>
                        </p>
                      )}
                      {bid.discount > 0 && (
                        <p className="text-[10px] text-green-600 font-medium">-{bid.discount}% discount</p>
                      )}
                    </div>
                  </div>
                  {bid.date_assigned && (
                    <p className="text-[10px] text-gray-400 mt-2">
                      Assigned: {new Date(bid.date_assigned).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  {bid.images?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {bid.images
                        .filter((img: any) => img.image_url && img.image_url !== 'link to image') // eslint-disable-line @typescript-eslint/no-explicit-any
                        .map((img: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                          <img key={img.image_ID} src={img.image_url} alt="Bid" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Pending Sellers section (assigned but no bid yet) ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Pending Sellers</h2>
          {!bidsLoading && (
            <span className="text-xs text-gray-400">{pendingBids.length} pending</span>
          )}
        </div>

        <div className="p-5">
          {bidsLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-50 animate-pulse" />
              ))}
            </div>
          )}

          {!bidsLoading && pendingBids.length === 0 && (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No pending sellers</p>
              <p className="text-xs text-gray-400 mt-0.5">All assigned sellers have submitted their bids</p>
            </div>
          )}

          {!bidsLoading && pendingBids.length > 0 && (
            <div className="space-y-3">
              {pendingBids.map((bid: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                <div key={bid.bidding_ID} className="border border-amber-100 rounded-xl p-4 bg-amber-50/30 hover:border-amber-200 transition-colors">
                  <div className="flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{bid.seller?.storeName ?? 'Unknown Seller'}</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Awaiting Bid
                        </span>
                      </div>
                      {bid.seller?.shopAddress && <p className="text-xs text-gray-400 mt-0.5">{bid.seller.shopAddress}</p>}
                    </div>
                    {bid.date_assigned && (
                      <p className="text-[10px] text-gray-400 shrink-0">
                        Assigned: {new Date(bid.date_assigned).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Available sellers section ────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Available Sellers</h2>
          {!sellersLoading && (
            <span className="text-xs text-gray-400">{sellers.length} seller{sellers.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        <div className="p-5">
          {sellersLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-50 animate-pulse" />
              ))}
            </div>
          )}

          {!sellersLoading && sellers.length === 0 && (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No available sellers to assign</p>
              <p className="text-xs text-gray-400 mt-0.5">All sellers may have already been assigned</p>
            </div>
          )}

          {!sellersLoading && sellers.length > 0 && (
            <div className="space-y-3">
              {sellers.map((s: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                <div key={s.Seller_ID} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:border-gray-200 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{s.storeName ?? s.name ?? 'Unknown Seller'}</p>
                    {s.shopAddress && <p className="text-xs text-gray-500">{s.shopAddress}</p>}
                    {s.phoneNumber && <p className="text-xs text-gray-400">{s.phoneNumber}</p>}
                  </div>
                  <button
                    onClick={() => setModalOpenFor(s.Seller_ID)}
                    className="shrink-0 px-4 py-2 bg-indigo-500 text-white rounded-lg text-xs font-medium hover:bg-indigo-600 transition-colors"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assign modal */}
      {modalOpenFor && (
        <AssignSellerModal
          seller={sellers.find((s: any) => s.Seller_ID === modalOpenFor) ?? { storeName: 'Seller' }} // eslint-disable-line @typescript-eslint/no-explicit-any
          onConfirm={() => assignMutation.mutate(modalOpenFor)}
          onCancel={() => setModalOpenFor(null)}
          loading={assignMutation.isPending}
        />
      )}
    </div>
  );
};

export default RequestSellersPage;
