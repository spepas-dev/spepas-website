import React, { useState } from 'react';
import { PaymentAccount } from '@/features/auth';
import { Eye, EyeOff } from 'lucide-react'; // using lucide-react icons

const PaymentAccountsTab: React.FC<{ accounts: PaymentAccount[] }> = ({ accounts }) => {
  const [visibleAccounts, setVisibleAccounts] = useState<{ [id: string]: boolean }>({});

  const toggleVisibility = (id: string) => {
    setVisibleAccounts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskAccountNumber = (num: string) => {
    if (num.length <= 4) return '*'.repeat(num.length);
    return '*'.repeat(num.length - 4) + num.slice(-4);
  };

  return (
    <div>
      {accounts.length ? (
        <ul className="space-y-4">
          {accounts.map(acc => (
            <li
              key={acc.Account_ID}
              className="flex items-center justify-between p-3 rounded-md bg-white shadow-sm"
            >
              <div className="text-sm text-gray-800">
                <span className="font-medium">{acc.mode}</span> — {acc.provider}{' '}
                (
                {visibleAccounts[acc.Account_ID]
                  ? acc.accountNumber
                  : maskAccountNumber(acc.accountNumber)}
                )
              </div>
              <button
                onClick={() => toggleVisibility(acc.Account_ID)}
                className="text-gray-500 hover:text-blue-600 transition"
                aria-label="Toggle account number visibility"
              >
                {visibleAccounts[acc.Account_ID] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No payment accounts.</p>
      )}
    </div>
  );
};

export default PaymentAccountsTab;
