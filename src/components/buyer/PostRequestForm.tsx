// src/components/orderBids/PostRequestForm.tsx
import React, { useState, useEffect } from 'react'
import { requestNonInventorySparePartAPI } from '@/lib/orderBidsApis'
import { getCarManufacturers } from '@/lib/inventoryApis'
// import { toastConfig } from '@/lib/toast'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface CarModel {
  CarModel_ID: string
  name: string
}

interface CarBrand {
  CarBrand_ID: string
  name: string
  models: CarModel[]
}

interface Manufacturer {
  Manufacturer_ID: string
  name: string
  brands: CarBrand[]
}

const PostRequestForm: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [selectedManufacturer, setSelectedManufacturer] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')

  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [desc, setDesc] = useState('')
  const [requireImage, setRequireImage] = useState(false)

  const navigate = useNavigate();

  // Fetch manufacturers
  useEffect(() => {
    getCarManufacturers()
      .then(res => setManufacturers(res.data))
      .catch(console.error)
  }, [])

  // Derive brand list
  const brands: CarBrand[] =
    selectedManufacturer
      ? manufacturers.find(m => m.Manufacturer_ID === selectedManufacturer)
           ?.brands || []
      : []

  // Derive model list
  const models: CarModel[] =
    selectedBrand
      ? brands.find(b => b.CarBrand_ID === selectedBrand)
          ?.models || []
      : []

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()

  //API promise
  const apiPromise = requestNonInventorySparePartAPI({
    require_image: requireImage ? 1 : 0,
    quantity: qty,
    sparePartDetail: {
      name,
      description: desc,
      carModel_ID: selectedModel,
    },
  })

  //Toast.promise
  toast
    .promise(
      apiPromise,
      {
        loading: 'Posting your request…',
        success: 'Request posted!',
        error: 'Failed to post request. Please try again.',
      },
      {
        duration: 3000,
        position: 'bottom-center',
      }
    )
    //reset & navigate
    .then(() => {
      setName('')
      setQty(1)
      setDesc('')
      setRequireImage(false)
      setSelectedManufacturer('')
      setSelectedBrand('')
      setSelectedModel('')
      navigate('/buyer/requests')
    })
    
    .catch(() => {
      // Handle error if needed
      console.error('Error posting request')
    })
}

  console.log('selectedManufacturer:', selectedManufacturer);
console.log('brands:', brands);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h2 className="text-2xl font-semibold text-blue-800">
        Post a Request
      </h2>

      <button
        type="button"
        onClick={() => navigate('/buyer/requests')}
        className="
          flex items-center
          mt-3 sm:mt-0        /* keep some top margin on mobile so it doesn’t feel cramped */
          px-4 py-2 
          text-sm text-blue-700 
          border border-gray-300 
          rounded-lg 
          hover:bg-gray-100 
          transition
        "
      >
        <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-4 h-4 mr-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2-2h-4a2 2 0 00-2 2v1h10V5a2 2 0 00-2-2zM9 11h6M9 15h6"
    />
  </svg>
        My Requests
      </button>
    </div>

    {/* Descriptive text below the heading/button row */}
    <p className="mb-6 text-gray-600">
      Please fill out the form below to post a request. Your request will be reviewed shortly.
    </p>
      <form
      onSubmit={handleSubmit}
      className="
        w-full
          bg-white
          p-6 sm:p-8
          rounded-2xl shadow-lg
          space-y-6 mt-6
      "
    >
      {/* Row 1: Manufacturer & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-blue">Manufacturer</label>
          <select
            value={selectedManufacturer}
            onChange={e => {
              setSelectedManufacturer(e.target.value)
              setSelectedBrand('')
              setSelectedModel('')
            }}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs sm:text-sm"
          >
            <option value="" disabled>
              Select manufacturer
            </option>
            {manufacturers.map(m => (
              <option key={m.Manufacturer_ID} value={m.Manufacturer_ID}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-blue">Brand</label>
          <select
            value={selectedBrand}
            onChange={e => {
              setSelectedBrand(e.target.value)
              setSelectedModel('')
            }}
            required
            disabled={!brands.length}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs sm:text-sm"
          >
            <option value="" disabled>
              {brands.length ? 'Select brand' : 'Select manufacturer first'}
            </option>
            {brands.map(b => (
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
          <label className="block text-sm font-medium mb-1 text-blue">Model</label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            required
            disabled={!models.length}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs sm:text-sm"
          >
            <option value="" disabled>
              {models.length ? 'Select model' : 'Choose a brand first'}
            </option>
            {models.map(m => (
              <option key={m.CarModel_ID} value={m.CarModel_ID}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-blue">Part name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      {/* Row 3: Quantity & Photos Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <label className="block text-sm font-medium mb-1 text-blue">Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={e => setQty(+e.target.value)}
            min={1}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={requireImage}
            onChange={e => setRequireImage(e.target.checked)}
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
        <label className="block text-sm font-medium mb-1 text-blue">Description</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
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


    </form>
    </>

  )
}

export default PostRequestForm
