import React, { useState } from 'react';
import { requestNonInventorySparePartAPI } from '@/lib/orderBidsApis';
import { toastConfig } from '@/lib/toast';


const PostRequestForm: React.FC = () => {
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [model, setModel] = useState('');
  const [desc, setDesc] = useState('');
  const [requireImage, setRequireImage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestNonInventorySparePartAPI({
      require_image: requireImage ? 1 : 0,
      quantity: qty,
      sparePartDetail: { name, description: desc, carModel_ID: model },
    })
      .then(() => {
        toastConfig.success('Request posted!');
  
        // Reset form fields
        setName('');
        setQty(1);
        setModel('');
        setDesc('');
        setRequireImage(false);
  
        // Redirect after delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      })
      .catch(() => {
        toastConfig.error('Failed to post request. Please try again.');
      });
  };
  
  

  return (
    <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-[80%] mx-auto space-y-6 mt-10"
    >

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Part name</label>
            <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
            type="number"
            value={qty}
            onChange={e => setQty(+e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            min={1}
            required
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model (CarModel_ID)</label>
            <input
            value={model}
            onChange={e => setModel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={4}
            />
        </div>

        <div className="flex items-center">
            <input
            type="checkbox"
            checked={requireImage}
            onChange={e => setRequireImage(e.target.checked)}
            id="reqImg"
            className="mr-2 accent-indigo-500"
            />
            <label htmlFor="reqImg" className="text-sm text-gray-700">Photos required</label>
        </div>

        <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition duration-200"
        >
            Post Request
        </button>
    </form>

  );
};

export default PostRequestForm;
