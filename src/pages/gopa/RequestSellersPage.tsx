// src/pages/gopa/RequestSellersPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getGOPASellerForRequestAPI,
  assignRequestToSellerAPI,
} from "@/lib/orderBidsApis";
import AssignSellerModal from "@/components/gopa/AssignSellerModal";
import { useAuth } from "@/features/auth";
import SpepasLoader from "@/components/common/SpepasLoader";
import {
  Users,
  Store,
  Star,
  AlertTriangle,
  Inbox,
} from "lucide-react";

const RequestSellersPage: React.FC = () => {
  const { gopaId: paramGopaId, requestId } = useParams<{
    gopaId: string;
    requestId: string;
  }>();
  const { authData } = useAuth();
  const gopaProfile = authData?.user?.gopa;

  // Guard: ensure we actually have a GOPA profile and the URL matches their ID
  if (!gopaProfile || gopaProfile.Gopa_ID !== paramGopaId) {
    return (
      <section className="bg-gray-1 min-h-screen pt-24 pb-10 sm:pt-28 sm:pb-16">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          {/* Page header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-dark">
                Choose Seller for Request
              </h1>
              <p className="text-sm text-dark-4">
                Assign a seller to fulfill this request
              </p>
            </div>
          </div>

          {/* Error state */}
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-dark mb-1">
                Access Denied
              </p>
              <p className="text-sm text-dark-4 text-center max-w-sm">
                {gopaProfile
                  ? "You are not authorized to assign sellers on this request."
                  : "No GOPA profile found. Please contact support."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const [sellers, setSellers] = useState<any[]>([]);
  const [modalOpenFor, setModalOpenFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getGOPASellerForRequestAPI({
      gopa_id: gopaProfile.Gopa_ID,
      request_id: requestId!,
    })
      .then((res) => setSellers(res.data))
      .catch((e: any) => setError(e?.message || "Failed to load sellers."))
      .finally(() => setLoading(false));
  }, [gopaProfile.Gopa_ID, requestId]);

  const onAssign = async (sellerID: string) => {
    await assignRequestToSellerAPI({
      request_id: requestId!,
      sellerIDs: [sellerID],
    });
    setModalOpenFor(null);
  };

  /* ---------- Star rating helper ---------- */
  const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const count = Math.round(rating || 0);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i <= count
                ? "text-amber-400 fill-amber-400"
                : "text-gray-3"
            }`}
          />
        ))}
        <span className="ml-1.5 text-xs text-dark-4 font-medium">
          {rating ?? "N/A"}
        </span>
      </div>
    );
  };

  return (
    <section className="bg-gray-1 min-h-screen pt-24 pb-10 sm:pt-28 sm:pb-16">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-dark">
              Choose Seller for Request
            </h1>
            <p className="text-sm text-dark-4">
              Select and assign a seller to fulfill this request
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
            <SpepasLoader
              size="md"
              label="Loading sellers..."
              fullSection
            />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-dark mb-1">
                Something went wrong
              </p>
              <p className="text-sm text-dark-4 text-center max-w-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && sellers.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-12 w-12 rounded-xl bg-blue-light-5 flex items-center justify-center mb-4">
                <Inbox className="h-6 w-6 text-blue" />
              </div>
              <p className="text-sm font-medium text-dark mb-1">
                No sellers available
              </p>
              <p className="text-sm text-dark-4 text-center max-w-sm">
                There are no sellers available for this request at the moment.
              </p>
            </div>
          </div>
        )}

        {/* Seller cards */}
        {!loading && !error && sellers.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellers.map((s) => (
              <div
                key={s.Seller_ID}
                className="bg-white rounded-2xl border border-gray-3 shadow-1 hover:shadow-2 transition-shadow p-5"
              >
                {/* Seller info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center shrink-0">
                    <Store className="h-5 w-5 text-blue" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">
                      {s.name}
                    </p>
                    <div className="mt-1">
                      <StarRating rating={s.rating} />
                    </div>
                  </div>
                </div>

                {/* Assign button */}
                <button
                  onClick={() => setModalOpenFor(s.Seller_ID)}
                  className="w-full bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
                >
                  Assign Seller
                </button>

                {/* Modal */}
                {modalOpenFor === s.Seller_ID && (
                  <AssignSellerModal
                    seller={s}
                    onConfirm={() => onAssign(s.Seller_ID)}
                    onCancel={() => setModalOpenFor(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RequestSellersPage;
