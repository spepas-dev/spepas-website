// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';

import AltHomeLayout     from '@/components/layout/alt-home/AltHomeLayout'
import { MarketingLayout } from '@/components/layout/marketing';
import { AuthLayout } from '@/components/layout/auth/AuthLayout';
import ErrorPage from '@/pages/ErrorPage';
import NotFound from '@/pages/NotFound';

import { websiteRoutes } from './website.routes';
import { authRoutes } from './auth.routes';
import { altHomeRoutes     } from './altHome.routes'
import { profilingRoutes } from './profiling.routes';
import { sellerRoutes } from './seller.routes';
import { buyerRoutes } from './buyer.routes';
import { gopaRoutes }   from './gopa.routes';  
import { gopaInvoiceRoutes } from './gopaInvoices.routes';

export const routes = [
  {
    path: '/',
    element: <AltHomeLayout />,
    errorElement: <ErrorPage />,
    children: altHomeRoutes,
  },
  {
    path: '/95668339501103956045',
    element: <MarketingLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...websiteRoutes,
      ...profilingRoutes,
      ...buyerRoutes,
      ...sellerRoutes,
      ...gopaRoutes,
      ...gopaInvoiceRoutes, 
    ],

  },
  {
    path: '/95668339501103956045/auth/',
    element: <AuthLayout />, 
    errorElement: <ErrorPage />,
    children: authRoutes,
  },
  {
    path: '/*',
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
