// src/features/auth/SessionGuard.tsx
import { useEffect } from 'react';
import apiClient from '@/lib/axios';
import { getGlobalSetAuthData } from '@/features/auth';

export default function SessionGuard() {
  useEffect(() => {
    let stopped = false;

    const handle401 = () => {
      try {
        localStorage.removeItem('authData');
        getGlobalSetAuthData()?.({ user: null });
      } catch {}
      // optional redirect:
      // if (window.location.pathname !== '/login') window.location.assign('/login');
    };

    const check = async () => {
      try {
        await apiClient.get('/auth/me'); // should return 200 when session is valid
      } catch (e: any) {
        if (!stopped && e?.response?.status === 401) {
          handle401();
        }
      }
    };

    const onVis = () => {
      if (document.visibilityState === 'visible') check();
    };

    check(); // on mount
    const id = setInterval(check, 5 * 60 * 1000); // every 5 minutes
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stopped = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return null;
}
