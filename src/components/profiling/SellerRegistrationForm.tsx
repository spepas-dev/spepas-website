// src/components/profiling/SellerRegistrationForm.tsx
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Breadcrumb from '@/components/common/Breadcrumb';
import { createSellerProfileSelf } from '@/lib/profiling';
import { sellerRegistrationSchema } from '@/lib/profilingZodValidation';

const SellerRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        storeName,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude)
      };
      sellerRegistrationSchema.parse(payload);
      await createSellerProfileSelf(payload);
      navigate('/add-payment-account');
    } catch {
      setError('Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pt-10"></section>
      <Breadcrumb title="Seller Registration" pages={['Profiling', 'Seller Registration']} />
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] mx-auto rounded-xl bg-white shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register Seller Profile</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="block mb-2.5">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-lg border bg-gray-100 p-3 mb-5"
              required
            />
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block mb-2.5">Longitude</label>
                <input
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  required
                />
              </div>
              <div>
                <label className="block mb-2.5">Latitude</label>
                <input
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-dark text-white py-3 rounded-lg">
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SellerRegistrationForm;
