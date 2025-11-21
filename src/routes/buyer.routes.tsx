import { RouteObject } from 'react-router-dom';

import CartPage from '@/pages/buyer/CartPage';
import CheckoutPage from '@/pages/buyer/CheckoutPage';
import PostRequestPage from '@/pages/buyer/PostRequestPage';
import MyRequestsPage from '@/pages/buyer/MyRequestsPage';
import MyRequestsOffersPage from '@/pages/buyer/MyRequestsOffersPage';
import OffersPage from '@/pages/buyer/OffersPage';

// NEW
import OfferBidDetailPage from '@/pages/buyer/OfferBidDetailPage';

export const buyerRoutes: RouteObject[] = [
  { path: 'buyer/cart', element: <CartPage /> },
  { path: 'buyer/checkout', element: <CheckoutPage /> },
  { path: 'buyer/post-request', element: <PostRequestPage /> },
  { path: 'buyer/requests', element: <MyRequestsPage /> },
  { path: 'buyer/requests/offers-all', element: <MyRequestsOffersPage /> },
  { path: 'buyer/requests/:requestId/offers', element: <OffersPage /> },

  // NEW: detail by unique bidding ID
  { path: 'buyer/requests/offers/:biddingId', element: <OfferBidDetailPage /> },
];
