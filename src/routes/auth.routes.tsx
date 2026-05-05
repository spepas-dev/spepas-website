// src/routes/auth.routes.tsx
import { RouteObject } from 'react-router-dom';

// Import your authentication page components:
import SignInPage from '@/pages/auth/signin';
import SignUpPage from '@/pages/auth/signup';
import ActivateAccountPage from '@/pages/auth/activate';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import ResetPasswordPage from '@/pages/auth/reset-password';
import ChangePasswordPage from '@/pages/auth/change-password';
import ProfileSwitchOtpPage from '@/pages/auth/profile-switch-otp';
import SetupPinPage from '@/pages/auth/setup-pin';
import ManagePinPage from '@/pages/auth/manage-pin';
import SetupPasswordPage from '@/pages/auth/setup-password';
import SetupAddressPage from '@/pages/auth/setup-address';

export const authRoutes: RouteObject[] = [
  { index: true, element: <SignInPage /> },
  { path: 'signin', element: <SignInPage /> },
  { path: 'signup', element: <SignUpPage /> },
  { path: 'activate', element: <ActivateAccountPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  { path: 'reset-password', element: <ResetPasswordPage /> },
  { path: 'change-password', element: <ChangePasswordPage /> },
  { path: 'profile-switch-otp', element: <ProfileSwitchOtpPage /> },
  { path: 'setup-pin', element: <SetupPinPage /> },
  { path: 'manage-pin', element: <ManagePinPage /> },
  { path: 'setup-password', element: <SetupPasswordPage /> },
  { path: 'setup-address', element: <SetupAddressPage /> },
];
