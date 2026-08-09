import { RouteObject } from 'react-router-dom';

import CartPage from '@/pages/buyer/CartPage';
import CheckoutPage from '@/pages/buyer/CheckoutPage';
import PostRequestPage from '@/pages/buyer/PostRequestPage';
import MyRequestsPage from '@/pages/buyer/MyRequestsPage';
import MyRequestsOffersPage from '@/pages/buyer/MyRequestsOffersPage';
import OffersPage from '@/pages/buyer/OffersPage';

// NEW
import OfferBidDetailPage from '@/pages/buyer/OfferBidDetailPage';
import BuyerInvoicesPage from '@/pages/buyer/InvoicesPage';
import PaymentProcessingPage from '@/pages/buyer/PaymentProcessingPage';

export const buyerRoutes: RouteObject[] = [
  { path: 'buyer/cart', element: <CartPage /> },
  { path: 'buyer/checkout', element: <CheckoutPage /> },

  // Waiting room while the buyer approves the mobile-money push prompt.
  { path: 'buyer/payment/processing/:invoiceId', element: <PaymentProcessingPage /> },
  { path: 'buyer/post-request', element: <PostRequestPage /> },
  { path: 'buyer/requests', element: <MyRequestsPage /> },
  { path: 'buyer/requests/offers-all', element: <MyRequestsOffersPage /> },
  { path: 'buyer/requests/:requestId/offers', element: <OffersPage /> },

  // NEW: detail by unique bidding ID
  { path: 'buyer/requests/offers/:biddingId', element: <OfferBidDetailPage /> },

  // Invoices
  { path: 'buyer/invoices', element: <BuyerInvoicesPage /> },
];
