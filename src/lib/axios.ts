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
  withCredentials: true,
});

// ensure no Authorization header ever sneaks in
delete apiClient.defaults.headers.common['Authorization'];

// ---- Global 401 handler (no refresh attempt) ----
const SIGNIN_PATH = '/95668339501103956045/auth/signin'; // *adjusted*

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // clear local auth state everywhere (context + localStorage)
      clearAuthEverywhere();

      // always push user to signin when unauthenticated
      try {
        const path = window.location.pathname;
        if (path !== SIGNIN_PATH) {
          window.location.replace(SIGNIN_PATH);
        }
      } catch {
        // ignore any window errors (SSR etc.)
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
