// src/components/profiling/AddPaymentAccountForm.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/common/Breadcrumb';
import { createPaymentAccountSelf } from '@/lib/profiling';
import { paymentAccountCreationSchema } from '@/lib/profilingZodValidation';

// Extend these as needed
const ACCOUNT_TYPE_OPTIONS = ['BANK_ACCOUNT'] as const;
const PROVIDER_OPTIONS = ['ECOBANK'] as const;

const AddPaymentAccountForm: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('');              // e.g. 'BANK_ACCOUNT'
  const [accountNumber, setAccountNumber] = useState('');
  const [provider, setProvider] = useState('');      // e.g. 'ECOBANK'
  const [name, setName] = useState('');              // account holder name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { mode, accountNumber, provider, name };
      paymentAccountCreationSchema.parse(payload);
      await createPaymentAccountSelf(payload);
      navigate('/95668339501103956045/home');
    } catch {
      setError('Failed to add payment account. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pt-10" />
      <Breadcrumb title="Add Payment Account" pages={['Profiling', 'Add Payment Account']} />

      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] mx-auto rounded-xl bg-white shadow p-6 sm:p-7.5 xl:p-11">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-xl sm:text-2xl mb-0">Add Payment Account</h2>
            <button
              type="button"
              onClick={() => navigate('/95668339501103956045/home')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip for now
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Account Type (dropdown) */}
            <div className="mb-5">
              <label htmlFor="mode" className="block mb-2.5">Account Type</label>
              <select
                id="mode"
                value={mode}
                onChange={e => setMode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5"
                required
              >
                <option value="" disabled>Select account type</option>
                {ACCOUNT_TYPE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label htmlFor="accountNumber" className="block mb-2.5">Account Number</label>
              <input
                id="accountNumber"
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5"
                required
              />
            </div>

            {/* Provider (dropdown) */}
            <div className="mb-5">
              <label htmlFor="provider" className="block mb-2.5">Provider</label>
              <select
                id="provider"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5"
                required
              >
                <option value="" disabled>Select provider</option>
                {PROVIDER_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label htmlFor="name" className="block mb-2.5">Account Holder Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-medium text-white bg-dark py-3 px-6 rounded-lg"
            >
              {loading ? 'Saving…' : 'Add Account'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddPaymentAccountForm;
