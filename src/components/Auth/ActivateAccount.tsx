// src/components/Auth/ActivateAccount.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

// import Breadcrumb from '@/components/common/Breadcrumb';
import { useAuth } from '@/features/auth';

const ActivateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { activateAccount } = useAuth();
  const [otp, setOtp] = useState('');
  const [otpID] = useState(() => localStorage.getItem('otpID') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // show loading toast
    const toastId = toast.loading('Verifying…', {
      position: 'bottom-center'
    });

    try {
      await activateAccount({ otp, otpID });
      toast.success('Account activated!', {
        id: toastId,
        position: 'bottom-center'
      });
      navigate('/add-identification');
    } catch {
      toast.error('Activation failed. Please check your OTP and try again.', {
        id: toastId,
        position: 'bottom-center'
      });
      setError('Activation failed. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Breadcrumb title="Activate Account" pages={["Activate Account"]} /> */}
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
          <div className="text-center mb-8">
            <Link className="inline-block" to="/">
              <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
            </Link>
          </div>
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">Activate Your Account</h2>
            <p>Please enter the OTP sent to your phone or email.</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <p className="text-center mt-6">
              Didn’t receive an OTP?{' '}
              <Link to="/auth/forgot-password" className="text-dark hover:text-blue">
                Resend OTP
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default ActivateAccount;
