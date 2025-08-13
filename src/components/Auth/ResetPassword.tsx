// src/components/Auth/ResetPassword.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

// import Breadcrumb from '@/components/common/Breadcrumb';
import { resetPasswordAPI } from '@/lib/auth';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>('');
  const [otpID] = useState<string>(() => localStorage.getItem('otpID') || '');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // show loading toast
    const toastId = toast.loading('Resetting password…', {
      position: 'bottom-center'
    });

    try {
      await resetPasswordAPI({ otp, otpID, newPassword });

      // success
      toast.success('Password reset! Please sign in.', {
        id: toastId,
        position: 'bottom-center'
      });
      navigate('/95668339501103956045/auth/signin');
    } catch (err: unknown) {
      console.log(err);
      // error
      toast.error('Failed to reset password. Please try again.', {
        id: toastId,
        position: 'bottom-center'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Breadcrumb title="Reset Password" pages={["Reset Password"]} /> */}
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
          <div className="text-center mb-8">
            <Link className="inline-block" to="/">
              <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
            </Link>
          </div>
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">Reset Your Password</h2>
            <p>Enter the OTP and a new password below.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="otp" className="block mb-2.5">
                OTP <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
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
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
