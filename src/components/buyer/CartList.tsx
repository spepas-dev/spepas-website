// src/components/buyer/CartList.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getItemsInCartAll, removeBidFromCartAPI, getUserChargesAPI } from '@/lib/orderBidsApis'
import CartItem from './CartItem'
import Lottie from 'lottie-react'
import loadingAnimation from '@/assets/lottie/loading-cart.json'
import emptyCartAnimation from '@/assets/lottie/empty-cart.json'

const CartList: React.FC = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getItemsInCartAll()
      .then(res => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = (cartId: string) => {
    removeBidFromCartAPI({ cart_ID: cartId })
      .then(() => setItems(prev => prev.filter(i => i.cart_ID !== cartId)))
      .catch(console.error)
  }

  // 1) Prompt via toast, 2) call getUserCharges, 3) navigate to /buyer/checkout
  const handleCheckout = () => {
    toast(
      (t) => (
        <div className="p-4 bg-white rounded shadow-lg">
          <p className="mb-2 font-medium">Aggregate cart items?</p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={async () => {
                toast.dismiss(t.id)
                await confirmAggregate('1')
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={async () => {
                toast.dismiss(t.id)
                await confirmAggregate('0')
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        // ensure toast appears below header and above everything else
        style: {
          marginTop: '4rem', 
          zIndex: 10000,
        },
      }
    )
  }

  const confirmAggregate = async (agg: '1' | '0') => {
    setLoading(true)
    try {
      const charges = await getUserChargesAPI({ aggeagate: agg })
      // navigate to the buyer-specific checkout route
      navigate('/buyer/checkout', { state: { charges, aggeagate: agg } })
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch charges.')
    } finally {
      setLoading(false)
    }
  }

  const total = items.reduce((sum, i) => sum + (i.bid.totalPrice || 0), 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          className="w-24 h-24 sm:w-32 sm:h-32"
        />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <Lottie
          animationData={emptyCartAnimation}
          loop
          autoplay
          className="w-48 h-48 sm:w-64 sm:h-64"
        />
        <p className="text-gray-600 text-base sm:text-lg">Your cart is empty.</p>
        <button
          onClick={() => navigate('/Shop')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-6 py-2 rounded-full shadow transition"
        >
          Go to Shop
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <ul className="space-y-6">
        {items.map(i => (
          <CartItem key={i.cart_ID} item={i} onRemove={handleRemove} />
        ))}
      </ul>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t pt-4">
        <span className="font-bold text-lg sm:text-xl">
          Total: GH₵ {total.toFixed(2)}
        </span>
        <button
          onClick={handleCheckout}
          className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-6 py-2 rounded transition"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}

export default CartList
