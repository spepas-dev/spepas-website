// src/components/Auth/SetupAddress.tsx
//
// Final step in the post-auth onboarding chain for buyers. Captures one
// delivery address so checkout has somewhere to ship to. Skipping is allowed
// (users can also add addresses later from MyAccount → Addresses), but the
// chain prefers to push admin-onboarded buyers through this once.
import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import MapPicker from '@/components/common/MapPicker';
import { addAddress } from '@/lib/addressApis';
import { HOME_PATH } from '@/lib/onboardingFlow';

const SetupAddress: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const latNum = useMemo(() => {
    const n = parseFloat(latitude);
    return Number.isFinite(n) ? n : null;
  }, [latitude]);
  const lngNum = useMemo(() => {
    const n = parseFloat(longitude);
    return Number.isFinite(n) ? n : null;
  }, [longitude]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!title.trim()) {
      setError('Address title is required.');
      return;
    }
    if (!addressDetails.trim()) {
      setError('Address details are required.');
      return;
    }
    if (latNum === null || lngNum === null) {
      setError('Pick a location on the map (or enter latitude and longitude).');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Saving address…', { position: 'bottom-center' });

    try {
      await addAddress({
        title: title.trim(),
        addressDetails: addressDetails.trim(),
        longitude: lngNum,
        latitude: latNum,
      });
      toast.success('Delivery address saved.', {
        id: toastId,
        position: 'bottom-center',
      });
      navigate(HOME_PATH);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save address. Please try again.';
      toast.error(msg, { id: toastId, position: 'bottom-center' });
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    toast(
      'You can add a delivery address later from MyAccount → Addresses.',
      { position: 'bottom-center', icon: 'ℹ️' }
    );
    navigate(HOME_PATH);
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5';

  return (
    <section className="overflow-hidden bg-white">
      <div className="max-w-[670px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
        <div className="text-center mb-8">
          <Link className="inline-block" to="/">
            <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">
            Add a Delivery Address
          </h2>
          <p>
            We'll send your orders here. You can add more addresses later from
            your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label htmlFor="addr-title" className="block mb-2.5">
              Address Title <span className="text-red">*</span>
            </label>
            <input
              id="addr-title"
              type="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
              placeholder="e.g. Home, Office"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="addr-details" className="block mb-2.5">
              Address Details <span className="text-red">*</span>
            </label>
            <textarea
              id="addr-details"
              value={addressDetails}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAddressDetails(e.target.value)}
              required
              rows={3}
              placeholder="Street, building, landmarks, region…"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block mb-2.5">
              Pin the Location <span className="text-red">*</span>
            </label>
            <MapPicker
              value={{ lat: latNum, lng: lngNum }}
              onChange={(lat, lng) => {
                setLatitude(String(lat));
                setLongitude(String(lng));
              }}
              height={300}
              showLocate
              showSearch
              defaultZoom={12}
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Drop a pin on the map or use "Locate me".
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="addr-lat" className="block mb-2.5">
                Latitude
              </label>
              <input
                id="addr-lat"
                type="number"
                step="any"
                value={latitude}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLatitude(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="addr-lng" className="block mb-2.5">
                Longitude
              </label>
              <input
                id="addr-lng"
                type="number"
                step="any"
                value={longitude}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLongitude(e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-2"
          >
            {saving ? 'Saving…' : 'Save Address'}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            disabled={saving}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition"
          >
            Skip for now
          </button>
        </form>
      </div>
    </section>
  );
};

export default SetupAddress;
