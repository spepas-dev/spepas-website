// src/components/Auth/ProfileSwitchOtp.tsx
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useAccountType } from '@/features/accountTypeContext';
import { generateOtp, validateOtp } from '@/lib/otpApis';

const ProfileSwitchOtp: React.FC = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();
  const { setAccountType } = useAccountType();

  const user = authData.user as any; // user holds phoneNumber & User_ID (or id)
  const userId: string | undefined =
    user?.User_ID || user?.id || undefined;

  const [otp, setOtp] = useState('');
  const [otpID, setOtpID] = useState<string>(() => localStorage.getItem('switchOtpID') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate a fresh OTP for this flow (best effort)
  useEffect(() => {
    let cancelled = false;

    const requestOtp = async () => {
      if (!userId) return;
      try {
        const res = await generateOtp({
          counterType: 'MINUTE',
          sendSms: 1,
          phoneNumber: user?.phoneNumber, // backend expects your normalized format
          sendEmail: 0,
          emailMessage: '',
          smsMessage: '',
          expiryCounter: 10,
          User_ID: userId,
        });
        const id = res.data;
        if (!cancelled && id) {
          localStorage.setItem('switchOtpID', id);
          setOtpID(id);
          toast.success('OTP sent.', { position: 'bottom-center' });
        }
      } catch {
        // Don’t block the flow; user may already have a valid OTP
        // but surface a gentle message.
        toast('Could not auto-send OTP. Enter the code if you already received one.', {
          position: 'bottom-center',
        });
      }
    };

    if (!otpID) requestOtp();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const toastId = toast.loading('Verifying…', { position: 'bottom-center' });

    try {
      await validateOtp({ otp, otpID: otpID || '' });
      localStorage.removeItem('switchOtpID');

      // Apply the stashed role and clear it
      const pending = localStorage.getItem('pendingAccountType') as any;
      if (pending) {
        setAccountType(pending);
        localStorage.removeItem('pendingAccountType');
      }

      // tiny tick in case any cookies/headers matter (consistency w/ your flow)
      await new Promise((r) => setTimeout(r, 150));

      toast.success('Verified!', { id: toastId, position: 'bottom-center' });
      navigate('/95668339501103956045/home');
    } catch {
      toast.error('Verification failed. Please check your OTP and try again.', {
        id: toastId,
        position: 'bottom-center',
      });
      setError('Verification failed. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!userId) return;
    const toastId = toast.loading('Sending OTP…', { position: 'bottom-center' });
    try {
      const res = await generateOtp({
        counterType: 'MINUTE',
        sendSms: 1,
        phoneNumber: user?.phoneNumber,
        sendEmail: 0,
        emailMessage: '',
        smsMessage: '',
        expiryCounter: 10,
        User_ID: userId,
      });
      const id = res.data;
      localStorage.setItem('switchOtpID', id);
      setOtpID(id);
      toast.success('OTP sent.', { id: toastId, position: 'bottom-center' });
    } catch {
      toast.error('Could not resend OTP.', { id: toastId, position: 'bottom-center' });
    }
  };

  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
          <div className="text-center mb-8">
            <Link className="inline-block" to="/">
              <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
            </Link>
          </div>
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">Confirm Switch</h2>
            <p>Enter the OTP sent to your phone or email to switch account type.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-5">
              <label htmlFor="otp" className="block mb-2.5">
                OTP <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <p className="text-center mt-6">
              Didn’t receive an OTP?{' '}
              <button type="button" onClick={resend} className="text-dark hover:text-blue underline">
                Resend OTP
              </button>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default ProfileSwitchOtp;
