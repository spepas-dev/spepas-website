// src/routes/profiling.routes.tsx
import { RouteObject } from 'react-router-dom';

import AddIdentificationPage from '@/pages/profiling/AddIdentificationPage';
import AddPaymentAccountPage from '@/pages/profiling/AddPaymentAccountPage';
import GopaRegistrationPage from '@/pages/profiling/GopaRegistrationPage';
import MepaRegistrationPage from '@/pages/profiling/MepaRegistrationPage';
import RegistrationSelectionPage from '@/pages/profiling/RegistrationSelectionPage';
import RiderRegistrationPage from '@/pages/profiling/RiderRegistrationPage';
import SellerRegistrationPage from '@/pages/profiling/SellerRegistrationPage';

export const profilingRoutes: RouteObject[] = [
  { index: false, element: <AddIdentificationPage /> },
  { path: 'add-identification', element: <AddIdentificationPage /> },
  { path: 'registration-selection', element: <RegistrationSelectionPage /> },
  { path: 'gopa-registration', element: <GopaRegistrationPage /> },
  { path: 'seller-registration', element: <SellerRegistrationPage /> },
  { path: 'mepa-registration', element: <MepaRegistrationPage /> },
  { path: 'rider-registration', element: <RiderRegistrationPage /> },
  { path: 'add-payment-account', element: <AddPaymentAccountPage /> }
];
