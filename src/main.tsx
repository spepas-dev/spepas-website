import { init } from '@elastic/apm-rum';
init({
  serviceName: 'Spepas Web App',
  serverUrl: import.meta.env.VITE_ELASTIC_APM_SERVER,
  serviceVersion: '0.0.1',
  active: true,
  breakdownMetrics: true,
  distributedTracingOrigins: ['*']
});

//src/main.tsx
import './index.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/features/auth';
// local imports
import { queryClient } from '@/lib';

import App from './App.tsx';

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
