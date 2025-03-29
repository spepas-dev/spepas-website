import { ENV_CONFIG } from './env.config';

const API_VERSION = ENV_CONFIG.API_VERSION || 'v1';
const BASE_PATH = `${ENV_CONFIG.PROXY_BASE_URL}/gateway/${API_VERSION}`;

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_PATH}/auth/login`,
    LOGOUT: `${BASE_PATH}/auth/logout`,
    REFRESH_TOKEN: `${BASE_PATH}/auth/refresh`,
    FORGOT_PASSWORD: `${BASE_PATH}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_PATH}/auth/reset-password`,
    CHANGE_PASSWORD: `${BASE_PATH}/auth/change-password`,
    USER: `${BASE_PATH}/auth/user`
  }
};
