// src/routes/seller.routes.tsx
import { RouteObject } from 'react-router-dom';
import ActiveBidsPage from '@/pages/seller/ActiveBidsPage';
import BidHistoryPage from '@/pages/seller/BidHistoryPage';
import RequestDetailPage from '@/pages/seller/RequestDetailPage';
import SellerInvoicesPage from '@/pages/seller/InvoicesPage';
import SellerWalletPage from '@/pages/seller/WalletPage';

export const sellerRoutes: RouteObject[] = [
  {
    path: 'seller/:sellerId/bids',
    element: <ActiveBidsPage />,
  },
  {
    path: 'seller/:sellerId/bids/history',
    element: <BidHistoryPage />,
  },
  {
    path: 'seller/request/:requestId',
    element: <RequestDetailPage />,
  },
  {
    path: 'seller/:sellerId/invoices',
    element: <SellerInvoicesPage />,
  },
  {
    path: 'seller/wallet',
    element: <SellerWalletPage />,
  },
];
