// src/lib/axios.ts
import axios from 'axios';
import { clearAuthEverywhere } from './sessionBridge'; // *adjusted*

const isDev = import.meta.env.DEV;
const proxyBase = import.meta.env.VITE_PROXY_BASE_URL; // “api”
const liveBase = import.meta.env.VITE_API_URL; // “https://api…/gateway/v1”

const baseURL = isDev
  ? `/${proxyBase}` // → “/api”
  : liveBase; // → remote gateway

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// ensure no Authorization header ever sneaks in
delete apiClient.defaults.headers.common['Authorization'];

// ---- Global 401 handler (no refresh attempt) ----
const PROTECTED_ROOT = '/95668339501103956045';            // *adjusted*
const AUTH_PREFIX    = '/95668339501103956045/auth/';       // *adjusted*
const SIGNIN_PATH    = '/95668339501103956045/auth/signin'; // *adjusted*

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {                                  // *adjusted*
      clearAuthEverywhere();                               // *adjusted*

      // Optional redirect: only if user is inside the protected marketing area
      // and not already on an auth page.
      try {                                               // *adjusted*
        const path = window.location.pathname;            // *adjusted*
        const inProtected = path.startsWith(PROTECTED_ROOT);
        const inAuth = path.startsWith(AUTH_PREFIX);
        if (inProtected && !inAuth) {
          window.location.replace(SIGNIN_PATH);           // *adjusted*
        }
      } catch {}                                          // *adjusted*
    }
    return Promise.reject(error);
  }
); // *adjusted*

export default apiClient;
