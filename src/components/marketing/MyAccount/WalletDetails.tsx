import React, { useEffect, useState } from 'react';

import SpepasLoader from '@/components/common/SpepasLoader';
import { getMyWalletDetails } from '@/lib/walletApis';

interface Wallet {
  id: number;
  walletID: string;
  date_created: string;
  status: number;
  wallet_type: string;
  User_ID: string | null;
  WalletNumber: string;
  balance: number;
}

const WalletDetails: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyWalletDetails();
        setWallet(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <SpepasLoader />;
  }

  if (!wallet) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No wallet details found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">My Wallet</h2>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-blue to-blue-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <p className="text-sm font-medium text-white/70 uppercase tracking-wide">Available Balance</p>
        <p className="text-3xl font-bold mt-1">GH₵ {wallet.balance.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${wallet.status === 1 ? 'bg-white/20 text-white' : 'bg-red-400/30 text-red-100'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${wallet.status === 1 ? 'bg-green-300' : 'bg-red-300'}`} />
            {wallet.status === 1 ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Wallet Number</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">{wallet.WalletNumber}</p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Wallet Type</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">{wallet.wallet_type}</p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Created</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {new Date(wallet.date_created).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletDetails;
