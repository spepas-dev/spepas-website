import React from 'react';

const DeliverySuccessCard: React.FC<{ earnings?: number; onBack?: () => void }> = ({ earnings = 50, onBack }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
    <div className="mx-auto w-24 h-24 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center mb-4">
      <span className="text-3xl">🛍️</span>
    </div>
    <h2 className="text-xl font-semibold mb-2">Order delivered successfully</h2>
    <p className="text-sm text-gray-600 mb-6">Congratulations on a successful delivery! you’ve earned <span className="font-semibold">GH₵ {earnings}.</span></p>
    <button className="px-5 py-3 rounded-lg bg-violet-600 text-white hover:bg-violet-700" onClick={onBack}>
      Back to home
    </button>
  </div>
);

export default DeliverySuccessCard;
