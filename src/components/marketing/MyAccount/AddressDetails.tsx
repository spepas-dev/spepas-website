// src/components/marketing/MyAccount/AddressDetails.tsx
import React, { useEffect, useState } from 'react';
import { getMyAddresses, addAddress } from '@/lib/addressApis';

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
    setForm(prev => ({ ...prev, [field]: e.target.value }));
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
    return <p>Loading addresses…</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">My Addresses</h3>
      {addresses.length === 0 ? (
        <p className="text-gray-500 mb-6">No addresses found.</p>
      ) : (
        <ul className="mb-6 space-y-4">
          {addresses.map(addr => (
            <li key={addr.address_id} className="p-4 border rounded-lg">
              <p><strong>{addr.title}</strong></p>
              <p>{addr.addressDetails}</p>
              <p className="text-sm text-gray-500">
                Coordinates: {addr.location.coordinates[1]}, {addr.location.coordinates[0]}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Address Details</label>
          <textarea
            value={form.addressDetails}
            onChange={handleChange('addressDetails')}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Longitude</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange('longitude')}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Latitude</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange('latitude')}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {saving ? 'Saving…' : 'Add Address'}
        </button>
      </form>
    </div>
  );
};

export default AddressDetails;
