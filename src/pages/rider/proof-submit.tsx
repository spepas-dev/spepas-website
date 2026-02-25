import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Camera,
  ArrowLeft,
  Send,
  RotateCcw,
  Info,
  CheckCircle,
} from 'lucide-react';

const PREFIX = '/95668339501103956045';

const RiderProofSubmitPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { preview?: string } };
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    // No upload API available yet — simulate a short delay then navigate to success
    await new Promise((r) => setTimeout(r, 1200));
    navigate(`${PREFIX}/rider/orders/${orderId}/delivered-success`);
  };

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-dark-4 hover:text-blue transition-colors duration-200 mb-4"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-gray-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={18} className="text-blue" />
              <h2 className="text-base font-semibold text-dark">Confirm Submission</h2>
            </div>
            <p className="text-sm text-dark-4">
              Review the photo before submitting proof of delivery.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {/* Preview */}
            {state?.preview ? (
              <div className="mb-5">
                <img
                  src={state.preview}
                  alt="Delivery proof"
                  className="w-full max-w-xs rounded-2xl border border-gray-3 shadow-1 mx-auto"
                />
              </div>
            ) : (
              <div className="bg-gray-1 rounded-2xl border border-gray-3 py-12 flex flex-col items-center justify-center mb-5">
                <div className="h-12 w-12 rounded-xl bg-gray-2 flex items-center justify-center mb-3">
                  <Camera size={24} className="text-dark-4" />
                </div>
                <p className="text-sm text-dark-4">No photo provided</p>
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-3 bg-blue-light-5 rounded-xl p-4 mb-5">
              <Info size={16} className="text-blue shrink-0 mt-0.5" />
              <p className="text-xs text-blue">
                Upload proof of delivery API is not yet available. The submission is simulated.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200 disabled:opacity-50"
              >
                <RotateCcw size={14} />
                Retake Photo
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200 disabled:opacity-50"
              >
                <Send size={14} />
                {submitting ? 'Submitting...' : 'Submit Proof'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiderProofSubmitPage;
