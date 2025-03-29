'use client';

import { useNavigate } from 'react-router-dom';
import React, { ChangeEvent, FormEvent, useState } from 'react';

import Breadcrumb from '@/components/marketing/Common/Breadcrumb';

interface SparePartDetail {
  name: string;
  description: string;
  carModel_ID: string;
}

interface ItemRequestFormData {
  require_image: boolean;
  quantity: number;
  sparePartDetail: SparePartDetail;
}

const CustomerItemRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ItemRequestFormData>({
    require_image: false,
    quantity: 1,
    sparePartDetail: {
      name: '',
      description: '',
      carModel_ID: ''
    }
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, require_image: e.target.checked });
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, quantity: parseInt(e.target.value, 10) });
  };

  const handleSparePartChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      sparePartDetail: {
        ...formData.sparePartDetail,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.sparePartDetail.name || !formData.sparePartDetail.description || !formData.sparePartDetail.carModel_ID) {
      setError('Please fill in all required spare part details.');
      setLoading(false);
      return;
    }

    // Build payload with require_image as a number (0 or 1)
    const payload = {
      require_image: formData.require_image ? 1 : 0,
      quantity: formData.quantity,
      sparePartDetail: formData.sparePartDetail
    };

    try {
      const res = await fetch('/api/proxy/item-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Request submission failed.');
      } else {
        console.log('Item Request Response:', data);
        navigate('/'); // Redirect to home after submission (adjust as needed)
      }
    } catch (error) {
      setError('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <>
      <Breadcrumb title={'Post Item Request'} pages={['Post Item Request']} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">Post Spare Parts Request</h2>
              <p>Please fill in the details of your spare parts request.</p>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-5 flex items-center">
                <input
                  type="checkbox"
                  name="require_image"
                  id="require_image"
                  checked={formData.require_image}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="require_image" className="font-medium">
                  Require image from seller
                </label>
              </div>
              <div className="mb-5">
                <label htmlFor="quantity" className="block mb-2.5">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Enter desired quantity"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5"
                  min={1}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="name" className="block mb-2.5">
                  Spare Part Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter spare part name"
                  value={formData.sparePartDetail.name}
                  onChange={handleSparePartChange}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="description" className="block mb-2.5">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter a detailed description"
                  value={formData.sparePartDetail.description}
                  onChange={handleSparePartChange}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5"
                  rows={4}
                ></textarea>
              </div>
              <div className="mb-5">
                <label htmlFor="carModel_ID" className="block mb-2.5">
                  Vehicle Model ID
                </label>
                <input
                  type="text"
                  name="carModel_ID"
                  id="carModel_ID"
                  placeholder="Enter the vehicle model ID"
                  value={formData.sparePartDetail.carModel_ID}
                  onChange={handleSparePartChange}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerItemRequestForm;
