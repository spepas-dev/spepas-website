import React, { useState, FormEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/common/Breadcrumb';
import { createSellerProfileSelf } from '@/lib/profiling';
import { sellerRegistrationSchema } from '@/lib/profilingZodValidation';
import MapPicker from '@/components/common/MapPicker'; // *adjusted*

const SellerRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [longitude, setLongitude] = useState(''); // keep as string for inputs
  const [latitude, setLatitude] = useState('');   // keep as string for inputs
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Derive numeric values for the map and payload
  const latNum = useMemo(() => {
    const n = parseFloat(latitude);
    return Number.isFinite(n) ? n : null;
  }, [latitude]);

  const lngNum = useMemo(() => {
    const n = parseFloat(longitude);
    return Number.isFinite(n) ? n : null;
  }, [longitude]);

  const validatePhone = (value: string): string | null => {
    if (!value) return 'Phone number is required.';
    if (/[^0-9]/.test(value)) {
      return 'Phone number must contain digits only (0-9).';
    }
    if (value.length < 10) {
      return 'Phone number is too short for a Ghana number (min 10 digits).';
    }
    if (value.length > 15) {
      return 'Phone number is too long.';
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setPhoneError('');
    setLoading(true);
    try {
      const phoneValidationMessage = validatePhone(phoneNumber);
      if (phoneValidationMessage) {
        setPhoneError(phoneValidationMessage);
        setLoading(false);
        return;
      }

      const payload = {
        storeName,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        phoneNumber,
        shopAddress,
      };
      sellerRegistrationSchema.parse(payload);
      await createSellerProfileSelf(payload);
      navigate('/95668339501103956045/add-payment-account');
    } catch {
      setError('Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pt-10"></section>
      <Breadcrumb title="Seller Registration" pages={['Profiling', 'Seller Registration']} />
      <section className="overflow-hidden bg-white">
        <div className="max-w-[720px] mx-auto rounded-xl bg-white shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register Seller Profile</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2.5 font-medium">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-lg border bg-gray-100 p-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2.5 font-medium">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setPhoneNumber(value);
                  const msg = validatePhone(value);
                  setPhoneError(msg ?? '');
                }}
                className="w-full rounded-lg border bg-gray-100 p-3"
                required
              />
              {phoneError && (
                <p className="mt-1 text-xs text-red-500">
                  {phoneError}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2.5 font-medium">Shop Address</label>
              <textarea
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className="w-full rounded-lg border bg-gray-100 p-3"
                rows={3}
                required
              />
            </div>

            {/* Map + Coordinate Inputs */}
            <div className="space-y-4">
              <label className="block font-medium">Location</label>

              <MapPicker
                value={{ lat: latNum, lng: lngNum }}
                onChange={(lat, lng) => {
                  setLatitude(String(lat));
                  setLongitude(String(lng));
                }}
                height={360}
                showLocate
                defaultZoom={12}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2.5">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full rounded-lg border bg-gray-100 p-3"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2.5">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full rounded-lg border bg-gray-100 p-3"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Tip: Click the map or use “Use my location” to auto-fill the coordinates.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3 rounded-lg"
            >
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SellerRegistrationForm;
