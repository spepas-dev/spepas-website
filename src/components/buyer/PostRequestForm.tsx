// src/components/orderBids/PostRequestForm.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { getCarManufacturers } from '@/lib/inventoryApis';
import { requestNonInventorySparePartAPI } from '@/lib/orderBidsApis';
import { toastConfig } from '@/lib/toast';

interface CarModel {
  CarModel_ID: string;
  name: string;
}

interface CarBrand {
  CarBrand_ID: string;
  name: string;
  models: CarModel[];
}

interface Manufacturer {
  Manufacturer_ID: string;
  name: string;
  brands: CarBrand[];
}

const PostRequestForm: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [desc, setDesc] = useState('');
  const [requireImage, setRequireImage] = useState(false);

  const navigate = useNavigate();

  // Fetch manufacturers
  useEffect(() => {
    getCarManufacturers()
      .then((res) => setManufacturers(res.data))
      .catch(console.error);
  }, []);

  // Derive brand list
  const brands: CarBrand[] = selectedManufacturer
    ? manufacturers.find((m) => m.Manufacturer_ID === selectedManufacturer)?.brands || []
    : [];

  // Derive model list
  const models: CarModel[] = selectedBrand ? brands.find((b) => b.CarBrand_ID === selectedBrand)?.models || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //API promise
    const apiPromise = requestNonInventorySparePartAPI({
      require_image: requireImage ? 1 : 0,
      quantity: qty,
      sparePartDetail: {
        name,
        description: desc,
        carModel_ID: selectedModel
      }
    });

    //Toast.promise
    toast
      .promise(
        apiPromise,
        {
          loading: 'Posting your request…',
          success: 'Request posted!',
          error: 'Failed to post request. Please try again.'
        },
        {
          duration: 3000,
          position: 'bottom-center'
        }
      )
      //reset & navigate
      .then(() => {
        setName('');
        setQty(1);
        setDesc('');
        setRequireImage(false);
        setSelectedManufacturer('');
        setSelectedBrand('');
        setSelectedModel('');
        navigate('/buyer/requests');
      })

      .catch(() => {
        // Handle error if needed
        console.error('Error posting request');
      });
  };

  console.log('selectedManufacturer:', selectedManufacturer);
  console.log('brands:', brands);

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        p-6 sm:p-8
        rounded-2xl shadow-lg
        max-w-3xl w-full sm:w-[100%]
        mx-auto
        space-y-6 mt-10
      "
    >
      {/* Row 1: Manufacturer & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Manufacturer</label>
          <select
            value={selectedManufacturer}
            onChange={(e) => {
              setSelectedManufacturer(e.target.value);
              setSelectedBrand('');
              setSelectedModel('');
            }}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs sm:text-sm"
          >
            <option value="" disabled>
              Select manufacturer
            </option>
            {manufacturers.map((m) => (
              <option key={m.Manufacturer_ID} value={m.Manufacturer_ID}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel('');
            }}
            required
            disabled={!brands.length}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs sm:text-sm"
          >
            <option value="" disabled>
              {brands.length ? 'Select brand' : 'Select manufacturer first'}
            </option>
            {brands.map((b) => (
              <option key={b.CarBrand_ID} value={b.CarBrand_ID}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Model & Part Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            required
            disabled={!models.length}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs sm:text-sm"
          >
            <option value="" disabled>
              {models.length ? 'Select model' : 'Choose a brand first'}
            </option>
            {models.map((m) => (
              <option key={m.CarModel_ID} value={m.CarModel_ID}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Part name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      {/* Row 3: Quantity & Photos Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(+e.target.value)}
            min={1}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={requireImage}
            onChange={(e) => setRequireImage(e.target.checked)}
            id="reqImg"
            className="h-4 w-4 accent-indigo-500"
          />
          <label htmlFor="reqImg" className="text-sm font-medium">
            Photos required
          </label>
        </div>
      </div>

      {/* Description (full width) */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="
          w-full
          bg-blue hover:bg-indigo-700
          text-white font-medium
          px-4 py-2 text-sm rounded-full drop-shadow-md
          sm:px-6 sm:py-3 sm:text-base sm:rounded-lg
          transition
        "
      >
        Post Request
      </button>

      {/* ——— Test Success Toast ——— */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => toastConfig.success('This is a test success!')}
          className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
        >
          Test Success Toast
        </button>
      </div>
    </form>
  );
};

export default PostRequestForm;
