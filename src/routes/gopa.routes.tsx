// src/routes/gopa.routes.tsx
import { RouteObject } from 'react-router-dom';

import AssignedActiveRequestsPage from '@/pages/gopa/AssignedActiveRequestsPage';
import AssignedHistoryPage from '@/pages/gopa/AssignedHistoryPage';
import RequestSellersPage from '@/pages/gopa/RequestSellersPage';
import UnassignedActiveRequestsPage from '@/pages/gopa/UnassignedActiveRequestsPage';
import UnassignedHistoryPage from '@/pages/gopa/UnassignedHistoryPage';

export const gopaRoutes: RouteObject[] = [
  {
    path: 'gopa/:gopaId/assigned/active',
    element: <AssignedActiveRequestsPage />
  },
  {
    path: 'gopa/:gopaId/assigned/history',
    element: <AssignedHistoryPage />
  },
  {
    path: 'gopa/:gopaId/unassigned/active',
    element: <UnassignedActiveRequestsPage />
  },
  {
    path: 'gopa/:gopaId/unassigned/history',
    element: <UnassignedHistoryPage />
  },
  {
    path: 'gopa/:gopaId/requests/:requestId/sellers',
    element: <RequestSellersPage />
  }
];
