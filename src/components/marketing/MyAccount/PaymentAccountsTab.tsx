import React, { useState } from 'react';
import { PaymentAccount } from '@/features/auth';
import { Eye, EyeOff, CreditCard, Banknote, Smartphone } from 'lucide-react';

const getModeIcon = (mode: string) => {
  const lower = mode.toLowerCase();
  if (lower.includes('mobile') || lower.includes('momo')) return Smartphone;
  if (lower.includes('bank')) return Banknote;
  return CreditCard;
};

const PaymentAccountsTab: React.FC<{ accounts: PaymentAccount[] }> = ({ accounts }) => {
  const [visibleAccounts, setVisibleAccounts] = useState<{ [id: string]: boolean }>({});

  const toggleVisibility = (id: string) => {
    setVisibleAccounts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskAccountNumber = (num: string) => {
    if (num.length <= 4) return '*'.repeat(num.length);
    return '*'.repeat(num.length - 4) + num.slice(-4);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">Payment Accounts</h3>
        <p className="text-sm text-dark-4 mt-1">Your linked payment methods</p>
      </div>

      {accounts.length > 0 ? (
        <div className="space-y-3">
          {accounts.map((acc) => {
            const ModeIcon = getModeIcon(acc.mode);
            const isVisible = visibleAccounts[acc.Account_ID];
            return (
              <div
                key={acc.Account_ID}
                className="flex items-center gap-4 bg-gray-1 rounded-xl border border-gray-3 p-4 hover:shadow-1 transition-shadow"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-light-5 flex items-center justify-center">
                  <ModeIcon className="h-5 w-5 text-blue" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-dark">{acc.provider}</p>
                    <span className="text-[10px] bg-gray-2 text-dark-3 px-2 py-0.5 rounded-full font-medium">
                      {acc.mode}
                    </span>
                  </div>
                  <p className="text-sm text-dark-3 mt-0.5 font-mono">
                    {isVisible ? acc.accountNumber : maskAccountNumber(acc.accountNumber)}
                  </p>
                </div>

                <button
                  onClick={() => toggleVisibility(acc.Account_ID)}
                  className="flex-shrink-0 h-9 w-9 rounded-lg bg-white border border-gray-3 flex items-center justify-center hover:bg-gray-2 transition-colors"
                  aria-label="Toggle account number visibility"
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4 text-dark-4" />
                  ) : (
                    <Eye className="h-4 w-4 text-dark-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
          <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-dark-4" />
          </div>
          <p className="text-sm font-medium text-dark-2">No payment accounts</p>
          <p className="text-xs text-dark-4 mt-1">Add a payment account to see it here</p>
        </div>
      )}
    </div>
  );
};

export default PaymentAccountsTab;
