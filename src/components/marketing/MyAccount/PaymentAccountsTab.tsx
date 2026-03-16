import React, { useState } from 'react';
import { PaymentAccount } from '@/features/auth';
import { Eye, EyeOff } from 'lucide-react';

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
      <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Accounts</h2>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No payment accounts found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map(acc => (
            <div
              key={acc.Account_ID}
              className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{acc.provider}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mr-2">{acc.mode}</span>
                    <span className="font-mono">
                      {visibleAccounts[acc.Account_ID] ? acc.accountNumber : maskAccountNumber(acc.accountNumber)}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleVisibility(acc.Account_ID)}
                className="p-2 rounded-lg text-gray-400 hover:text-blue hover:bg-blue/5 transition"
                aria-label="Toggle account number visibility"
              >
                {visibleAccounts[acc.Account_ID] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentAccountsTab;
