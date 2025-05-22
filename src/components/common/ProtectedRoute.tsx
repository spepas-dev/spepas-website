// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // if not logged in, send to sign-in
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }
  // otherwise render the matched child routes
  return <Outlet />;
};

export default ProtectedRoute;
