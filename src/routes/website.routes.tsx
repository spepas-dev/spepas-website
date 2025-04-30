// src/routes/website.routes.tsx
import { RouteObject } from 'react-router-dom';

import FAQPage from '@/pages/marketing/faq-page/page';
import ContactPage from '@/pages/marketing/contact/page';
import HomePage from '@/pages/marketing/home';
import PrivacyPolicyPage from '@/pages/marketing/privacy-policy/page';
import RefundPolicyPage from '@/pages/marketing/refund-policy/page';
import TermsOfUsePage from '@/pages/marketing/terms/page';

// 👇 import your new MyAccount page
import MyAccountPage from '@/pages/marketing/my-account/page';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export const websiteRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />
  },
  {
    path: 'privacy-policy',
    element: <PrivacyPolicyPage />
  },
  {
    path: 'refund-policy',
    element: <RefundPolicyPage />
  },
  {
    path: 'terms',
    element: <TermsOfUsePage />
  },
  {
    path: 'faqs',
    element: <FAQPage />
  },
  {
    path: 'contact',
    element: <ContactPage />
  },
  {
    path: 'my-account',
    element: <MyAccountPage />
  }
];
