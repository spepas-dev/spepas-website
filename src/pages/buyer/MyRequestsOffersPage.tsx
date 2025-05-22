import React from 'react'
import RequestsWithOffersList from '@/components/buyer/RequestsWithOffersList'

export default function MyRequestsOffersPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl pt-20">
      <h1 className="text-2xl font-bold mb-4">My Requests & Offers</h1>
      <RequestsWithOffersList />
    </div>
  )
}
