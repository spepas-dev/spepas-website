// src/components/marketing/MyAccount/WalletDetails.tsx
import React, { useEffect, useState } from 'react';
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
    return <p>Loading wallet details…</p>;
  }

  if (!wallet) {
    return <p className="text-gray-500">No wallet details found.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">My Wallet</h3>
      <div className="space-y-2">
        <p><strong>Wallet Number:</strong> {wallet.WalletNumber}</p>
        <p><strong>Type:</strong> {wallet.wallet_type}</p>
        <p><strong>Balance:</strong> GH₵ {wallet.balance.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          Created: {new Date(wallet.date_created).toLocaleString()}
        </p>
        <p><strong>Status:</strong> {wallet.status === 1 ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  );
};

export default WalletDetails;
