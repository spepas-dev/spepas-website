// src/pages/seller/RequestDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestDetailAPI } from '@/lib/orderBidsApis';
import SpepasLoader from '@/components/common/SpepasLoader';
import {
  Eye,
  ArrowLeft,
  Package,
  Calendar,
  Hash,
  FileText,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

const RequestDetailPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    getRequestDetailAPI({ request_id: requestId })
      .then((res) => setDetail(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load request details. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [requestId]);

  // Missing request ID
  if (!requestId) {
    return (
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              <p className="text-sm font-medium text-dark-2">
                Request ID missing in URL
              </p>
              <p className="text-xs text-dark-4 mt-1">
                Please check the link and try again
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <SpepasLoader size="lg" label="Loading request details..." fullSection />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              <p className="text-sm font-medium text-dark-2">{error}</p>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-4 inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty detail
  if (!detail) {
    return (
      <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 py-16">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="h-14 w-14 rounded-2xl bg-gray-1 flex items-center justify-center mb-4">
                <Package className="h-7 w-7 text-dark-4" />
              </div>
              <p className="text-sm font-medium text-dark-2">
                No details found for this request
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Extract common fields
  const sparePart = detail.sparePart ?? detail.SparePart ?? {};
  const images: string[] =
    detail.images ?? sparePart.images ?? sparePart.SparePartImages?.map((img: any) => img.url) ?? [];
  const partName =
    sparePart.name ?? sparePart.partName ?? detail.title ?? 'Spare Part Request';
  const description =
    sparePart.description ?? detail.description ?? '';
  const quantity = detail.quantity ?? detail.total_items ?? '-';
  const createdAt = detail.createdAt
    ? new Date(detail.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-';
  const status = detail.statusMessage ?? detail.status ?? '';

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-dark">
                Request Details
              </h1>
              <p className="text-sm text-dark-4">
                Review the spare part request
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
              {images.length > 0 ? (
                <div className="space-y-2 p-3">
                  {images.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${partName} - ${i + 1}`}
                      className="w-full rounded-xl object-cover aspect-[4/3]"
                    />
                  ))}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-1 flex flex-col items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-dark-4 mb-2" />
                  <p className="text-xs text-dark-4">No images available</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Main details card */}
            <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h2 className="text-lg font-bold text-dark">{partName}</h2>
                {status && (
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0 ${
                      status === 'PENDING' || status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : status === 'COMPLETED' || status === 'completed'
                        ? 'bg-green-light-1 text-green-dark'
                        : 'bg-gray-1 text-dark-4'
                    }`}
                  >
                    {String(status).toUpperCase()}
                  </span>
                )}
              </div>

              {description && (
                <p className="text-sm text-dark-4 leading-relaxed mb-5">
                  {description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-1 rounded-xl">
                  <Hash className="h-4 w-4 text-blue shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-dark-4">
                      Quantity
                    </p>
                    <p className="text-sm font-semibold text-dark">
                      {quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-1 rounded-xl">
                  <Calendar className="h-4 w-4 text-blue shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-dark-4">
                      Created
                    </p>
                    <p className="text-sm font-semibold text-dark">
                      {createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-1 rounded-xl">
                  <FileText className="h-4 w-4 text-blue shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-dark-4">
                      Request ID
                    </p>
                    <p className="text-sm font-semibold text-dark truncate max-w-[140px]">
                      {requestId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle info card (if data available) */}
            {(detail.make || detail.model || detail.year || sparePart.CarModel) && (
              <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-dark mb-3">
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(detail.make || sparePart.CarModel?.Make?.name) && (
                    <div className="p-3 bg-gray-1 rounded-xl">
                      <p className="text-[10px] uppercase tracking-wider text-dark-4">
                        Make
                      </p>
                      <p className="text-sm font-semibold text-dark">
                        {detail.make || sparePart.CarModel?.Make?.name}
                      </p>
                    </div>
                  )}
                  {(detail.model || sparePart.CarModel?.name) && (
                    <div className="p-3 bg-gray-1 rounded-xl">
                      <p className="text-[10px] uppercase tracking-wider text-dark-4">
                        Model
                      </p>
                      <p className="text-sm font-semibold text-dark">
                        {detail.model || sparePart.CarModel?.name}
                      </p>
                    </div>
                  )}
                  {(detail.year || sparePart.CarModel?.year) && (
                    <div className="p-3 bg-gray-1 rounded-xl">
                      <p className="text-[10px] uppercase tracking-wider text-dark-4">
                        Year
                      </p>
                      <p className="text-sm font-semibold text-dark">
                        {detail.year || sparePart.CarModel?.year}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestDetailPage;
