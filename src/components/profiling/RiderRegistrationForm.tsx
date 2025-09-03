// src/components/profiling/RiderRegistrationForm.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/common/Breadcrumb';
import { createRiderProfileSelf, addRiderVehicleSelf } from '@/lib/profiling';
import {
  riderRegistrationSchema,
  riderVehicleRegistrationSchema
} from '@/lib/profilingZodValidation';

const RiderRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [licenseNumber, setLicenseNumber] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const riderPayload = {
        licenseNumber,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      };
      riderRegistrationSchema.parse(riderPayload);
      await createRiderProfileSelf(riderPayload);

      const vehiclePayload = {
        Deliver_ID: '', // backend uses current user
        type: vehicleType,
        model: vehicleModel,
        color: vehicleColor,
        registrationNumber,
      };
      riderVehicleRegistrationSchema.parse(vehiclePayload);
      await addRiderVehicleSelf(vehiclePayload as any);

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
      <Breadcrumb title="Rider Registration" pages={['Profiling', 'Rider Registration']} />
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] mx-auto rounded-xl bg-white shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register Rider Profile</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="block mb-2.5">License Number</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={e => setLicenseNumber(e.target.value)}
              className="w-full rounded-lg border bg-gray-100 p-3 mb-5"
              required
            />
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block mb-2.5">Longitude</label>
                <input
                  type="number"
                  value={longitude}
                  onChange={e => setLongitude(e.target.value)}
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  required
                />
              </div>
              <div>
                <label className="block mb-2.5">Latitude</label>
                <input
                  type="number"
                  value={latitude}
                  onChange={e => setLatitude(e.target.value)}
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  required
                />
              </div>
            </div>
            <label className="block mb-2.5">Vehicle Type</label>
            <input
              type="text"
              value={vehicleType}
              onChange={e => setVehicleType(e.target.value)}
              className="w-full rounded-lg border bg-gray-100 p-3 mb-5"
              required
            />
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block mb-2.5">Model</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={e => setVehicleModel(e.target.value)}
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  required
                />
              </div>
              <div>
                <label className="block mb-2.5">Color</label>
                <input
                  type="text"
                  value={vehicleColor}
                  onChange={e => setVehicleColor(e.target.value)}
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  required
                />
              </div>
            </div>
            <label className="block mb-2.5">Registration Number</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={e => setRegistrationNumber(e.target.value)}
              className="w-full rounded-lg border bg-gray-100 p-3 mb-5"
              required
            />
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

export default RiderRegistrationForm;
