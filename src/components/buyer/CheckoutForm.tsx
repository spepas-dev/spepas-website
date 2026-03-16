// src/components/buyer/CheckoutForm.tsx
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  checkoutWithExistingAddressAPI,
  checkoutWithNewAddressAPI
} from '@/lib/orderBidsApis'
import toast from 'react-hot-toast'
import SpepasLoader from '@/components/common/SpepasLoader'

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition bg-white'

const CheckoutForm: React.FC = () => {
  const location = useLocation() as any
  const navigate = useNavigate()
  const { charges, aggeagate } = location.state || {}
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<'existing' | 'new'>('existing')

  // New address form state
  const [title, setTitle] = useState('')
  const [addressDetails, setAddressDetails] = useState('')

  if (!charges) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No charge data available. Please go back to your cart.</p>
        <button
          onClick={() => navigate('/95668339501103956045/buyer/cart')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          Back to Cart
        </button>
      </div>
    )
  }

  const handleExisting = async () => {
    setSubmitting(true)
    try {
      const address_id = 'ADDRESS_ID_HERE' // TODO: let user pick from saved addresses
      await checkoutWithExistingAddressAPI({
        address_id,
        aggeagate: Number(aggeagate),
        paymentDetails: {
          paymentMode: 'WALLET',
          walletNumber: '233554340244',
          network: 'MTN'
        }
      })
      toast.success('Order placed successfully!', { position: 'bottom-center' })
    } catch {
      toast.error('Checkout failed. Please try again.', { position: 'bottom-center' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleNew = async () => {
    setSubmitting(true)
    try {
      const address = {
        title: title || 'My Address',
        addressDetails: addressDetails || 'Address details',
        longitude: -73.9712,
        latitude: 40.7831
      }
      await checkoutWithNewAddressAPI({
        address,
        aggeagate: Number(aggeagate),
        paymentDetails: {
          paymentMode: 'WALLET',
          walletNumber: '233554340244',
          network: 'MTN'
        }
      })
      toast.success('Order placed successfully!', { position: 'bottom-center' })
    } catch {
      toast.error('Checkout failed. Please try again.', { position: 'bottom-center' })
    } finally {
      setSubmitting(false)
    }
  }

  const chargeRows = [
    { label: 'Items Total', value: `GH₵ ${charges.MAIN_AMOUNT}` },
    { label: 'Service Charge', value: `GH₵ ${charges.SERVICE_CHARGE}` },
    { label: 'Delivery Fee', value: `GH₵ ${charges.DELIVERY_CHARGE}` },
    { label: 'Tax', value: `${charges.TAX}%` },
  ]

  const grandTotal =
    (Number(charges.MAIN_AMOUNT) || 0) +
    (Number(charges.SERVICE_CHARGE) || 0) +
    (Number(charges.DELIVERY_CHARGE) || 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Address Selection */}
      <div className="lg:col-span-2 space-y-6">
        {/* Address mode tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Delivery Address</h2>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setMode('existing')}
              className={`text-sm font-medium px-5 py-2 rounded-lg transition-all duration-150 ${
                mode === 'existing'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Saved Address
            </button>
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`text-sm font-medium px-5 py-2 rounded-lg transition-all duration-150 ${
                mode === 'new'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New Address
            </button>
          </div>

          {mode === 'existing' ? (
            <div className="space-y-3">
              <div className="border border-blue/20 bg-blue/5 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Default Address</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your saved delivery address will be used</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">Address selection coming soon. Your default address will be used.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Address Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Home, Office"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Address Details</label>
                <textarea
                  value={addressDetails}
                  onChange={e => setAddressDetails(e.target.value)}
                  rows={3}
                  placeholder="Street, building, landmarks..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Payment Method</h2>
          <div className="border border-blue/20 bg-blue/5 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Mobile Wallet (MTN)</p>
              <p className="text-xs text-gray-500 mt-0.5">Payment will be processed via mobile money</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Order Summary</h2>

          <div className="space-y-3">
            {chargeRows.map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{row.label}</span>
                <span className="font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Items</span>
              <span className="font-medium text-gray-900">{charges.TOTAL_ITEMS}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Grand Total</span>
              <span className="text-xl font-bold text-gray-900">GH₵ {grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={mode === 'existing' ? handleExisting : handleNew}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
          >
            {submitting ? (
              <SpepasLoader size="sm" className="inline-flex" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Place Order
          </button>

          <button
            onClick={() => navigate('/95668339501103956045/buyer/cart')}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
