// src/components/gopa/AssignSellerModal.tsx
import React from 'react';

interface Props {
  seller: unknown;
  onConfirm: () => void;
  onCancel: () => void;
}

const AssignSellerModal: React.FC<Props> = ({ seller, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-bold mb-4">Assign to {seller.name}?</h3>
      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 bg-indigo-500 text-white rounded">
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default AssignSellerModal;
