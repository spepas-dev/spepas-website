import React, { useEffect, useMemo, useState } from 'react';

import MapPicker from '@/components/common/MapPicker';
import SpepasLoader from '@/components/common/SpepasLoader';
import { addAddress, getMyAddresses } from '@/lib/addressApis';

interface Address {
  address_id: string;
  title: string;
  addressDetails: string;
  location: { coordinates: [number, number] };
  date_added: string;
  status: number;
}

const AddressDetails: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', addressDetails: '', longitude: '', latitude: '' });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const latNum = useMemo(() => { const n = parseFloat(form.latitude); return Number.isFinite(n) ? n : null; }, [form.latitude]);
  const lngNum = useMemo(() => { const n = parseFloat(form.longitude); return Number.isFinite(n) ? n : null; }, [form.longitude]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await getMyAddresses();
      setAddresses(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addAddress({
        title: form.title,
        addressDetails: form.addressDetails,
        longitude: parseFloat(form.longitude),
        latitude: parseFloat(form.latitude)
      });
      setForm({ title: '', addressDetails: '', longitude: '', latitude: '' });
      setShowForm(false);
      fetchAddresses();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SpepasLoader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2 px-5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {showForm ? 'Cancel' : 'Add Address'}
        </button>
      </div>

      {/* Add form (collapsible) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              required
              placeholder="e.g. Home, Office"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Address Details</label>
            <textarea
              value={form.addressDetails}
              onChange={handleChange('addressDetails')}
              required
              rows={2}
              placeholder="Street, City, Region"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
            <MapPicker
              value={{ lat: latNum, lng: lngNum }}
              onChange={(lat, lng) => setForm((prev) => ({ ...prev, latitude: String(lat), longitude: String(lng) }))}
              height={260}
              showLocate
              showSearch
              defaultZoom={12}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Longitude</label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange('longitude')}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Latitude</label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange('latitude')}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-6 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Address'
            )}
          </button>
        </form>
      )}

      {/* Address list */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No addresses added yet.</p>
          <p className="text-gray-400 text-xs mt-1">Click "Add Address" to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.address_id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4.5 h-4.5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{addr.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{addr.addressDetails}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {addr.location.coordinates[1].toFixed(4)}, {addr.location.coordinates[0].toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressDetails;
