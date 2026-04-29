// src/components/layout/protected/ProtectedLayout.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';

const SIGNIN_PATH = '/95668339501103956045/auth/signin';

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to={SIGNIN_PATH} replace />;

  return (
    <div className="min-h-screen">
      <Outlet />
      {/* <ChatWidget position="bottom-right" /> */}
    </div>
  );
}
