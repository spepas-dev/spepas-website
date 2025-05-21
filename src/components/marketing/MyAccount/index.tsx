// src/components/marketing/MyAccount/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';

import GeneralDetails from './GeneralDetails';
import GopaProfileTab from './GopaProfileTab';
import MepaProfileTab from './MepaProfileTab';
import SellerDetailsTab from './SellerDetailsTab';
import DeliverProfileTab from './DeliverProfileTab';
import PaymentAccountsTab from './PaymentAccountsTab';
import GroupsRolesTab from './GroupsRolesTab';
import AddressDetails from './AddressDetails';
import WalletDetails from './WalletDetails';

type TabKey =
  | 'general'
  | 'gopa'
  | 'mepa'
  | 'seller'
  | 'deliver'
  | 'payments'
  | 'groups'
  | 'address'
  | 'wallet';

const MyAccount: React.FC = () => {
  const { authData, logout } = useAuth();
  const user = authData!.user!;
  const navigate = useNavigate();

  const createdDate = new Date(user.createdAt);
  const createdMonthYear = createdDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const tabs = [
    { key: 'general' as const, label: 'General Profile' },
    user.gopa &&    { key: 'gopa'    as const, label: 'My GOPA Profile' },
    user.mepa &&    { key: 'mepa'    as const, label: 'My MEPA Profile' },
    user.sellerDetails && { key: 'seller'  as const, label: 'My Seller Profile' },
    user.deliver && { key: 'deliver' as const, label: 'My Delivery Profile' },
    (user.paymentAccounts?.length ?? 0) > 0 && { key: 'payments' as const, label: 'My Payment Accounts' },
    ((user.user_groups?.length ?? 0) > 0 || (user.user_roles?.length ?? 0) > 0) && { key: 'groups' as const, label: 'Groups/Roles' },
    { key: 'address' as const, label: 'My Addresses' },
    { key: 'wallet' as const, label: 'My Wallet' },
  ].filter(Boolean) as Array<{ key: TabKey; label: string }>;

  const [activeTab, setActiveTab] = useState<TabKey>('general');

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/registration-selection')}
            className="bg-gradient-to-r from-blue to-blue-500 text-white font-medium py-2 px-6 rounded-2xl shadow-md"
          >
            Add Profile
          </button>
        </div>
        <div className="flex flex-col xl:flex-row gap-8">
          <aside className="xl:w-[370px] w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(124,58,237,0.1)]">
            <div className="flex items-center gap-4 py-6 px-7.5 border-b border-gray-200">
              <div>
                <p className="text-lg font-bold text-gray-600 mb-1">Welcome, {user.name}</p>
                <p className="text-xs text-gray-400">Member Since {createdMonthYear}</p>
              </div>
            </div>
            <div className="p-4 xl:p-9">
              <div className="flex xl:flex-col gap-4 overflow-x-auto">
                {tabs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`
                      flex-none w-auto text-left flex items-center gap-2.5 py-3 px-5 rounded-2xl transition-all duration-200
                      ${
                        activeTab === key
                          ? 'bg-gradient-to-r from-blue to-blue-500 text-white shadow-[0_4px_18px_rgba(124,58,237,0.4)]'
                          : 'bg-gray-50 text-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:text-white'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-6 px-4 xl:px-9">
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-red-100 text-red-700 rounded-2xl"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </aside>
          <main className="xl:flex-1 w-full">
            <div className="bg-gray-75 rounded-2xl shadow-[0_6px_30px_rgba(92,124,250,0.1)] py-10 px-6 sm:px-10 xl:px-12">
              {activeTab === 'general'  && <GeneralDetails user={user} />}
              {activeTab === 'gopa'     && <GopaProfileTab profile={user.gopa} />}
              {activeTab === 'mepa'     && <MepaProfileTab profile={user.mepa} />}
              {activeTab === 'seller'   && <SellerDetailsTab details={user.sellerDetails} />}
              {activeTab === 'deliver'  && <DeliverProfileTab deliver={user.deliver} />}
              {activeTab === 'payments' && <PaymentAccountsTab accounts={user.paymentAccounts!} />}
              {activeTab === 'groups'   && <GroupsRolesTab groups={user.user_groups!} roles={user.user_roles!} />}
              {activeTab === 'address'  && <AddressDetails />}
              {activeTab === 'wallet'   && <WalletDetails />}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
