// features/accountTypeContext.tsx
import React, { createContext, useContext, useState } from 'react';

type AccountType = 'GOPA' | 'SELLER' | 'MEPA' | 'RIDER' | 'BUYER' | null;

const AccountTypeContext = createContext<{
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
}>({
  accountType: null,
  setAccountType: () => {},
});

export const AccountTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accountType, setAccountType] = useState<AccountType>(null);
  return (
    <AccountTypeContext.Provider value={{ accountType, setAccountType }}>
      {children}
    </AccountTypeContext.Provider>
  );
};

export const useAccountType = () => useContext(AccountTypeContext);
