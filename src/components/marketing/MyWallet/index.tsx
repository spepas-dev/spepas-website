// src/components/marketing/MyWallet/index.tsx
//
// Shared wallet + withdrawal UI for any role that earns into the same User
// wallet (seller, rider, gopa). The underlying wallet is keyed to User_ID,
// so the API calls (`getMyWalletDetails`, `requestWalletWithdrawal`) are
// role-agnostic; we only customise the copy via the `role` prop.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import Breadcrumb from '@/components/marketing/Common/Breadcrumb';
import { getMyWalletDetails, requestWalletWithdrawal, WalletProfile } from '@/lib/walletApis';

interface WalletData {
  walletID: string;
  WalletNumber: string;
  wallet_type: string;
  balance: number;
  availableBalance: number;
  totalCredit: number;
  totalDebit: number;
  status: number;
  date_created: string;
  name?: string | null;
}

const cedi = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(n);

export type WalletRole = 'SELLER' | 'RIDER' | 'GOPA';

// Map the page-level role to the backend USER_TYPE enum that scopes the
// wallet lookup. Rider profile is "DELIVERY" in USER_TYPE.
const ROLE_TO_PROFILE: Record<WalletRole, WalletProfile> = {
  SELLER: 'SELLER',
  RIDER: 'DELIVERY',
  GOPA: 'GOPA',
};

interface MyWalletProps {
  // Determines breadcrumb label, empty-state copy, and the multi-user note
  // (only sellers can have multi-user stores today). The wallet itself is
  // shared across all role views the user has.
  role: WalletRole;
  // Cache key so two role views (seller wallet, rider wallet) on the same
  // device don't share a stale cached row when the user switches roles.
  // Defaults to a role-prefixed key.
  queryKey?: readonly unknown[];
}

const ROLE_COPY: Record<WalletRole, {
  label: string;
  emptyMessage: string;
  multiUserNote?: string;
}> = {
  SELLER: {
    label: 'My Wallet',
    emptyMessage:
      'No wallet found yet. A wallet is created automatically the first time a buyer confirms delivery of one of your orders.',
    multiUserNote:
      "Note: a multi-user store splits each order's earnings equally across all active users attached to the store. Each user requests withdrawals from their own share.",
  },
  RIDER: {
    label: 'My Wallet',
    emptyMessage:
      'No wallet found yet. A wallet is created automatically the first time you complete a delivery handshake.',
  },
  GOPA: {
    label: 'My Wallet',
    emptyMessage:
      'No wallet found yet. A wallet is created automatically when commissions or earnings post to your account.',
  },
};

const MyWallet: React.FC<MyWalletProps> = ({ role, queryKey }) => {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; message: string } | null>(null);

  const profile = ROLE_TO_PROFILE[role];
  const effectiveKey = queryKey ?? [`${role.toLowerCase()}-wallet-details`, profile];

  const walletQuery = useQuery({
    queryKey: effectiveKey,
    queryFn: () => getMyWalletDetails(profile),
  });

  const withdrawMutation = useMutation({
    mutationFn: () => requestWalletWithdrawal(profile),
    onSuccess: (resp: any) => {
      if (resp && resp.status === 1) {
        const amount = resp.data?.amount;
        setFeedback({
          kind: 'ok',
          message:
            amount != null
              ? `Withdrawal of ${cedi(Number(amount))} requested. You'll receive funds shortly.`
              : "Withdrawal requested. You'll receive funds shortly.",
        });
        queryClient.invalidateQueries({ queryKey: effectiveKey });
      } else {
        setFeedback({ kind: 'err', message: resp?.message || 'Could not process withdrawal.' });
      }
    },
    onError: () => {
      setFeedback({ kind: 'err', message: 'Could not connect to wallet service. Please try again.' });
    },
  });

  const wallet: WalletData | null = walletQuery.data?.data || null;
  const available = Number(wallet?.availableBalance ?? 0);
  const totalEarned = Number(wallet?.totalCredit ?? 0);
  const totalPaidOut = Number(wallet?.totalDebit ?? 0);
  const canWithdraw = !!wallet && available > 0;

  const copy = ROLE_COPY[role];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb title={copy.label} pages={[copy.label]} />

      <h1 className="text-2xl font-semibold text-gray-900 mb-6 mt-4">{copy.label}</h1>

      {walletQuery.isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          Loading your wallet...
        </div>
      ) : !wallet ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          {copy.emptyMessage}
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 shadow-md">
            <p className="text-sm text-white/80">Available balance</p>
            <p className="text-4xl font-bold mt-1">{cedi(available)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wide">Total earned</p>
                <p className="font-semibold">{cedi(totalEarned)}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wide">Total paid out</p>
                <p className="font-semibold">{cedi(totalPaidOut)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Withdraw your earnings</p>
              <p className="text-sm text-gray-600 mt-1">
                We'll transfer your full available balance to the mobile money number on file.
                Once a request is created, our team verifies and disburses funds. You'll receive
                an SMS when the transfer completes.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Amount to withdraw</p>
                <p className="text-xl font-semibold text-gray-900">{cedi(available)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  withdrawMutation.mutate();
                }}
                disabled={!canWithdraw || withdrawMutation.isPending}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {withdrawMutation.isPending ? 'Requesting...' : 'Request withdrawal'}
              </button>
            </div>
            {!canWithdraw && (
              <p className="text-xs text-gray-500">
                You can withdraw once your available balance is greater than zero. Earnings post
                automatically when activity completes.
              </p>
            )}
            {feedback && (
              <div
                className={
                  'mt-2 rounded-md p-3 text-sm ' +
                  (feedback.kind === 'ok'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200')
                }
                role="status"
              >
                {feedback.message}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="rounded-md bg-white border border-gray-200 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Wallet number</p>
              <p className="font-medium text-gray-800 mt-1">{wallet.WalletNumber}</p>
            </div>
            <div className="rounded-md bg-white border border-gray-200 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
              <p className="font-medium text-gray-800 mt-1">
                {wallet.status === 1 ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {copy.multiUserNote && (
            <p className="mt-6 text-xs text-gray-500">{copy.multiUserNote}</p>
          )}
        </>
      )}
    </div>
  );
};

export default MyWallet;
