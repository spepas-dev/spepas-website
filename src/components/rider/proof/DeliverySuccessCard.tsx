import React from 'react';
import { CheckCircle, Truck, ArrowRight } from 'lucide-react';

const DeliverySuccessCard: React.FC<{
  earnings?: number;
  onBack?: () => void;
}> = ({ earnings, onBack }) => (
  <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
    <div className="p-8 sm:p-10 text-center">
      {/* Success icon */}
      <div className="mx-auto h-16 w-16 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
        <CheckCircle size={32} className="text-green-500" />
      </div>

      <h2 className="text-xl font-semibold text-dark mb-2">
        Delivery Completed!
      </h2>
      <p className="text-sm text-dark-4 max-w-sm mx-auto mb-6">
        Great work! The order has been delivered successfully.
        {earnings != null && (
          <span className="block mt-1 text-dark font-medium">
            You earned GH&#x20B5; {earnings.toFixed(2)}
          </span>
        )}
      </p>

      {/* Status indicator */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
            <Truck size={16} className="text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-xs text-dark-4">Status</p>
            <p className="text-sm font-medium text-green-600">Delivered</p>
          </div>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-6 rounded-xl hover:bg-blue-dark transition-colors duration-200"
      >
        Back to Dashboard
        <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

export default DeliverySuccessCard;
