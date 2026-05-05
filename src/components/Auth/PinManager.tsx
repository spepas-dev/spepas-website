// src/components/Auth/PinManager.tsx
//
// Unified transaction-PIN setup AND reset flow. Branches on pinStatusAPI:
//   - First-time setup → "new" → "confirm" → setupPinAPI.
//   - Reset (PIN already set) → "old" → "otp" → "new" → "confirm" → setupPinAPI.
//
// Mirrors the USSD reset flow for parity. Reset gates with the old PIN AND a
// fresh OTP to defend against stolen-device PIN rotation; setupPinAPI on the
// backend also fires an audit SMS on every successful change.

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/features/auth';
import {
  pinStatusAPI,
  setupPinAPI,
  verifyPinAPI,
} from '@/lib/auth';
import { generateOtp, validateOtp } from '@/lib/otpApis';

const PIN_REGEX = /^[0-9]{4,6}$/;
const OTP_REGEX = /^[0-9]{4,8}$/;

type Step = 'loading' | 'old' | 'otp' | 'new';

// Translate the spauthservices /verify-pin response into a user-facing message.
// Status codes: 1 OK, 0 FAILED (wrong PIN), 5 PENDING_REVIEW (no PIN set),
// 6 LOCKED (too many wrong attempts; data carries retryAfterSeconds).
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

interface PinManagerProps {
  // Optional callback fired when the PIN write succeeds. The page that hosts
  // this component owns redirect/navigation behaviour (onboarding flow vs
  // settings page), so we keep this component decoupled from routing.
  onSuccess?: () => void;
  // Heading + subheading override; defaults shown when the user has no PIN
  // yet (onboarding context) feel awkward in a settings context, hence the
  // hooks.
  title?: string;
  description?: string;
}

const onlyDigits = (val: string, maxLen: number) =>
  val.replace(/\D/g, '').slice(0, maxLen);

export const PinManager: React.FC<PinManagerProps> = ({
  onSuccess,
  title,
  description,
}) => {
  const { authData } = useAuth();
  const user = (authData?.user as any) || null;
  const userId: string | undefined = user?.User_ID || user?.id;
  const phoneNumber: string | undefined = user?.phoneNumber;

  const [step, setStep] = useState<Step>('loading');
  const [oldPin, setOldPin] = useState('');
  const [otp, setOtp] = useState('');
  const [otpID, setOtpID] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Decide: first-time setup vs reset. On lookup failure we fail closed to the
  // reset path so we never silently overwrite an existing PIN.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp: any = await pinStatusAPI();
        const hasPin = Boolean(resp?.data?.pinSet);
        if (cancelled) return;
        setStep(hasPin ? 'old' : 'new');
      } catch {
        if (cancelled) return;
        setStep('old');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // After the OTP is verified, we move to the new-PIN entry step.
  const requestResetOtp = async () => {
    if (!userId) {
      setError('Account information missing — please sign in again.');
      return null;
    }
    try {
      const resp: any = await generateOtp({
        counterType: 'MINUTE',
        sendSms: 1,
        phoneNumber,
        sendEmail: 0,
        emailMessage: '',
        smsMessage: 'Use this code to confirm your SpePas PIN reset:',
        expiryCounter: 10,
        User_ID: userId,
      });
      const id = resp?.data || '';
      if (!id) {
        setError('We could not send a confirmation code. Please try again.');
        return null;
      }
      return id as string;
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Could not send confirmation code.');
      return null;
    }
  };

  const handleSubmitOldPin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    if (!PIN_REGEX.test(oldPin)) {
      setError('Current PIN must be 4 to 6 digits.');
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading('Verifying current PIN…', { position: 'bottom-center' });
    try {
      const resp: any = await verifyPinAPI({ pin: oldPin });
      if (resp?.status !== 1) {
        const msg = formatPinVerifyError(resp);
        toast.error(msg, { id: toastId, position: 'bottom-center' });
        setError(msg);
        return;
      }
      const id = await requestResetOtp();
      if (!id) {
        toast.error(error || 'Failed to send confirmation code.', { id: toastId, position: 'bottom-center' });
        return;
      }
      setOtpID(id);
      setStep('otp');
      toast.success('Confirmation code sent.', { id: toastId, position: 'bottom-center' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Verification failed.';
      toast.error(msg, { id: toastId, position: 'bottom-center' });
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    if (!OTP_REGEX.test(otp)) {
      setError('Enter the 4-8 digit code from your SMS.');
      return;
    }
    if (!otpID) {
      setError('Session expired. Please reload and try again.');
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading('Verifying code…', { position: 'bottom-center' });
    try {
      await validateOtp({ otp, otpID });
      toast.success('Code verified.', { id: toastId, position: 'bottom-center' });
      setStep('new');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Incorrect or expired code.';
      toast.error(msg, { id: toastId, position: 'bottom-center' });
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError(undefined);
    const toastId = toast.loading('Sending new code…', { position: 'bottom-center' });
    const id = await requestResetOtp();
    if (id) {
      setOtpID(id);
      setOtp('');
      toast.success('New code sent.', { id: toastId, position: 'bottom-center' });
    } else {
      toast.error('Could not send a new code.', { id: toastId, position: 'bottom-center' });
    }
  };

  const handleSubmitNew = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    if (!PIN_REGEX.test(newPin)) {
      setError('PIN must be 4 to 6 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading('Saving PIN…', { position: 'bottom-center' });
    try {
      const resp: any = await setupPinAPI({ pin: newPin, confirmPin });
      if (resp?.status !== 1) {
        toast.error(resp?.message || 'Failed to set PIN.', { id: toastId, position: 'bottom-center' });
        setError(resp?.message || 'Failed to set PIN.');
        return;
      }
      toast.success('Transaction PIN saved.', { id: toastId, position: 'bottom-center' });
      // Clear sensitive state.
      setOldPin('');
      setOtp('');
      setOtpID('');
      setNewPin('');
      setConfirmPin('');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to set PIN.';
      toast.error(msg, { id: toastId, position: 'bottom-center' });
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const showHeader = (h: string, p: string) => (
    <div className="text-center mb-8">
      <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">{h}</h2>
      <p className="text-gray-600">{p}</p>
    </div>
  );

  const renderPinInput = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
    autoComplete = 'one-time-code'
  ) => (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2.5">
        {label} <span className="text-red">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          inputMode="numeric"
          autoComplete={autoComplete}
          placeholder="Enter 4-6 digit PIN"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(onlyDigits(e.target.value, 6))}
          required
          className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 pr-11 tracking-widest"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60"
          aria-label={show ? 'Hide PIN' : 'Show PIN'}
        >
          {show ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />}
        </button>
      </div>
    </div>
  );

  if (step === 'loading') {
    return (
      <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11 text-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (step === 'old') {
    return (
      <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
        {showHeader(
          title || 'Change Your Transaction PIN',
          description ||
            "For your security, enter your current PIN. We'll then send a confirmation code to your phone."
        )}
        <form onSubmit={handleSubmitOldPin}>
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
          {renderPinInput('oldPin', 'Current PIN', oldPin, setOldPin, showOld, setShowOld, 'current-password')}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-2"
          >
            {submitting ? 'Verifying…' : 'Continue'}
          </button>
        </form>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
        {showHeader(
          'Confirm with code',
          `We sent a 4-8 digit code to ${phoneNumber || 'your phone'}. Enter it below to continue.`
        )}
        <form onSubmit={handleSubmitOtp}>
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
          <div className="mb-5">
            <label htmlFor="otpInput" className="block mb-2.5">
              Confirmation code <span className="text-red">*</span>
            </label>
            <input
              id="otpInput"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter the code"
              type="text"
              value={otp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(onlyDigits(e.target.value, 8))}
              required
              className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 tracking-widest"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-2"
          >
            {submitting ? 'Verifying…' : 'Verify Code'}
          </button>
          <p className="text-center mt-6 text-sm">
            Didn't get it?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-dark hover:text-blue underline"
              disabled={submitting}
            >
              Resend code
            </button>
          </p>
        </form>
      </div>
    );
  }

  // step === 'new'
  return (
    <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
      {showHeader(
        title || 'Set Your Transaction PIN',
        description ||
          "Choose a 4 to 6 digit PIN. You'll use this to authorise checkouts, withdrawals, and other secure actions."
      )}
      <form onSubmit={handleSubmitNew}>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
        {renderPinInput('newPin', 'New PIN', newPin, setNewPin, showNew, setShowNew, 'new-password')}
        {renderPinInput('confirmPin', 'Confirm PIN', confirmPin, setConfirmPin, showConfirm, setShowConfirm, 'new-password')}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-2"
        >
          {submitting ? 'Saving…' : 'Save PIN'}
        </button>
      </form>
    </div>
  );
};

export default PinManager;
