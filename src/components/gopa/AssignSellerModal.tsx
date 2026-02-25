// src/components/gopa/AssignSellerModal.tsx
import React from "react";
import { Store } from "lucide-react";

interface Props {
  seller: any;
  onConfirm: () => void;
  onCancel: () => void;
}

const AssignSellerModal: React.FC<Props> = ({ seller, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl border border-gray-3 shadow-1 max-w-sm w-full p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center shrink-0">
          <Store className="h-5 w-5 text-blue" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-dark">
            Assign Seller
          </h3>
          <p className="text-sm text-dark-4">
            Assign this request to{" "}
            <span className="font-medium text-dark">{seller.name}</span>?
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default AssignSellerModal;
