// src/components/marketing/Home/index.tsx
import React from 'react';
import MarketingLanding from './MarketingLanding';
import SellerHome from '@/components/role-homes/SellerHome';
import RiderHome from '@/components/role-homes/RiderHome';
import GopaHome from '@/components/role-homes/GopaHome';

import { useAuth } from '@/features/auth';
import { useAccountType } from '@/features/accountTypeContext';

type AccountType = 'SELLER' | 'RIDER' | 'BUYER' | 'GOPA' | 'MEPA' | 'USER' | string;

const Home: React.FC = () => {
  const { isAuthenticated, authData } = useAuth();
  const { accountType } = useAccountType();

  const role: AccountType = (accountType || 'BUYER') as AccountType;

  const name   = authData?.user?.name ?? 'User';
  const sellerId = authData?.user?.sellerDetails?.Seller_ID;
  const gopaId   = authData?.user?.gopa?.Gopa_ID;
  // const riderId  = authData?.user?.rider?.Rider_ID; // if/when available

  // Not signed in → marketing landing
  if (!isAuthenticated) return <MarketingLanding />;

  // SELLER / RIDER / GOPA → role UIs
  if (role === 'SELLER') return <SellerHome name={name} sellerId={sellerId} />;
  if (role === 'RIDER')  return <RiderHome riderName={name} />;
  if (role === 'GOPA')   return <GopaHome name={name} gopaId={gopaId} />;

  // BUYER & MEPA (and any other) → marketing landing
  return <MarketingLanding />;
};

export default Home;
