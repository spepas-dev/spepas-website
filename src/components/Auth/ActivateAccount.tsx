// src/components/Auth/ActivateAccount.tsx
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';
import { resolveNextOnboardingStep } from '@/lib/onboardingFlow';

const ActivateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { activateAccount, resendActivation } = useAuth();

  // If we already have an otpID (typical self-signup flow), skip the phone step.
  const initialOtpId = (() => {
    try {
      return localStorage.getItem('otpID') || '';
    } catch {
      return '';
    }
  })();

  const [step, setStep] = useState<'phone' | 'otp'>(
    initialOtpId ? 'otp' : 'phone'
  );
  const [otpID, setOtpID] = useState<string>(initialOtpId);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [step]);

  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const trimmed = phoneNumber.trim();
    if (!/^[0-9]{9,15}$/.test(trimmed)) {
      setError('Enter a valid phone number (digits only).');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Sending activation code…', {
      position: 'bottom-center',
    });

    try {
      const result: any = await resendActivation({ phoneNumber: trimmed });
      if (result?.status && result.status !== 1) {
        toast.error(result.message || 'Failed to send code.', {
          id: toastId,
          position: 'bottom-center',
        });
        setError(result.message || 'Failed to send code.');
        return;
      }
      const newOtpId = result?.data;
      if (!newOtpId) {
        toast.error('No activation reference returned.', {
          id: toastId,
          position: 'bottom-center',
        });
        setError('No activation reference returned.');
        return;
      }

      try {
        localStorage.setItem('otpID', newOtpId);
      } catch {
        // ignore storage failures
      }
      setOtpID(newOtpId);
      setStep('otp');
      toast.success('Code sent. Check your phone.', {
        id: toastId,
        position: 'bottom-center',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to send activation code.';
      toast.error(msg, { id: toastId, position: 'bottom-center' });
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const toastId = toast.loading('Verifying…', {
      position: 'bottom-center',
    });

    try {
      const flags = await activateAccount({ otp, otpID });
      try {
        localStorage.removeItem('otpID');
      } catch {
        // ignore
      }
      // small tick to ensure Set-Cookie is committed in dev proxy before nav
      await new Promise((r) => setTimeout(r, 150));

      toast.success('Account activated!', {
        id: toastId,
        position: 'bottom-center',
      });

      // Priority chain: password → PIN → delivery address → home.
      const next = await resolveNextOnboardingStep({
        passwordRequired: flags.passwordRequired,
        pinRequired: flags.pinRequired,
      });
      navigate(next || '/95668339501103956045/add-identification');
    } catch {
      toast.error('Activation failed. Please check your OTP and try again.', {
        id: toastId,
        position: 'bottom-center',
      });
      setError('Activation failed. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phoneNumber.trim() && step === 'otp') {
      // Send the user back to the phone step so they can identify themselves.
      setStep('phone');
      return;
    }
    await handleRequestOtp(
      // synthesise a no-op event so we can reuse the handler
      { preventDefault: () => {} } as unknown as FormEvent<HTMLFormElement>
    );
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
            Activate Your Account
          </h2>
          <p>
            {step === 'phone'
              ? 'Enter the phone number used during onboarding to receive an activation code.'
              : 'Please enter the OTP sent to your phone or email.'}
          </p>
        </div>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp}>
            <div className="mb-5">
              <label htmlFor="phoneNumber" className="block mb-2.5">
                Phone Number <span className="text-red">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                inputMode="numeric"
                placeholder="e.g. 0541234567"
                value={phoneNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ''))
                }
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? 'Sending…' : 'Send Activation Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitOtp}>
            <div className="mb-5">
              <label htmlFor="otp" className="block mb-2.5">
                OTP <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="otp"
                inputMode="numeric"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setOtp(e.target.value.replace(/\D/g, ''))
                }
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 tracking-widest"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>
            <p className="text-center mt-6">
              Didn’t receive an OTP?{' '}
              <button
                type="button"
                onClick={handleResend}
                className="text-dark hover:text-blue underline"
              >
                Resend OTP
              </button>
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default ActivateAccount;
