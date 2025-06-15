// src/components/marketing/MyAccount/index.tsx
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth';

import AddressDetails from './AddressDetails';
import DeliverProfileTab from './DeliverProfileTab';
import GeneralDetails from './GeneralDetails';
import GopaProfileTab from './GopaProfileTab';
import GroupsRolesTab from './GroupsRolesTab';
import MepaProfileTab from './MepaProfileTab';
import PaymentAccountsTab from './PaymentAccountsTab';
import SellerDetailsTab from './SellerDetailsTab';
import WalletDetails from './WalletDetails';

type TabKey = 'general' | 'gopa' | 'mepa' | 'seller' | 'deliver' | 'groups' | 'payments' | 'address' | 'wallet';

const MyAccount: React.FC = () => {
  const { authData, logout } = useAuth();
  const user = authData!.user!;
  const navigate = useNavigate();

  // Format "Member Since".
  const createdDate = new Date(user.createdAt);
  const createdMonthYear = createdDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  // Flattened list of all tabs
  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'general', label: 'General Profile' },
    user.gopa && { key: 'gopa', label: 'My GOPA Profile' },
    user.mepa && { key: 'mepa', label: 'My MEPA Profile' },
    user.sellerDetails && { key: 'seller', label: 'My Seller Profile' },
    user.deliver && { key: 'deliver', label: 'My Delivery Profile' },
    ((user.user_groups?.length ?? 0) > 0 || (user.user_roles?.length ?? 0) > 0) && { key: 'groups', label: 'Groups/Roles' },
    (user.paymentAccounts?.length ?? 0) > 0 && {
      key: 'payments',
      label: 'My Payment Accounts'
    },
    { key: 'address', label: 'My Addresses' },
    { key: 'wallet', label: 'My Wallet' }
  ]
    .filter(Boolean)
    .map((item) => item as { key: TabKey; label: string });

  const [activeTab, setActiveTab] = useState<TabKey>('general');

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* “Add Profile” button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/registration-selection')}
            className="bg-gradient-to-r from-blue to-blue-500 text-white font-medium py-2 px-6 rounded-2xl shadow-md"
          >
            Add Profile
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar */}
          <aside className="xl:w-[370px] w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(124,58,237,0.1)]">
            {/* Header: user name & join date */}
            <div className="flex items-center gap-4 py-6 px-7.5 border-b border-gray-200">
              <div>
                <p className="text-lg font-bold text-gray-600 mb-1">Welcome, {user.name}</p>
                <p className="text-xs text-gray-400">Member Since {createdMonthYear}</p>
              </div>
            </div>

            {/* Desktop: vertical list of all tabs */}
            <div className="p-4 xl:p-9 hidden xl:block">
              <div className="flex flex-col gap-4">
                {tabs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`
                      w-full text-left flex items-center gap-2.5 py-3 px-5 rounded-2xl transition-all duration-200
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
                {/* Desktop: Sign Out at bottom */}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="mt-6 w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-red-100 text-red-700 rounded-2xl"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Mobile: single <Disclosure> that lists all tabs in one flat list */}
            <div className="xl:hidden px-4 pt-4">
              <Disclosure as="div" className="mb-4">
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className="
                        w-full
                        flex justify-between items-center
                        bg-indigo-500 text-white
                        text-sm font-medium
                        px-4 py-2 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-indigo-400
                        transition
                      "
                    >
                      <span>Menu</span>
                      <ChevronDownIcon
                        className={`
                          w-5 h-5 transition-transform
                          ${open ? 'rotate-180' : 'rotate-0'}
                        `}
                      />
                    </Disclosure.Button>

                    <Transition
                      as={Fragment}
                      enter="transition duration-200 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-150 ease-in"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="mt-3 space-y-2">
                        {/* Flat list of every tab; using Disclosure.Button so it auto‐closes */}
                        {tabs.map(({ key, label }) => (
                          <Disclosure.Button
                            key={key}
                            as="button"
                            onClick={() => setActiveTab(key)}
                            className={`
                              block w-full text-left
                              px-4 py-2 rounded-lg transition
                              ${
                                activeTab === key
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-gray-100 text-gray-800 hover:bg-indigo-400 hover:text-white'
                              }
                            `}
                          >
                            {label}
                          </Disclosure.Button>
                        ))}
                        {/* Mobile: Sign Out at bottom */}
                        <Disclosure.Button
                          as="button"
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-red-100 text-red-700 rounded-2xl"
                        >
                          Sign Out
                        </Disclosure.Button>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </div>
          </aside>

          {/* Main Content */}
          <main className="xl:flex-1 w-full">
            <div className="bg-gray-75 rounded-2xl shadow-[0_6px_30px_rgba(92,124,250,0.1)] py-10 px-6 sm:px-10 xl:px-12">
              {activeTab === 'general' && <GeneralDetails user={user} />}
              {activeTab === 'gopa' && user.gopa && <GopaProfileTab profile={user.gopa} />}
              {activeTab === 'mepa' && user.mepa && <MepaProfileTab profile={user.mepa} />}
              {activeTab === 'seller' && user.sellerDetails && <SellerDetailsTab details={user.sellerDetails} />}
              {activeTab === 'deliver' && user.deliver && <DeliverProfileTab deliver={user.deliver} />}
              {activeTab === 'groups' && <GroupsRolesTab groups={user.user_groups ?? []} roles={user.user_roles ?? []} />}

              {activeTab === 'payments' && user.paymentAccounts && <PaymentAccountsTab accounts={user.paymentAccounts} />}
              {activeTab === 'address' && <AddressDetails />}
              {activeTab === 'wallet' && <WalletDetails />}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
