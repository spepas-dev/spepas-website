//src/main.tsx
import './index.css';

import { init } from '@elastic/apm-rum';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { Toaster } from 'react-hot-toast';
import { createRoot } from 'react-dom/client';

import { AuthProvider } from '@/features/auth';
// local imports
import { queryClient } from '@/lib';

import App from './App.tsx';

init({
  serviceName: 'Spepas Web App',
  serverUrl: import.meta.env.VITE_ELASTIC_APM_SERVER,
  serviceVersion: '0.0.1',
  active: true
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
