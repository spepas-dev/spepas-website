// src/components/buyer/CheckoutForm.tsx
import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  checkoutWithExistingAddressAPI,
  checkoutWithNewAddressAPI
} from '@/lib/orderBidsApis'
import toast from 'react-hot-toast'

const CheckoutForm: React.FC = () => {
  const location = useLocation() as any
  const { charges, aggeagate } = location.state || {}

  if (!charges) {
    return <p className="text-center py-10">No charge data available.</p>
  }

  const handleExisting = async () => {
    try {
      // TODO: let user pick address_id from their saved addresses
      const address_id = 'ADDRESS_ID_HERE'
      await checkoutWithExistingAddressAPI({
        address_id,
        aggeagate: Number(aggeagate),
        paymentDetails: {
          paymentMode: 'WALLET',
          walletNumber: '233554340244',
          network: 'MTN'
        }
      })
      toast.success('Checkout with existing address successful.')
    } catch {
      toast.error('Checkout failed.')
    }
  }

  const handleNew = async () => {
    try {
      // TODO: gather these from a sub-form
      const address = {
        title: 'Office address',
        addressDetails: 'S 74/8, adjacent to Palace mall',
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
      toast.success('Checkout with new address successful.')
    } catch {
      toast.error('Checkout failed.')
    }
  }

  return (
    <div className="space-y-6">
      <ul className="bg-white p-4 rounded shadow space-y-2">
        <li>Main Amount: GH₵ {charges.MAIN_AMOUNT}</li>
        <li>Service Charge: GH₵ {charges.SERVICE_CHARGE}</li>
        <li>Delivery Charge: GH₵ {charges.DELIVERY_CHARGE}</li>
        <li>Tax: % {charges.TAX}</li>
        <li>Total Items: {charges.TOTAL_ITEMS}</li>
      </ul>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExisting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Checkout with Existing Address
        </button>
        <button
          onClick={handleNew}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Checkout with New Address
        </button>
      </div>
    </div>
  )
}

export default CheckoutForm
