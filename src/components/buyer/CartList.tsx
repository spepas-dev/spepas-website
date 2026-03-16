// src/components/buyer/CartList.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getItemsInCartAll, removeBidFromCartAPI, getUserChargesAPI } from '@/lib/orderBidsApis'
import CartItem from './CartItem'
import Lottie from 'lottie-react'
import emptyCartAnimation from '@/assets/lottie/empty-cart.json'
import SpepasLoader from '@/components/common/SpepasLoader'

const CartList: React.FC = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
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

  const handleCheckout = () => {
    toast(
      (t) => (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Aggregate cart items?</p>
              <p className="text-xs text-gray-500 mt-0.5">Combine items for a single delivery</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              onClick={async () => { toast.dismiss(t.id); await confirmAggregate('0') }}
            >
              No
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue to-blue-500 rounded-xl hover:opacity-90 transition"
              onClick={async () => { toast.dismiss(t.id); await confirmAggregate('1') }}
            >
              Yes, Aggregate
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: { marginTop: '4rem', zIndex: 10000, padding: '1rem', borderRadius: '1rem' },
      }
    )
  }

  const confirmAggregate = async (agg: '1' | '0') => {
    setCheckingOut(true)
    try {
      const charges = await getUserChargesAPI({ aggeagate: agg })
      navigate('/95668339501103956045/buyer/checkout', { state: { charges, aggeagate: agg } })
    } catch {
      toast.error('Failed to fetch charges.')
    } finally {
      setCheckingOut(false)
    }
  }

  const total = items.reduce((sum, i) => sum + (i.bid.totalPrice || 0), 0)

  if (loading) return <SpepasLoader size="lg" label="Loading cart..." />

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center space-y-4">
        <Lottie
          animationData={emptyCartAnimation}
          loop
          autoplay
          className="w-48 h-48 sm:w-56 sm:h-56"
        />
        <div className="space-y-1">
          <p className="text-base font-semibold text-gray-900">Your cart is empty</p>
          <p className="text-sm text-gray-500">Browse parts and add them to your cart.</p>
        </div>
        <button
          onClick={() => navigate('/95668339501103956045/Shop')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-6 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
          </svg>
          Browse Shop
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {items.map(i => (
          <CartItem key={i.cart_ID} item={i} onRemove={handleRemove} />
        ))}
      </div>

      {/* Summary & Checkout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-500">Total ({items.length} {items.length === 1 ? 'item' : 'items'}):</span>
            <span className="text-2xl font-bold text-gray-900">GH₵ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-3 px-8 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
          >
            {checkingOut ? (
              <SpepasLoader size="sm" className="inline-flex" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            )}
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartList
