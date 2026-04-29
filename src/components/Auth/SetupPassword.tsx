// src/components/Auth/SetupPassword.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/features/auth';

const MIN_PW = 8;

const SetupPassword: React.FC = () => {
  const navigate = useNavigate();
  const { setPassword, refreshPinStatus, isAuthenticated } = useAuth();

  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPasswordValue] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleChange =
    (setter: (val: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (error) setError(undefined);
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (password.length < MIN_PW) {
      setError(`Password must be at least ${MIN_PW} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Saving password…', { position: 'bottom-center' });

    try {
      const result: any = await setPassword({ newPassword: password });
      if (result?.status && result.status !== 1) {
        toast.error(result.message || 'Failed to set password.', {
          id: toastId,
          position: 'bottom-center',
        });
        setError(result.message || 'Failed to set password.');
        return;
      }
      toast.success('Password set.', {
        id: toastId,
        position: 'bottom-center',
      });

      // Decide what to do next: PIN setup if needed, otherwise home.
      const pinStatus = await refreshPinStatus();
      const pinNeeded = !pinStatus || pinStatus.pinSet === false;

      if (pinNeeded) {
        navigate('/95668339501103956045/auth/setup-pin');
      } else {
        navigate(
          isAuthenticated
            ? '/95668339501103956045/home'
            : '/95668339501103956045/auth/signin'
        );
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to set password. Please try again.';
      toast.error(msg, { id: toastId, position: 'bottom-center' });
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden bg-white">
      <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
        <div className="text-center mb-8">
          <Link className="inline-block" to="/">
            <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">
            Set Your Password
          </h2>
          <p>
            You were onboarded by an admin. Choose a password — you'll use it to
            sign in next time.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          <div className="mb-5">
            <label htmlFor="newPassword" className="block mb-2.5">
              New Password <span className="text-red">*</span>
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPw ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={handleChange(setPasswordValue)}
                required
                autoComplete="new-password"
                minLength={MIN_PW}
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? (
                  <EyeOff className="h-5 w-5 text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block mb-2.5">
              Confirm Password <span className="text-red">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showCpw ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={handleChange(setConfirmPasswordValue)}
                required
                autoComplete="new-password"
                minLength={MIN_PW}
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowCpw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60"
                aria-label={showCpw ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showCpw ? (
                  <EyeOff className="h-5 w-5 text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
          >
            {loading ? 'Saving…' : 'Set Password'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SetupPassword;
