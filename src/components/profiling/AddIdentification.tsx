// src/components/profiling/AddIdentification.tsx
import React, { useState, useEffect } from 'react';                      // *adjusted*
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/common/Breadcrumb';
import { addIdentificationSelf, getUserDetailsById } from '@/lib/profiling'; // *adjusted*
import { toast } from 'react-hot-toast';                                 // *adjusted*
import { useAuth, getGlobalSetAuthData } from '@/features/auth';         // *adjusted*

const AddIdentification: React.FC = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();                                        // *adjusted*
  const [form, setForm] = useState({
    idType: '',
    idN_number: '',
    issue_date: '',
    expiry_date: '',
  });
  const [loading, setLoading] = useState(false);

  // 🔄 Refresh latest user details each time this page loads               // *adjusted*
  useEffect(() => {                                                        // *adjusted*
    const user = authData?.user as any;                                    // *adjusted*
    const userId = user?.User_ID || user?.id;                              // *adjusted*
    if (!userId) return;                                                   // *adjusted*

    let cancelled = false;                                                 // *adjusted*
    const toastId = toast.loading('Refreshing account…', {                 // *adjusted*
      position: 'bottom-center',                                           // *adjusted*
    });                                                                    // *adjusted*

    (async () => {                                                         // *adjusted*
      try {                                                                // *adjusted*
        const res = await getUserDetailsById(String(userId));              // *adjusted*
        const fresh = (res && (res.data ?? res)) || null;                  // *adjusted*
        if (!cancelled && fresh) {                                         // *adjusted*
          const setAuth = getGlobalSetAuthData?.();                        // *adjusted*
          setAuth?.({ ...authData, user: fresh });                         // *adjusted*
          toast.success('Account refreshed.', { id: toastId, position: 'bottom-center' }); // *adjusted*
        } else {                                                           // *adjusted*
          toast.dismiss(toastId);                                          // *adjusted*
        }                                                                   // *adjusted*
      } catch (e) {                                                        // *adjusted*
        console.error(e);                                                  // *adjusted*
        if (!cancelled) {                                                  // *adjusted*
          toast.error('Could not refresh account.', { id: toastId, position: 'bottom-center' }); // *adjusted*
        }                                                                   // *adjusted*
      }                                                                     // *adjusted*
    })();                                                                   // *adjusted*

    return () => { cancelled = true; };                                    // *adjusted*
    // eslint-disable-next-line react-hooks/exhaustive-deps                 // *adjusted*
  }, []);                                                                   // *adjusted*

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Saving identification…', {              // *adjusted*
      position: 'bottom-center',                                           // *adjusted*
    });                                                                    // *adjusted*

    try {
      await addIdentificationSelf(form);
      // Optionally pull fresh user after save so UI reflects changes       // *adjusted*
      const user = authData?.user as any;                                  // *adjusted*
      const userId = user?.User_ID || user?.id;                            // *adjusted*
      if (userId) {                                                        // *adjusted*
        try {                                                              // *adjusted*
          const res = await getUserDetailsById(String(userId));            // *adjusted*
          const fresh = (res && (res.data ?? res)) || null;                // *adjusted*
          const setAuth = getGlobalSetAuthData?.();                        // *adjusted*
          setAuth?.({ ...authData, user: fresh ?? authData.user });        // *adjusted*
        } catch (err) {                                                    // *adjusted*
          console.warn('Refresh after save failed:', err);                 // *adjusted*
        }                                                                   // *adjusted*
      }                                                                     // *adjusted*
      toast.success('Identification saved.', { id: toastId, position: 'bottom-center' }); // *adjusted*
      navigate('/95668339501103956045/registration-selection');
    } catch (err) {
      console.error(err);
      toast.error('Could not save identification.', { id: toastId, position: 'bottom-center' }); // *adjusted*
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
