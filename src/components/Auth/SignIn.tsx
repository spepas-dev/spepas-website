// src/pages/auth/Signin.tsx
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useAccountType } from '@/features/accountTypeContext';
import { Eye, EyeOff } from 'lucide-react';

type Role = 'GOPA' | 'MEPA' | 'SELLER' | 'RIDER' | 'BUYER';

const MIN_PW = 8;
const pwLenMsg = `Password must be at least ${MIN_PW} characters long`;
const emailMsg = 'Invalid email address';
const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

const Signin: React.FC = () => {
  const { login, authData } = useAuth();
  const { setAccountType } = useAccountType();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Visibility toggle
  const [showPw, setShowPw] = useState(false);

  // Inline error state + touched tracking
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  // Post-login role selection state
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [didLogin, setDidLogin] = useState(false);

  // Validate on change
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setErrors((prev) => ({ ...prev, email: val && !isValidEmail(val) ? emailMsg : undefined }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setErrors((prev) => ({
      ...prev,
      password: val.length > 0 && val.length < MIN_PW ? pwLenMsg : undefined,
    }));
  };

  // Validate on blur
  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: email && !isValidEmail(email) ? emailMsg : undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: password.length > 0 && password.length < MIN_PW ? pwLenMsg : undefined,
      }));
    }
  };

  // 1️⃣ Handle form submit and call login()
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Final client-side validation gate
    setTouched({ email: true, password: true });
    const emailErr = email && !isValidEmail(email) ? emailMsg : undefined;
    const pwErr = password.length < MIN_PW ? pwLenMsg : undefined;
    setErrors({ email: emailErr, password: pwErr });
    if (emailErr || pwErr) return;

    setLoading(true);
    const toastId = toast.loading('Signing in…', { position: 'bottom-center' });
    try {
      await login({ email, password });
      toast.success('Signed in!', { id: toastId, position: 'bottom-center' });
      setDidLogin(true);
    } catch {
      toast.error('Invalid credentials. Please try again.', {
        id: toastId,
        position: 'bottom-center',
      });
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ After login, detect available roles
  useEffect(() => {
    if (!didLogin) return;
    const user = authData.user;
    if (!user) return;

    const roles: Role[] = [];
    if (user.gopa)          roles.push('GOPA');
    if (user.mepa)          roles.push('MEPA');
    if (user.sellerDetails) roles.push('SELLER');
    if (user.deliver)       roles.push('RIDER');

    if (roles.length > 0) {
      setAvailableRoles(['BUYER', ...roles]);
      setShowRoleSelector(true);
    } else {
      setAccountType('BUYER');
      navigate('/95668339501103956045/home');
    }
  }, [didLogin, authData.user, navigate, setAccountType]);

  // 3️⃣ Handle role selection
  const handleRoleSelect = (role: Role) => {
    setAccountType(role);
    setShowRoleSelector(false);
    navigate('/95668339501103956045/home');
  };

  const emailInvalid = touched.email && Boolean(errors.email);
  const pwInvalid = touched.password && Boolean(errors.password);

  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] mx-auto p-6 sm:p-8 xl:p-11 bg-white shadow-md rounded-xl">
          <div className="text-center mb-8">
            <Link to="/">
              <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
            </Link>
          </div>
          <h2 className="text-center text-2xl font-semibold mb-6">Sign In</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2.5">
                Email Address <span className="text-red">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                required
                className={`w-full rounded-lg border ${
                  emailInvalid ? 'border-red-500' : 'border-gray-300'
                } bg-gray-100 py-3 px-5`}
                placeholder="you@example.com"
                aria-invalid={emailInvalid}
                aria-describedby={emailInvalid ? 'signin-email-error' : undefined}
              />
              {emailInvalid && (
                <p id="signin-email-error" className="mt-1 text-sm text-red-600">
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
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  required
                  className={`w-full rounded-lg border ${
                    pwInvalid ? 'border-red-500' : 'border-gray-300'
                  } bg-gray-100 py-3 px-5 pr-11`}
                  placeholder="••••••••"
                  aria-invalid={pwInvalid}
                  aria-describedby={pwInvalid ? 'signin-password-error' : undefined}
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

              {pwInvalid && (
                <p id="signin-password-error" className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3 rounded-lg font-medium"
            >
              {loading ? 'Signing In…' : 'Sign In'}
            </button>

            <p className="text-center mt-6 text-sm">
              Don’t have an account?{' '}
              <Link to="/95668339501103956045/auth/signup" className="text-blue hover:underline">
                Sign Up
              </Link>
            </p>
            <p className="text-center mt-2 text-sm">
              Forgot your password?{' '}
              <Link to="/95668339501103956045/auth/forgot-password" className="text-blue hover:underline">
                Reset it here
              </Link>
            </p>
          </form>
        </div>
      </section>

      {/* Role Selector Modal */}
      {showRoleSelector && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm"
          onClick={() => setShowRoleSelector(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-3 p-8 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark">Select Profile</h3>
                <p className="text-xs text-dark-4">Choose which account type to continue as</p>
              </div>
            </div>

            <ul className="space-y-2">
              {availableRoles.map((role) => (
                <li key={role}>
                  <button
                    onClick={() => handleRoleSelect(role)}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium bg-gray-1 text-dark-2 border border-gray-3 hover:bg-blue-light-5 hover:text-blue hover:border-blue/20 transition-colors duration-200"
                  >
                    <span>{role}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Signin;
