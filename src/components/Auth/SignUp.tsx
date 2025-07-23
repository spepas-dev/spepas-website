// src/pages/auth/Signup.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { signupAPI } from '@/lib/auth';

// Helper to ensure messages are strings
const getMessage = (msg: unknown): string => {
  if (typeof msg === 'object' && msg !== null) {
    try {
      return JSON.stringify(msg);
    } catch {
      return String(msg);
    }
  }
  return String(msg);
};

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  user_type: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    user_type: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client‑side password match check
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'bottom-center',
      });
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating account…', {
      position: 'bottom-center',
    });

    try {
      // Strip out confirmPassword before sending to API
      const { confirmPassword, ...payload } = formData;
      const result = await signupAPI(payload);
      const otpID = result.data;
      localStorage.setItem('otpID', otpID);

      toast.success('Account created! Check your phone for OTP.', {
        id: toastId,
        position: 'bottom-center',
      });
      navigate('/auth/activate');
    } catch (err: unknown) {
      console.error('Signup error:', err);
      toast.error(`Signup failed: ${getMessage(err)}`, {
        id: toastId,
        position: 'bottom-center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center mb-8">
            <Link className="inline-block" to="/">
              <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
            </Link>
          </div>
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">
                Create an Account
              </h2>
              <p>Enter your details below</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5.5">
              <div className="mb-5">
                <label htmlFor="name" className="block mb-2.5">
                  Full Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="block mb-2.5">
                  Email Address <span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block mb-2.5">
                  Password <span className="text-red">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="confirmPassword" className="block mb-2.5">
                  Confirm Password <span className="text-red">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="phoneNumber" className="block mb-2.5">
                  Phone Number <span className="text-red">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="user_type" className="block mb-2.5">
                  User Type <span className="text-red">*</span>
                </label>
                <select
                  name="user_type"
                  id="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                >
                  <option value="">Select user type</option>
                  <option value="BUYER">Buyer</option>
                  <option value="SELLER">Seller</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="text-center mt-6">
                Already have an account?{' '}
                <Link to="/auth/signin" className="text-dark hover:text-blue">
                  Sign in Now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
