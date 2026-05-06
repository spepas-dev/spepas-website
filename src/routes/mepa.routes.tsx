// src/routes/mepa.routes.tsx
import { RouteObject } from 'react-router-dom';

import MepaWalletPage from '@/pages/mepa/WalletPage';

export const mepaRoutes: RouteObject[] = [
  // Wallet + withdrawal — uses the authenticated user, no :mepaId param.
  { path: 'mepa/wallet', element: <MepaWalletPage /> },
];
