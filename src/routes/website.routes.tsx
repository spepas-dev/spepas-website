import { RouteObject } from 'react-router-dom';

import FAQPage from '@/pages/marketing//faq-page/page';
import ContactPage from '@/pages/marketing/contact/page';
import HomePage from '@/pages/marketing/home';
import PrivacyPolicyPage from '@/pages/marketing/privacy-policy/page';
import RefundPolicyPage from '@/pages/marketing/refund-policy/page';
import TermsOfUsePage from '@/pages/marketing/terms/page';

export const websiteRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />
  },
  {
    path: 'privacy-policy',
    element: <PrivacyPolicyPage />
  },
  { path: 'refund-policy', element: <RefundPolicyPage /> },
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
  }
];
