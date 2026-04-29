// src/components/Auth/SetupPin.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/features/auth';

const PIN_REGEX = /^[0-9]{4,6}$/;

const SetupPin: React.FC = () => {
  const navigate = useNavigate();
  const { setupPin, isAuthenticated } = useAuth();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const onlyDigits = (val: string) => val.replace(/\D/g, '').slice(0, 6);

  const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPin(onlyDigits(e.target.value));
    setError(undefined);
  };
  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPin(onlyDigits(e.target.value));
    setError(undefined);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!PIN_REGEX.test(pin)) {
      setError('PIN must be 4 to 6 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Saving PIN…', { position: 'bottom-center' });

    try {
      const result: any = await setupPin({ pin, confirmPin });
      if (result?.status && result.status !== 1) {
        toast.error(result.message || 'Failed to set PIN.', {
          id: toastId,
          position: 'bottom-center',
        });
        setError(result.message || 'Failed to set PIN.');
        return;
      }
      toast.success('Transaction PIN set.', {
        id: toastId,
        position: 'bottom-center',
      });

      // After PIN, complete the buyer journey.
      const next = isAuthenticated
        ? '/95668339501103956045/home'
        : '/95668339501103956045/auth/signin';
      navigate(next);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to set PIN. Please try again.';
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
            Set Your Transaction PIN
          </h2>
          <p>
            Choose a 4 to 6 digit PIN. You'll use this to authorise checkouts
            and other secure actions.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          <div className="mb-5">
            <label htmlFor="pin" className="block mb-2.5">
              New PIN <span className="text-red">*</span>
            </label>
            <div className="relative">
              <input
                id="pin"
                inputMode="numeric"
                autoComplete="new-password"
                placeholder="Enter 4-6 digit PIN"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={handlePinChange}
                required
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 pr-11 tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPin((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? (
                  <EyeOff className="h-5 w-5 text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="confirmPin" className="block mb-2.5">
              Confirm PIN <span className="text-red">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPin"
                inputMode="numeric"
                autoComplete="new-password"
                placeholder="Re-enter PIN"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPin}
                onChange={handleConfirmChange}
                required
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 pr-11 tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60"
                aria-label={showConfirm ? 'Hide PIN' : 'Show PIN'}
              >
                {showConfirm ? (
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
            {loading ? 'Saving…' : 'Set PIN'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SetupPin;
