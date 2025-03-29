import { createBrowserRouter } from 'react-router-dom';

import { MarketingLayout } from '@/components/layout/marketing';
import ErrorPage from '@/pages/ErrorPage';
import NotFound from '@/pages/NotFound';

import { websiteRoutes } from './website.routes';

export const routes = [
  {
    path: '/',
    element: <MarketingLayout />,
    ErrorPage: <ErrorPage />,
    children: websiteRoutes
  },

  {
    path: '/*',
    element: <NotFound />
  }
];

export const router = createBrowserRouter(routes);
