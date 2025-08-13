// src/components/profiling/AddIdentification.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/common/Breadcrumb';
import { addIdentificationSelf } from '@/lib/profiling';

const AddIdentification: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    idType: '',
    idN_number: '',
    issue_date: '',
    expiry_date: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addIdentificationSelf(form);
      navigate('/95668339501103956045/registration-selection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <section className="pt-10"></section>
      <Breadcrumb title="Add Identification" pages={['Profiling', 'Add Identification']} />

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 max-w-4xl w-[80%] mx-auto p-4 pt-20">
        <div className="mb-5">
          <label htmlFor="idType" className="block mb-2.5 font-medium">
            ID Type
          </label>
          <select
            id="idType"
            value={form.idType}
            onChange={handleChange('idType')}
            className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5"
            required
          >
            <option value="" disabled>
              Select ID Type
            </option>
            <option value="NATIONAL">National ID</option>
            <option value="VOTERS">Voter’s ID</option>
          </select>
        </div>

        <div className="mb-5">
          <label htmlFor="idN_number" className="block mb-2.5 font-medium">
            ID Number
          </label>
          <input
            id="idN_number"
            type="text"
            value={form.idN_number}
            onChange={handleChange('idN_number')}
            placeholder="Enter your ID number"
            className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="issue_date" className="block mb-2.5 font-medium">
            Issue Date
          </label>
          <input
            id="issue_date"
            type="date"
            value={form.issue_date}
            onChange={handleChange('issue_date')}
            className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="expiry_date" className="block mb-2.5 font-medium">
            Expiry Date
          </label>
          <input
            id="expiry_date"
            type="date"
            value={form.expiry_date}
            onChange={handleChange('expiry_date')}
            className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-dark text-white py-3 rounded-lg font-medium"
          >
            {loading ? 'Saving…' : 'Continue'}
          </button>
          {/* <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 border border-gray-300 text-dark py-3 rounded-lg font-medium"
          >
            Skip
          </button> */}
        </div>
      </form>
    </>
  );
};

export default AddIdentification;
