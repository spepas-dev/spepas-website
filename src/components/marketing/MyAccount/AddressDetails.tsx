import React, { useEffect, useState } from 'react';
import { getMyAddresses, addAddress } from '@/lib/addressApis';
import { MapPin, Plus, Navigation, Loader2 } from 'lucide-react';
import SpepasLoader from '@/components/common/SpepasLoader';

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
  const [form, setForm] = useState({
    title: '',
    addressDetails: '',
    longitude: '',
    latitude: '',
  });
  const [saving, setSaving] = useState(false);

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

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addAddress({
        title: form.title,
        addressDetails: form.addressDetails,
        longitude: parseFloat(form.longitude),
        latitude: parseFloat(form.latitude),
      });
      setForm({ title: '', addressDetails: '', longitude: '', latitude: '' });
      fetchAddresses();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SpepasLoader size="lg" label="Loading addresses..." fullSection />;
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">My Addresses</h3>
        <p className="text-sm text-dark-4 mt-1">Manage your saved delivery addresses</p>
      </div>

      {/* Address list */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
          <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-dark-4" />
          </div>
          <p className="text-sm font-medium text-dark-2">No addresses yet</p>
          <p className="text-xs text-dark-4 mt-1">Add your first delivery address below</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {addresses.map((addr) => (
            <div
              key={addr.address_id}
              className="bg-gray-1 rounded-xl border border-gray-3 p-5 hover:shadow-1 transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center mt-0.5">
                  <MapPin className="h-4 w-4 text-blue" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-dark">{addr.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      addr.status === 1
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-2 text-dark-4'
                    }`}>
                      {addr.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-dark-3 mt-1">{addr.addressDetails}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Navigation className="h-3 w-3 text-dark-5" />
                    <p className="text-xs text-dark-5">
                      {addr.location.coordinates[1].toFixed(6)}, {addr.location.coordinates[0].toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add address form */}
      <div className="mt-8 pt-6 border-t border-gray-3">
        <h4 className="text-base font-semibold text-dark mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </h4>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <div>
            <label className="block mb-2 text-sm font-medium text-dark">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              required
              placeholder="e.g. Home, Office, Warehouse"
              className="w-full h-11 rounded-lg border border-gray-3 bg-gray-1 px-4 text-sm text-dark placeholder:text-dark-5 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-dark">Address Details</label>
            <textarea
              value={form.addressDetails}
              onChange={handleChange('addressDetails')}
              required
              rows={3}
              placeholder="Full street address"
              className="w-full rounded-lg border border-gray-3 bg-gray-1 px-4 py-3 text-sm text-dark placeholder:text-dark-5 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-dark">Longitude</label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange('longitude')}
                required
                className="w-full h-11 rounded-lg border border-gray-3 bg-gray-1 px-4 text-sm text-dark focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-dark">Latitude</label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange('latitude')}
                required
                className="w-full h-11 rounded-lg border border-gray-3 bg-gray-1 px-4 text-sm text-dark focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-6 rounded-xl hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Address
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressDetails;
