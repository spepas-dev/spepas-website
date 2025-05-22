// // src/lib/axios.ts

// with token refresh
// import axios from 'axios';
// import { refreshTokenAPI } from './auth';

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const storedAuth = localStorage.getItem('authData');
//     if (storedAuth) {
//       try {
//         const authData = JSON.parse(storedAuth);
//         if (authData?.token) {
//           config.headers = config.headers || {};
//           config.headers['Authorization'] = `Bearer ${authData.token}`;
//         }
//       } catch (error) {
//         console.error('Error parsing authData from localStorage:', error);
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {

//         const data = await refreshTokenAPI();

//         const storedAuth = localStorage.getItem('authData');
//         let authData = storedAuth ? JSON.parse(storedAuth) : {};
//         authData.token = data.newAccessToken;
//         authData.refresh_token = data.newRefreshToken;
//         localStorage.setItem('authData', JSON.stringify(authData));

//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.newAccessToken}`;

//         originalRequest.headers['Authorization'] = `Bearer ${data.newAccessToken}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {

//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

//without token refresh
// src/lib/axios.ts
import axios from 'axios';

const isDev = import.meta.env.DEV;
const proxyBase = import.meta.env.VITE_PROXY_BASE_URL; // “api”
const liveBase = import.meta.env.VITE_API_URL; // “https://api…/gateway/v1”

const baseURL = isDev
  ? `/${proxyBase}` // → “/api”
  : liveBase; // → remote gateway

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// ensure no Authorization header ever sneaks in
delete apiClient.defaults.headers.common['Authorization'];

export default apiClient;
