// src/routes/website.routes.tsx
import { RouteObject } from 'react-router-dom';

import FAQPage from '@/pages/marketing/faq-page/page';
import ContactPage from '@/pages/marketing/contact/page';
import HomePage from '@/pages/marketing/home';
import PrivacyPolicyPage from '@/pages/marketing/privacy-policy/page';
import RefundPolicyPage from '@/pages/marketing/refund-policy/page';
import TermsOfUsePage from '@/pages/marketing/terms/page';
import ShopWithoutSidebarPage from '@/pages/marketing/shop-without-sidebar/page';
import ShopDetailsPage from '@/pages/marketing/shop-details/page';
import AboutUsPage from '@/pages/marketing/about-us/page';
// import AltHomePage from '@/pages/marketing/home/alt-home/page';

import MyAccountPage from '@/pages/marketing/my-account/page';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export const websiteRoutes: RouteObject[] = [
  { path: 'home', element: <HomePage /> },
  { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
  { path: 'refund-policy',   element: <RefundPolicyPage /> },
  { path: 'terms',           element: <TermsOfUsePage /> },
  { path: 'faqs',            element: <FAQPage /> },
  { path: 'contact',         element: <ContactPage /> },
  { path: 'shop',            element: <ShopWithoutSidebarPage /> },
  { path: 'shop/:id',        element: <ShopDetailsPage /> },
  { path: 'about-us',        element: <AboutUsPage /> },


  
  {
    path: 'my-account',
    element: <ProtectedRoute />,       
    children: [
      { index: true, element: <MyAccountPage /> }
    ]
  }
];
