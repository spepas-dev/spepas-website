// src/components/profiling/GopaRegistrationForm.tsx
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Breadcrumb from '@/components/common/Breadcrumb';
import { createGopaProfileSelf } from '@/lib/profiling';
import { gopaRegistrationSchema } from '@/lib/profilingZodValidation';

const GopaRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { Specialties: specialties.split(',').map((s) => s.trim()) };
      gopaRegistrationSchema.parse(payload);
      await createGopaProfileSelf(payload);
      navigate('/add-payment-account');
    } catch {
      setError('Registration failed. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pt-10"></section>
      <Breadcrumb title="GOPA Registration" pages={['Profiling', 'GOPA Registration']} />
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] mx-auto rounded-xl bg-white shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register GOPA Profile</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="block mb-2.5">Specialties (comma-separated)</label>
            <input
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="e.g. TYRES, FAN BELT, ENGINE"
              className="w-full rounded-lg border bg-gray-100 p-3 mb-5"
              required
            />
            <button type="submit" disabled={loading} className="w-full bg-dark text-white py-3 rounded-lg">
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default GopaRegistrationForm;
