// src/features/accountTypeContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth';

export type AccountType = 'GOPA' | 'SELLER' | 'MEPA' | 'RIDER' | 'BUYER' | null;

type Ctx = {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  availableRoles: Exclude<AccountType, null>[];
};

const AccountTypeContext = createContext<Ctx>({
  accountType: null,
  setAccountType: () => {},
  availableRoles: [],
});

const STORAGE_KEY = 'accountType';

function getAvailableRoles(user: any | null): Exclude<AccountType, null>[] {
  if (!user) return [];
  const roles: Exclude<AccountType, null>[] = [];
  if (user?.gopa) roles.push('GOPA');
  if (user?.sellerDetails) roles.push('SELLER');
  if (user?.deliver) roles.push('RIDER');
  if (user?.mepa) roles.push('MEPA');
  // Everyone can browse/buy by default
  roles.push('BUYER');
  return roles;
}

export const AccountTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authData } = useAuth();

  const availableRoles = useMemo(
    () => getAvailableRoles(authData?.user ?? null),
    [authData?.user],
  );

  const [accountType, setAccountTypeState] = useState<AccountType>(null);

  // Decide initial/next role whenever the user changes
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as AccountType) ?? null;
    const storedIsValid =
      stored && availableRoles.includes(stored as Exclude<AccountType, null>);

    const next: AccountType =
      storedIsValid
        ? stored
        : (availableRoles[0] ?? null); // default to the first available role (GOPA→SELLER→RIDER→MEPA→BUYER)

    setAccountTypeState(next);
    if (next) localStorage.setItem(STORAGE_KEY, next);
    else localStorage.removeItem(STORAGE_KEY); // clears on logout
  }, [availableRoles]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const val = (e.newValue as AccountType) ?? null;
      if (!val || availableRoles.includes(val as any)) {
        setAccountTypeState(val);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [availableRoles]);

  const setAccountType = (type: AccountType) => {
    if (type && !availableRoles.includes(type as any)) return; // guard against invalid roles
    setAccountTypeState(type);
    if (type) localStorage.setItem(STORAGE_KEY, type);
    else localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AccountTypeContext.Provider value={{ accountType, setAccountType, availableRoles }}>
      {children}
    </AccountTypeContext.Provider>
  );
};

export const useAccountType = () => useContext(AccountTypeContext);
