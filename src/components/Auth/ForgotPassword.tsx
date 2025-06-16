// src/components/Auth/ForgotPassword.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

// import Breadcrumb from '@/components/common/Breadcrumb';
import { forgotPasswordAPI } from '@/lib/auth';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Show a loading toast
    const toastId = toast.loading('Sending reset link…', {
      position: 'bottom-center'
    });

    try {
      const result = await forgotPasswordAPI({ email });
      // Save OTP ID if needed
      localStorage.setItem('otpID', result.data);

      // Update toast to success
      toast.success('Reset link sent! Check your email.', {
        id: toastId,
        position: 'bottom-center'
      });

      navigate('/auth/reset-password');
    } catch (err: unknown) {
      console.log(err);
      toast.error('Failed to send reset link. Please try again.', {
        id: toastId,
        position: 'bottom-center'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Breadcrumb title="Forgot Password" pages={["Forgot Password"]} /> */}
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
          <div className="text-center mb-8">
            <Link className="inline-block" to="/">
              <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
            </Link>
          </div>
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">Forgot Password</h2>
            <p>Enter your email to receive a password reset link.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2.5">
                Email Address <span className="text-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p className="text-center mt-6">
              Remembered?{' '}
              <Link to="/auth/signin" className="text-dark hover:text-blue">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
