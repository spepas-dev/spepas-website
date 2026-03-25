// src/components/gopa/AssignSellerModal.tsx
import React from 'react';

interface Props {
  seller: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const AssignSellerModal: React.FC<Props> = ({ seller, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
    {/* Backdrop */}
    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />

    {/* Modal */}
    <div
      className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Assign Request</h3>
          <p className="text-sm text-gray-500">
            Assign to <span className="font-medium text-gray-700">{seller.storeName ?? seller.name}</span>?
          </p>
        </div>
      </div>

      {seller.shopAddress && (
        <p className="text-xs text-gray-400 mb-4 pl-[52px]">{seller.shopAddress}</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Assigning…' : 'Confirm'}
        </button>
      </div>
    </div>
  </div>
);

export default AssignSellerModal;
