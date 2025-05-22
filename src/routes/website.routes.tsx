// src/routes/website.routes.tsx
import { RouteObject } from 'react-router-dom';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import ContactPage from '@/pages/marketing/contact/page';
import FAQPage from '@/pages/marketing/faq-page/page';
import HomePage from '@/pages/marketing/home';
import MyAccountPage from '@/pages/marketing/my-account/page';
import PrivacyPolicyPage from '@/pages/marketing/privacy-policy/page';
import RefundPolicyPage from '@/pages/marketing/refund-policy/page';
import ShopDetailsPage from '@/pages/marketing/shop-details/page';
import ShopWithoutSidebarPage from '@/pages/marketing/shop-without-sidebar/page';
import TermsOfUsePage from '@/pages/marketing/terms/page';

export const websiteRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
  { path: 'refund-policy', element: <RefundPolicyPage /> },
  { path: 'terms', element: <TermsOfUsePage /> },
  { path: 'faqs', element: <FAQPage /> },
  { path: 'contact', element: <ContactPage /> },
  { path: 'shop', element: <ShopWithoutSidebarPage /> },
  { path: 'shop/:id', element: <ShopDetailsPage /> },

  // ← This chunk is now protected:
  {
    path: 'my-account',
    element: <ProtectedRoute />, // checks auth, otherwise Navigate
    children: [{ index: true, element: <MyAccountPage /> }]
  }
];
