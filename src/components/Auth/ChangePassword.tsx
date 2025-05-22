// src/components/Auth/ChangePassword.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Breadcrumb from '@/components/common/Breadcrumb';
import { changePasswordAPI } from '@/lib/auth';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // show loading toast
    const toastId = toast.loading('Changing password…', {
      position: 'bottom-center'
    });

    try {
      await changePasswordAPI({ oldPassword, newPassword });
      toast.success('Password changed successfully!', {
        id: toastId,
        position: 'bottom-center'
      });
      navigate('/my-account');
    } catch (err: unknown) {
      console.log(err);
      toast.error('Failed to change password. Please check your details and try again.', {
        id: toastId,
        position: 'bottom-center'
      });
      setError('Failed to change password. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Change Password" pages={['Change Password']} />
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">Change Password</h2>
            <p>Enter your old and new passwords below.</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-5">
              <label htmlFor="oldPassword" className="block mb-2.5">
                Old Password <span className="text-red">*</span>
              </label>
              <input
                type="password"
                id="oldPassword"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                autoComplete="on"
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="newPassword" className="block mb-2.5">
                New Password <span className="text-red">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                autoComplete="on"
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;
