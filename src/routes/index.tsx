// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';

import AltHomeLayout from '@/components/layout/alt-home/AltHomeLayout';
import { AuthLayout } from '@/components/layout/auth/AuthLayout';
import { MarketingLayout } from '@/components/layout/marketing';
import ErrorPage from '@/pages/ErrorPage';
import NotFound from '@/pages/NotFound';

import { altHomeRoutes } from './altHome.routes';
import { authRoutes } from './auth.routes';
import { buyerRoutes } from './buyer.routes';
import { gopaRoutes } from './gopa.routes';
import { gopaInvoiceRoutes } from './gopaInvoices.routes';
import { profilingRoutes } from './profiling.routes';
import { sellerRoutes } from './seller.routes';
import { websiteRoutes } from './website.routes';

export const routes = [
  {
    path: '/',
    element: <AltHomeLayout />,
    errorElement: <ErrorPage />,
    children: altHomeRoutes
  },
  {
    path: '/notlandingpages/',
    element: <MarketingLayout />,
    errorElement: <ErrorPage />,
    children: [...websiteRoutes, ...profilingRoutes, ...buyerRoutes, ...sellerRoutes, ...gopaRoutes, ...gopaInvoiceRoutes]
  },
  {
    path: '/notlandingpages/auth/',
    element: <AuthLayout />, // Auth pages now use AuthLayout
    errorElement: <ErrorPage />,
    children: authRoutes
  },
  {
    path: '/*',
    element: <NotFound />
  }
];

export const router = createBrowserRouter(routes);
