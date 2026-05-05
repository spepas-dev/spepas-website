// src/components/Auth/ProfileSwitchOtp.tsx
//
// Profile-switch verification gate. Originally OTP-based; now PIN-based
// since every user has one transaction PIN that already gates wallet
// withdrawals, cart checkouts, etc. The URL is kept (`profile-switch-otp`)
// to avoid touching MyAccount + auth routes unnecessarily.
//
// Switching TO the buyer profile bypasses this gate entirely — that path is
// handled in MyAccount before navigation, so this page only ever runs for
// elevated profiles (Seller / Rider / Gopa / Mepa).

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { useAccountType } from '@/features/accountTypeContext';
import { pinStatusAPI, verifyPinAPI } from '@/lib/auth';

const PIN_REGEX = /^[0-9]{4,6}$/;

const onlyDigits = (val: string) => val.replace(/\D/g, '').slice(0, 6);

// Translate verify-pin response into a user-facing message. Mirrors the
// helper in PinManager.tsx; kept inline here for component independence.
const formatPinVerifyError = (resp: any): string => {
  if (!resp) return 'Verification failed. Please try again.';
  if (resp.status === 6) {
    const secs = Number(resp?.data?.retryAfterSeconds || 0);
    const mins = Math.max(1, Math.ceil(secs / 60));
    return `Too many wrong PIN attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.`;
  }
  if (resp.status === 5) {
    return 'No transaction PIN is set on this account. Set one to continue.';
  }
  if (resp.status === 0) {
    const remaining = resp?.data?.remainingAttempts;
    if (typeof remaining === 'number' && remaining >= 0) {
      return remaining === 0
        ? 'Wrong PIN. This was your last attempt before lockout.'
        : `Wrong PIN. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout.`;
    }
    return resp.message || 'Wrong PIN.';
  }
  return resp.message || 'Verification failed.';
};

const ProfileSwitchOtp: React.FC = () => {
  const navigate = useNavigate();
  const { setAccountType } = useAccountType();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Pull the pending role on mount + sanity-check the user has a PIN. If they
  // don't, redirect them to set one — they can't proceed past this gate
  // without one.
  useEffect(() => {
    const stored = localStorage.getItem('pendingAccountType');
    setPending(stored);

    let cancelled = false;
    (async () => {
      try {
        const resp: any = await pinStatusAPI();
        if (cancelled) return;
        setHasPin(Boolean(resp?.data?.pinSet));
      } catch {
        if (cancelled) return;
        setHasPin(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // No PIN on file — block the switch and route them to set one. Admin-
  // onboarded sellers/riders/gopas in particular tend to land here without
  // a PIN since the call-orders flow doesn't ask for one.
  useEffect(() => {
    if (hasPin === false) {
      toast(
        'You need to set a transaction PIN before switching to elevated profiles.',
        { position: 'bottom-center' }
      );
      navigate('/95668339501103956045/auth/manage-pin');
    }
  }, [hasPin, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!PIN_REGEX.test(pin)) {
      setError('PIN must be 4 to 6 digits.');
      return;
    }

    if (!pending) {
      setError('No profile selected. Please pick a profile from My Account.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Verifying PIN…', { position: 'bottom-center' });

    try {
      const resp: any = await verifyPinAPI({ pin });
      if (resp?.status !== 1) {
        const msg = formatPinVerifyError(resp);
        toast.error(msg, { id: toastId, position: 'bottom-center' });
        setError(msg);
        return;
      }
      setAccountType(pending as any);
      localStorage.removeItem('pendingAccountType');
      toast.success(`Switched to ${pending}.`, { id: toastId, position: 'bottom-center' });
      // Brief tick so role state propagates before navigation.
      await new Promise((r) => setTimeout(r, 100));
      navigate('/95668339501103956045/home');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Verification failed. Please try again.';
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
        <div className="text-center mb-11">
          <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">
            Confirm Switch
          </h2>
          <p>
            Enter your transaction PIN to switch to{' '}
            <span className="font-semibold">{pending || 'your selected profile'}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-5">
            <label htmlFor="pin" className="block mb-2.5">
              Transaction PIN <span className="text-red">*</span>
            </label>
            <div className="relative">
              <input
                id="pin"
                inputMode="numeric"
                autoComplete="current-password"
                placeholder="Enter your PIN"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPin(onlyDigits(e.target.value))}
                required
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 pr-11 tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPin((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || hasPin === null}
            className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>

          <p className="text-center mt-6 text-sm">
            Forgot your PIN?{' '}
            <Link
              to="/95668339501103956045/auth/manage-pin"
              className="text-dark hover:text-blue underline"
            >
              Reset it
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ProfileSwitchOtp;
