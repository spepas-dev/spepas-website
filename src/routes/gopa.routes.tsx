// src/routes/gopa.routes.tsx
import { RouteObject } from 'react-router-dom';
import AssignedActiveRequestsPage from '@/pages/gopa/AssignedActiveRequestsPage';
import AssignedHistoryPage from '@/pages/gopa/AssignedHistoryPage';
import UnassignedActiveRequestsPage from '@/pages/gopa/UnassignedActiveRequestsPage';
import UnassignedHistoryPage from '@/pages/gopa/UnassignedHistoryPage';
import RequestSellersPage from '@/pages/gopa/RequestSellersPage';
import GopaWalletPage from '@/pages/gopa/WalletPage';

export const gopaRoutes: RouteObject[] = [
  // Wallet + withdrawal (no gopaId param — uses the authenticated user)
  {
    path: 'gopa/wallet',
    element: <GopaWalletPage />,
  },
  {
    path: 'gopa/:gopaId/assigned/active',
    element: <AssignedActiveRequestsPage />,
  },
  {
    path: 'gopa/:gopaId/assigned/history',
    element: <AssignedHistoryPage />,
  },
  {
    path: 'gopa/:gopaId/unassigned/active',
    element: <UnassignedActiveRequestsPage />,
  },
  {
    path: 'gopa/:gopaId/unassigned/history',
    element: <UnassignedHistoryPage />,
  },
  {
    path: 'gopa/:gopaId/requests/:requestId/sellers',
    element: <RequestSellersPage />,
  },
];
