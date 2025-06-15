// src/components/seller/SubmitBidModal.tsx
import React, { useState } from 'react';

import { submitBidAPI, uploadSparePartImagesAPI } from '@/lib/orderBidsApis';

interface SubmitBidModalProps {
  request: unknown;
  onClose: () => void;
}

const SubmitBidModal: React.FC<SubmitBidModalProps> = ({ request, onClose }) => {
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('2 days');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const unitPrice = parseFloat(price);
      const totalPrice = unitPrice * request.quantity;
      await submitBidAPI({
        bidding_ID: request.requestId,
        price: totalPrice,
        unitPrice,
        totalPrice,
        discount: 0
      });
      if (files.length) {
        await uploadSparePartImagesAPI({ bidding_ID: request.requestId, files });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={onClose} />
      <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-lg p-6 shadow-lg max-h-[80vh] overflow-auto">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Submit Bid</h2>
          <button onClick={onClose}>✕</button>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">My price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="GH₵/unit"
                className="w-full px-4 py-2 border rounded-lg outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Delivery time</label>
              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none"
              >
                <option>2 days</option>
                <option>3 days</option>
                <option>5 days</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Add photos (required)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))} />
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-indigo-500 text-white py-2 rounded-lg">
            {submitting ? 'Submitting…' : 'Submit bid'}
          </button>
        </form>
      </div>
    </>
  );
};

export default SubmitBidModal;
