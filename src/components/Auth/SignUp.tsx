// src/pages/auth/Signup.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { signupAPI } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

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
  user_type: string; // kept to avoid ripple changes elsewhere
}

const MIN_PW = 8;
const pwLenMsg = `Password must be at least ${MIN_PW} characters long`;
const emailMsg = 'Invalid email address';

const isValidEmail = (val: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    user_type: '', // we’ll override to BUYER on submit
  });
  const [loading, setLoading] = useState(false);

  // visibility toggles
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  // inline error state + touched tracking
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [touched, setTouched] = useState<{
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateEmailField = (value: string) =>
    value && !isValidEmail(value) ? emailMsg : undefined;

  const validatePwLen = (value: string) =>
    value.length > 0 && value.length < MIN_PW ? pwLenMsg : undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as { name: keyof FormData; value: string };
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmailField(value) }));
    }
    if (name === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePwLen(value) }));
    }
    if (name === 'confirmPassword') {
      setErrors((prev) => ({ ...prev, confirmPassword: validatePwLen(value) }));
    }
  };

  const handleBlur = (name: 'email' | 'password' | 'confirmPassword') => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const val = formData[name];
    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmailField(val) }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: validatePwLen(val),
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true, confirmPassword: true });

    const emailErr = validateEmailField(formData.email);
    const pwErr = validatePwLen(formData.password);
    const cpwErr = validatePwLen(formData.confirmPassword);
    const mismatch =
      formData.password.length > 0 &&
      formData.confirmPassword.length > 0 &&
      formData.password !== formData.confirmPassword;

    setErrors({
      email: emailErr,
      password: pwErr,
      confirmPassword: cpwErr || (mismatch ? 'Passwords do not match' : undefined),
    });

    if (emailErr || pwErr || cpwErr || mismatch) {
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating account…', {
      position: 'bottom-center',
    });

    try {
      const { confirmPassword, ...rest } = formData;
      const payload = { ...rest, user_type: 'BUYER' as const };

      const result = await signupAPI(payload);
      const otpID = result.data;
      localStorage.setItem('otpID', otpID);

      toast.success('Account created! Check your phone for OTP.', {
        id: toastId,
        position: 'bottom-center',
      });
      navigate('/95668339501103956045/auth/activate');
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

  // Derived UI flags
  const showMismatch =
    touched.confirmPassword &&
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const emailInvalid = touched.email && Boolean(errors.email);
  const pwInvalid =
    (touched.password && Boolean(errors.password)) || showMismatch;
  const cpwInvalid =
    (touched.confirmPassword && Boolean(errors.confirmPassword)) || showMismatch;

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
                  onBlur={() => handleBlur('email')}
                  required
                  className={`rounded-lg border ${
                    emailInvalid ? 'border-red-500' : 'border-gray-300'
                  } bg-gray-100 w-full py-3 px-5`}
                  aria-invalid={emailInvalid}
                  aria-describedby={emailInvalid ? 'email-error' : undefined}
                />
                {emailInvalid && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block mb-2.5">
                  Password <span className="text-red">*</span>
                </label>

                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    required
                    autoComplete="new-password"
                    className={`rounded-lg border ${
                      pwInvalid ? 'border-red-500' : 'border-gray-300'
                    } bg-gray-100 w-full py-3 px-5 pr-11`}
                    aria-invalid={pwInvalid}
                    aria-describedby={
                      touched.password && errors.password ? 'password-error' : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60 transition"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {touched.password && errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label htmlFor="confirmPassword" className="block mb-2.5">
                  Confirm Password <span className="text-red">*</span>
                </label>

                <div className="relative">
                  <input
                    type={showCpw ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    required
                    autoComplete="new-password"
                    className={`rounded-lg border ${
                      cpwInvalid ? 'border-red-500' : 'border-gray-300'
                    } bg-gray-100 w-full py-3 px-5 pr-11`}
                    aria-invalid={cpwInvalid}
                    aria-describedby={
                      touched.confirmPassword && (errors.confirmPassword || showMismatch)
                        ? 'confirm-password-error'
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowCpw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60 transition"
                    aria-label={showCpw ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showCpw ? (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {touched.confirmPassword && (errors.confirmPassword || showMismatch) && (
                  <p id="confirm-password-error" className="mt-1 text-sm text-red-600">
                    {showMismatch ? 'Passwords do not match' : errors.confirmPassword}
                  </p>
                )}
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

              {/* User Type field removed; we force BUYER in payload */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="text-center mt-6">
                Already have an account?{' '}
                <Link to="/95668339501103956045/auth/signin" className="text-dark hover:text-blue">
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
