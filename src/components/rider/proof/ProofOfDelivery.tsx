import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Upload, ArrowLeft, RotateCcw, Send, Info } from 'lucide-react';

const PREFIX = '/95668339501103956045';

const ProofOfDelivery: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onPick = () => inputRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(String(reader.result));
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
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
            <Camera size={18} className="text-blue" />
            <h2 className="text-base font-semibold text-dark">Proof of Delivery</h2>
          </div>
          <p className="text-sm text-dark-4">
            Take a picture at the delivery destination to confirm the handoff.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          {!preview ? (
            <>
              {/* Upload area */}
              <div
                onClick={onPick}
                className="border-2 border-dashed border-gray-3 rounded-2xl p-10 sm:p-14 text-center cursor-pointer hover:border-blue/40 hover:bg-blue-light-5/30 transition-colors duration-200"
              >
                <div className="h-14 w-14 rounded-xl bg-blue-light-5 flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-blue" />
                </div>
                <p className="text-sm font-medium text-dark mb-1">
                  Take or upload a photo
                </p>
                <p className="text-xs text-dark-4">
                  Tap here to open your camera or select from gallery
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onChange}
              />

              {/* Info */}
              <div className="flex items-start gap-3 bg-blue-light-5 rounded-xl p-4 mt-4">
                <Info size={16} className="text-blue shrink-0 mt-0.5" />
                <p className="text-xs text-blue">
                  Please ensure the package and delivery location are clearly visible in the photo.
                  Upload proof of delivery API is not yet available.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Preview */}
              <div className="mb-5">
                <img
                  src={preview}
                  alt="Delivery proof"
                  className="w-full max-w-xs rounded-2xl border border-gray-3 shadow-1 mx-auto"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setPreview(null);
                    if (inputRef.current) inputRef.current.value = '';
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
                >
                  <RotateCcw size={14} />
                  Retake Photo
                </button>
                <button
                  onClick={() =>
                    navigate(`${PREFIX}/rider/orders/${orderId}/proof-submit`, {
                      state: { preview },
                    })
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
                >
                  <Send size={14} />
                  Submit Photo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProofOfDelivery;
