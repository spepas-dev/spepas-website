// src/routes/auth.routes.tsx
import { RouteObject } from 'react-router-dom';

import ActivateAccountPage from '@/pages/auth/activate';
import ChangePasswordPage from '@/pages/auth/change-password';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import ResetPasswordPage from '@/pages/auth/reset-password';
// Import your authentication page components:
import SignInPage from '@/pages/auth/signin';
import SignUpPage from '@/pages/auth/signup';


export const authRoutes: RouteObject[] = [
  { index: true, element: <SignInPage /> },
  { path: 'signin', element: <SignInPage /> },
  { path: 'signup', element: <SignUpPage /> },
  { path: 'activate', element: <ActivateAccountPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  { path: 'reset-password', element: <ResetPasswordPage /> },
  { path: 'change-password', element: <ChangePasswordPage /> },

];
