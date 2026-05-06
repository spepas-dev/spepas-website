// src/lib/walletApis.ts
import apiClient from './axios';

export type WalletProfile = 'SELLER' | 'DELIVERY' | 'GOPA' | 'BUYER' | 'MEPA';

// GET: Get User's Wallet Details. Optional `profile` scopes the lookup to
// one role wallet — required for per-profile separation. Without it, falls
// back to "any active wallet" (legacy combined wallet path).
export const getMyWalletDetails = async (profile?: WalletProfile) => {
  const url = profile
    ? `/wallet/get-my-wallet-details/${profile}`
    : '/wallet/get-my-wallet-details';
  const { data } = await apiClient.get(url);
  return data;
};

// POST: Request a withdrawal of the authenticated user's full available
// balance from the specified role wallet to the phone number on file
// (treated as MoMo). Phase 1 ledger only — admin marks the request complete
// or failed out-of-band once funds are sent.
export const requestWalletWithdrawal = async (profile?: WalletProfile) => {
  const url = profile
    ? `/wallet/request-withdrawal/${profile}`
    : '/wallet/request-withdrawal';
  const { data } = await apiClient.post(url, {});
  return data;
};
