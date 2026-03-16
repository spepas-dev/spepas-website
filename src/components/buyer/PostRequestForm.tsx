import React, { useState, useEffect } from 'react'
import { requestNonInventorySparePartAPI } from '@/lib/orderBidsApis'
import { getCarManufacturers, getCarBrands, getCarModels } from '@/lib/inventoryApis'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'

interface CarModel { CarModel_ID: string; name: string }
interface CarBrand { CarBrand_ID: string; name: string; models?: CarModel[] }
interface Manufacturer { Manufacturer_ID: string; name: string; brands?: CarBrand[] }

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition bg-white'

const PostRequestForm: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [brands, setBrands] = useState<CarBrand[]>([])
  const [models, setModels] = useState<CarModel[]>([])

  const [selectedManufacturer, setSelectedManufacturer] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')

  const [loadingBrands, setLoadingBrands] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)

  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [desc, setDesc] = useState('')
  const [requireImage, setRequireImage] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const prefill = location.state as {
    partName?: string
    manufacturerName?: string
    brandName?: string
  } | null

  const qtyInvalid = qty <= 0

  // Load manufacturers on mount
  useEffect(() => {
    getCarManufacturers()
      .then(res => {
        const mfrs = res.data as Manufacturer[]
        setManufacturers(mfrs)

        if (prefill?.partName) setName(prefill.partName)
        if (prefill?.manufacturerName) {
          const mfr = mfrs.find(
            m => m.name.toLowerCase() === prefill.manufacturerName!.toLowerCase()
          )
          if (mfr) setSelectedManufacturer(mfr.Manufacturer_ID)
        }
      })
      .catch(console.error)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch brands when manufacturer changes
  useEffect(() => {
    if (!selectedManufacturer) { setBrands([]); setModels([]); return }

    // Check if the manufacturer already has nested brands
    const mfr = manufacturers.find(m => m.Manufacturer_ID === selectedManufacturer)
    if (mfr?.brands?.length) {
      setBrands(mfr.brands)
      // Handle prefill
      if (prefill?.brandName) {
        const brand = mfr.brands.find(
          b => b.name.toLowerCase() === prefill.brandName!.toLowerCase()
        )
        if (brand) setSelectedBrand(brand.CarBrand_ID)
      }
      return
    }

    // Otherwise fetch from API
    setLoadingBrands(true)
    setBrands([])
    setModels([])
    getCarBrands({ manufacturerId: selectedManufacturer })
      .then(res => {
        const fetched = res.data as CarBrand[]
        setBrands(fetched)
        if (prefill?.brandName) {
          const brand = fetched.find(
            b => b.name.toLowerCase() === prefill.brandName!.toLowerCase()
          )
          if (brand) setSelectedBrand(brand.CarBrand_ID)
        }
      })
      .catch(console.error)
      .finally(() => setLoadingBrands(false))
  }, [selectedManufacturer]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch models when brand changes
  useEffect(() => {
    if (!selectedBrand) { setModels([]); return }

    // Check if the brand already has nested models
    const brand = brands.find(b => b.CarBrand_ID === selectedBrand)
    if (brand?.models?.length) {
      setModels(brand.models)
      return
    }

    // Otherwise fetch from API
    setLoadingModels(true)
    setModels([])
    getCarModels({ brandId: selectedBrand })
      .then(res => setModels(res.data as CarModel[]))
      .catch(console.error)
      .finally(() => setLoadingModels(false))
  }, [selectedBrand]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (qtyInvalid) return

    const apiPromise = requestNonInventorySparePartAPI({
      require_image: requireImage ? 1 : 0,
      quantity: qty,
      sparePartDetail: { name, description: desc, carModel_ID: selectedModel },
    })

    toast
      .promise(apiPromise, {
        loading: 'Posting your request...',
        success: 'Request posted!',
        error: 'Failed to post request. Please try again.',
      }, { duration: 3000, position: 'bottom-center' })
      .then(() => {
        setName(''); setQty(1); setDesc(''); setRequireImage(false)
        setSelectedManufacturer(''); setSelectedBrand(''); setSelectedModel('')
        setBrands([]); setModels([])
        navigate('/95668339501103956045/buyer/requests')
      })
      .catch(() => {})
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a Request</h1>
          <p className="text-sm text-gray-500 mt-1">Fill out the form below to request a spare part.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/95668339501103956045/buyer/requests')}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2.5 px-5 rounded-xl hover:bg-gray-50 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          My Requests
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6 space-y-6">
        {/* Vehicle Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Manufacturer</label>
              <select
                value={selectedManufacturer}
                onChange={e => { setSelectedManufacturer(e.target.value); setSelectedBrand(''); setSelectedModel(''); setBrands([]); setModels([]) }}
                required
                className={inputClass}
              >
                <option value="" disabled>Select manufacturer</option>
                {manufacturers.map(m => (
                  <option key={m.Manufacturer_ID} value={m.Manufacturer_ID}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Brand</label>
              <select
                value={selectedBrand}
                onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(''); setModels([]) }}
                required
                disabled={!brands.length && !loadingBrands}
                className={inputClass}
              >
                <option value="" disabled>
                  {loadingBrands ? 'Loading brands...' : brands.length ? 'Select brand' : 'Select manufacturer first'}
                </option>
                {brands.map(b => (
                  <option key={b.CarBrand_ID} value={b.CarBrand_ID}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Model</label>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                required
                disabled={!models.length && !loadingModels}
                className={inputClass}
              >
                <option value="" disabled>
                  {loadingModels ? 'Loading models...' : models.length ? 'Select model' : 'Choose a brand first'}
                </option>
                {models.map(m => (
                  <option key={m.CarModel_ID} value={m.CarModel_ID}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Part Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Part Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Part Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g. Radiator, Brake Pad"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={e => setQty(+e.target.value)}
                min={1}
                required
                aria-invalid={qtyInvalid}
                className={`${inputClass} ${qtyInvalid ? '!border-red-400 !focus:ring-red-300' : ''}`}
              />
              {qtyInvalid && <p className="mt-1 text-xs text-red-500">Quantity must be at least 1</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            placeholder="Describe the part you need, any specific requirements..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Require Image */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={requireImage}
            onChange={e => setRequireImage(e.target.checked)}
            className="w-4.5 h-4.5 rounded border-gray-300 text-blue focus:ring-blue/30"
          />
          <span className="text-sm text-gray-700">Require photos from sellers</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={qtyInvalid}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-3 px-8 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Post Request
        </button>
      </form>
    </div>
  )
}

export default PostRequestForm
