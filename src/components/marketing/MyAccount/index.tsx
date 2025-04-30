// src/components/marketing/MyAccount/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Breadcrumb from '@/components/common/Breadcrumb';
import { useAuth } from '@/features/auth';

import GeneralDetails from './GeneralDetails';
import GopaProfileTab from './GopaProfileTab';
import MepaProfileTab from './MepaProfileTab';
import SellerDetailsTab from './SellerDetailsTab';
import DeliverProfileTab from './DeliverProfileTab';
import PaymentAccountsTab from './PaymentAccountsTab';
import GroupsRolesTab from './GroupsRolesTab';

type TabKey =
  | 'general'
  | 'gopa'
  | 'mepa'
  | 'seller'
  | 'deliver'
  | 'payments'
  | 'groups';

const MyAccount: React.FC = () => {
  const { authData } = useAuth();
  const user = authData!.user!;
  const navigate = useNavigate();

  // Format "Month Year" from createdAt
  const createdDate = new Date(user.createdAt);
  const createdMonthYear = createdDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // Build tab list, only including ones with data
  const tabs = [
    { key: 'general'  as const, label: 'General' },
    user.gopa            && { key: 'gopa'      as const, label: 'GOPA'      },
    user.mepa            && { key: 'mepa'      as const, label: 'MEPA'      },
    user.sellerDetails   && { key: 'seller'    as const, label: 'Seller'    },
    user.deliver         && { key: 'deliver'   as const, label: 'Deliver'   },
    (user.paymentAccounts?.length ?? 0) > 0
                         && { key: 'payments'  as const, label: 'Payments'  },
    ((user.user_groups?.length ?? 0) > 0 || (user.user_roles?.length ?? 0) > 0)
                         && { key: 'groups'    as const, label: 'Groups/Roles' },
  ]
    .filter(Boolean) as Array<{ key: TabKey; label: string }>;

  const [activeTab, setActiveTab] = useState<TabKey>('general');

  return (
    <>
      {/* <Breadcrumb title="My Account" pages={['My Account']} /> */}

      <section className="py-20 bg-white">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          {/* Profiling button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => navigate('/registration-selection')}
              className="bg-gradient-to-r from-blue to-blue-500 text-white font-medium py-2 px-6 rounded-2xl shadow-md hover:opacity-90 transition"
            >
              Profiling
            </button>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Sidebar */}
            <aside className="xl:w-[370px] w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(124,58,237,0.1)]">
              {/* User Info */}
              <div className="flex items-center gap-4 py-6 px-7.5 border-b border-gray-200">
                <div>
                  <p className="text-lg font-bold text-gray-600 tracking-wide mb-1">
                    Welcome, {user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Member Since {createdMonthYear}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="p-4 xl:p-9">
                <div className="flex xl:flex-col gap-4 overflow-x-auto">
                  {tabs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`
                        flex-none w-auto text-left flex items-center gap-2.5 py-3 px-5 rounded-2xl tracking-wide transition-all duration-200
                        ${
                          activeTab === key
                            ? 'bg-gradient-to-r from-blue to-blue-500 text-white shadow-[0_4px_18px_rgba(124,58,237,0.4)]'
                            : 'bg-gray-50 text-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:text-white hover:shadow-[0_4px_18px_rgba(92,124,250,0.2)]'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content Panel */}
            <main className="xl:flex-1 w-full">
              <div className="bg-gray-75 rounded-2xl shadow-[0_6px_30px_rgba(92,124,250,0.1)] py-10 px-6 sm:px-10 xl:px-12 transition-colors">
                {activeTab === 'general'  && <GeneralDetails     user={user} />}
                {activeTab === 'gopa'     && <GopaProfileTab     profile={user.gopa} />}
                {activeTab === 'mepa'     && <MepaProfileTab     profile={user.mepa} />}
                {activeTab === 'seller'   && <SellerDetailsTab   details={user.sellerDetails} />}
                {activeTab === 'deliver'  && <DeliverProfileTab  deliver={user.deliver} />}
                {activeTab === 'payments' && <PaymentAccountsTab accounts={user.paymentAccounts!} />}
                {activeTab === 'groups'   && (
                  <GroupsRolesTab
                    groups={user.user_groups!}
                    roles={user.user_roles!}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;
