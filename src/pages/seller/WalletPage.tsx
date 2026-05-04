// src/pages/seller/WalletPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import Breadcrumb from '@/components/marketing/Common/Breadcrumb';
import { getMyWalletDetails, requestWalletWithdrawal } from '@/lib/walletApis';

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

const SellerWalletPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; message: string } | null>(null);

  const walletQuery = useQuery({
    queryKey: ['seller-wallet-details'],
    queryFn: getMyWalletDetails
  });

  const withdrawMutation = useMutation({
    mutationFn: requestWalletWithdrawal,
    onSuccess: (resp) => {
      if (resp && resp.status === 1) {
        const amount = resp.data?.amount;
        setFeedback({
          kind: 'ok',
          message:
            amount != null
              ? `Withdrawal of ${cedi(Number(amount))} requested. You'll receive funds shortly.`
              : 'Withdrawal requested. You’ll receive funds shortly.'
        });
        queryClient.invalidateQueries({ queryKey: ['seller-wallet-details'] });
      } else {
        setFeedback({ kind: 'err', message: resp?.message || 'Could not process withdrawal.' });
      }
    },
    onError: () => {
      setFeedback({ kind: 'err', message: 'Could not connect to wallet service. Please try again.' });
    }
  });

  const wallet: WalletData | null = walletQuery.data?.data || null;
  const balance = Number(wallet?.balance ?? 0);
  const available = Number(wallet?.availableBalance ?? 0);
  const totalEarned = Number(wallet?.totalCredit ?? 0);
  const totalPaidOut = Number(wallet?.totalDebit ?? 0);

  const canWithdraw = !!wallet && available > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'My Wallet' }
        ]}
      />

      <h1 className="text-2xl font-semibold text-gray-900 mb-6 mt-4">My Wallet</h1>

      {walletQuery.isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          Loading your wallet...
        </div>
      ) : !wallet ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          No wallet found yet. A wallet is created automatically the first time a customer
          confirms delivery of one of your orders.
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
                automatically when buyers confirm delivery.
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

          <p className="mt-6 text-xs text-gray-500">
            Note: a multi-user store splits each order's earnings equally across all active users
            attached to the store. Each user requests withdrawals from their own share.
          </p>
        </>
      )}
    </div>
  );
};

export default SellerWalletPage;
