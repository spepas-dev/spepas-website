// src/components/marketing/MyAccount/PaymentAccountsTab.tsx
import React from 'react';
import { PaymentAccount } from '@/features/auth';

const PaymentAccountsTab: React.FC<{ accounts: PaymentAccount[] }> = ({ accounts }) => (
  <div>
    {accounts.length ? (
      <ul className="list-disc pl-5 space-y-1">
        {accounts.map(acc => (
          <li key={acc.Account_ID}>
            {acc.mode} — {acc.provider} ({acc.accountNumber})
          </li>
        ))}
      </ul>
    ) : (
      <p>No payment accounts.</p>
    )}
  </div>
);

export default PaymentAccountsTab;
