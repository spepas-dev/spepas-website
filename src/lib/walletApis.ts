// src/lib/walletApis.ts
import apiClient from './axios';
// import { walletDetailsResponseSchema } from './walletZodValidation';

// GET: Get User's Wallet Details
export const getMyWalletDetails = async () => {
  const { data } = await apiClient.get('/wallet/get-my-wallet-details');
  return data;
};
