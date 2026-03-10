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
const BASE_PATH = '/95668339501103956045';

// Public paths that should NOT redirect to sign-in on 401
const PUBLIC_SUFFIXES = [
  '/home',
  '/shop',
  '/about-us',
  '/contact',
  '/faqs',
  '/privacy-policy',
  '/refund-policy',
  '/terms',
  '/auth/',
];

function isPublicPage(): boolean {
  try {
    const path = window.location.pathname;
    return PUBLIC_SUFFIXES.some(
      (suffix) =>
        path === `${BASE_PATH}${suffix}` ||
        path.startsWith(`${BASE_PATH}${suffix}/`),
    );
  } catch {
    return false;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // clear local auth state everywhere (context + localStorage)
      clearAuthEverywhere();

      // only redirect to signin from protected pages, not public ones
      try {
        const path = window.location.pathname;
        if (path !== SIGNIN_PATH && !isPublicPage()) {
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
