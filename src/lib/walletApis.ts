// src/lib/walletApis.ts
import apiClient from './axios';

// GET: Get User's Wallet Details
export const getMyWalletDetails = async () => {
  const { data } = await apiClient.get('/wallet/get-my-wallet-details');
  return data;
};

// POST: Request a withdrawal of the authenticated user's full available
// balance to the phone number on file (treated as MoMo). Phase 1 ledger only —
// admin marks the request complete or failed out-of-band once funds are sent.
export const requestWalletWithdrawal = async () => {
  const { data } = await apiClient.post('/wallet/request-withdrawal', {});
  return data;
};
