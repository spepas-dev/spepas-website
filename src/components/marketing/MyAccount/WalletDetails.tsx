import React, { useEffect, useState } from 'react';
import { getMyWalletDetails } from '@/lib/walletApis';
import { Wallet, CreditCard, CalendarDays, Hash, Activity } from 'lucide-react';
import SpepasLoader from '@/components/common/SpepasLoader';

interface WalletData {
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
  const [wallet, setWallet] = useState<WalletData | null>(null);
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
    return <SpepasLoader size="lg" label="Loading wallet..." fullSection />;
  }

  if (!wallet) {
    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-dark">My Wallet</h3>
          <p className="text-sm text-dark-4 mt-1">Your wallet and balance information</p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
          <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
            <Wallet className="h-6 w-6 text-dark-4" />
          </div>
          <p className="text-sm font-medium text-dark-2">No wallet found</p>
          <p className="text-xs text-dark-4 mt-1">Your wallet will appear here once activated</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">My Wallet</h3>
        <p className="text-sm text-dark-4 mt-1">Your wallet and balance information</p>
      </div>

      {/* Balance hero card */}
      <div className="bg-gradient-to-br from-blue to-blue-dark rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 opacity-70" />
          <p className="text-sm opacity-80 font-medium">Available Balance</p>
        </div>
        <p className="text-3xl font-bold tracking-tight">
          GH&#x20B5; {wallet.balance.toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            wallet.status === 1
              ? 'bg-white/20 text-white'
              : 'bg-red-400/30 text-red-100'
          }`}>
            <Activity className="h-3 w-3" />
            {wallet.status === 1 ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Details card */}
      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-white flex items-center justify-center border border-gray-3">
              <Hash className="h-4 w-4 text-dark-4" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Wallet Number</p>
              <p className="text-sm font-medium text-dark mt-0.5 font-mono">{wallet.WalletNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-white flex items-center justify-center border border-gray-3">
              <CreditCard className="h-4 w-4 text-dark-4" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Wallet Type</p>
              <p className="text-sm font-medium text-dark mt-0.5">{wallet.wallet_type}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-white flex items-center justify-center border border-gray-3">
              <CalendarDays className="h-4 w-4 text-dark-4" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Created</p>
              <p className="text-sm font-medium text-dark mt-0.5">
                {new Date(wallet.date_created).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDetails;
