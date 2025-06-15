// src/pages/auth/Signin.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import Breadcrumb from '@/components/common/Breadcrumb';
import { useAuth } from '@/features/auth';

const Signin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // show persistent loading toast
    const toastId = toast.loading('Signing in…', {
      position: 'bottom-center'
    });

    try {
      await login({ email, password });
      // replace loading toast with success
      toast.success('Signed in!', {
        id: toastId,
        position: 'bottom-center'
      });
      navigate('/');
    } catch {
      // replace loading toast with error
      toast.error('Invalid credentials. Please try again.', {
        id: toastId,
        position: 'bottom-center'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
        <div className="text-center mb-8">
            <Link className="inline-block" to="/">
              <img
                src="/images/logo/logo.png"
                alt="Logo"
                width={119}
                height={36}
              />
            </Link>
          </div>
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">Sign In</h2>
            <p>Enter your credentials below</p>
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
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2.5">
                Password <span className="text-red">*</span>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <p className="text-center mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/auth/signup" className="text-dark hover:text-blue pl-2">
                Sign Up Now!
              </Link>
            </p>

            <p className="text-center mt-4">
              Forgot your password?{' '}
              <Link to="/auth/forgot-password" className="text-dark hover:text-blue">
                Reset it here
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Signin;
