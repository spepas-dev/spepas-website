import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';

const SIGNIN_PATH = '/95668339501103956045/auth/signin'; // *adjusted*

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth(); // *adjusted*

  // No network probe here — rely on client auth state.
  // If the backend session later expires, your next API call will 401 and you can
  // handle that centrally (e.g., with a simple interceptor or per-request handling).
  if (!isAuthenticated) return <Navigate to={SIGNIN_PATH} replace />; // *adjusted*

  return <Outlet />;
}
