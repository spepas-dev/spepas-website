// src/components/marketing/MyAccount/index.tsx
import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/features/auth';
import { useAccountType } from '@/features/accountTypeContext';

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
  | 'groups'
  | 'payments'
  | 'address'
  | 'wallet';

type Role = 'GOPA' | 'MEPA' | 'SELLER' | 'RIDER' | 'BUYER';

const MyAccount: React.FC = () => {
  const { authData, logout } = useAuth();
  const { accountType, setAccountType } = useAccountType();
  const user = authData!.user!;
  const navigate = useNavigate();

  // Format “Member Since”
  const createdMonthYear = new Date(user.createdAt).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // Build list of roles for switcher
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [showSwitcher, setShowSwitcher] = useState(false);
  useEffect(() => {
    const roles: Role[] = [];
    if (user.gopa)            roles.push('GOPA');
    if (user.mepa)            roles.push('MEPA');
    if (user.sellerDetails)   roles.push('SELLER');
    if (user.deliver)         roles.push('RIDER');
    roles.push('BUYER');
    setAvailableRoles(roles);
  }, [user]);

  // All possible tabs
  const allTabs: Array<{ key: TabKey; label: string }> = [
    { key: 'general', label: 'General Profile' },
    user.gopa &&    { key: 'gopa',    label: 'My GOPA Profile' },
    user.mepa &&    { key: 'mepa',    label: 'My MEPA Profile' },
    user.sellerDetails && { key: 'seller',  label: 'My Seller Profile' },
    user.deliver && { key: 'deliver', label: 'My Delivery Profile' },
    ((user.user_groups?.length ?? 0) > 0 || (user.user_roles?.length ?? 0) > 0) && { key: 'groups',   label: 'Groups/Roles' },
    (user.paymentAccounts?.length ?? 0) > 0 && { key: 'payments', label: 'My Payment Accounts' },
    { key: 'address', label: 'My Addresses' },
    { key: 'wallet',  label: 'My Wallet' },
  ]
    .filter(Boolean)
    .map((item) => item as { key: TabKey; label: string });

  // Filter tabs based on selected accountType
  const filteredTabs = allTabs.filter(({ key }) => {
    if (key === 'general') return true;
    if (accountType === 'GOPA'   && key === 'gopa')    return true;
    if (accountType === 'MEPA'   && key === 'mepa')    return true;
    if (accountType === 'SELLER' && key === 'seller')  return true;
    if (accountType === 'RIDER'  && key === 'deliver') return true;
    if (accountType === 'BUYER'  && key === 'address') return true;
    return false;
  });

  const [activeTab, setActiveTab] = useState<TabKey>('general');

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Add Profile & Switch Profile */}
        <div className="flex justify-end mb-6 space-x-4">
          <button
            onClick={() => navigate('/95668339501103956045/registration-selection')}
            className="bg-gradient-to-r from-blue to-blue-500 text-white font-medium py-2 px-6 rounded-2xl shadow-md"
          >
            Add Profile
          </button>
          <button
            onClick={() => setShowSwitcher(true)}
            className="bg-gradient-to-r from-blue to-blue-500 text-white font-medium py-2 px-6 rounded-2xl shadow-md"
          >
            Switch Profile
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar */}
          <aside className="xl:w-[370px] w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(124,58,237,0.1)]">
            {/* Header */}
            <div className="flex items-center gap-4 py-6 px-7.5 border-b border-gray-200">
              <div>
                <p className="text-lg font-bold text-gray-600 mb-1">Welcome, {user.name}</p>
                <p className="text-xs text-gray-400">Member Since {createdMonthYear}</p>
              </div>
            </div>

            {/* Desktop Tabs */}
            <div className="p-4 xl:p-9 hidden xl:block">
              <div className="flex flex-col gap-4">
                {filteredTabs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full text-left flex items-center gap-2.5 py-3 px-5 rounded-2xl transition-all duration-200 ${
                      activeTab === key
                        ? 'bg-gradient-to-r from-blue to-blue-500 text-white shadow-[0_4px_18px_rgba(124,58,237,0.4)]'
                        : 'bg-gray-50 text-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="mt-6 w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-red-100 text-red-700 rounded-2xl"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="xl:hidden px-4 pt-4">
              <Disclosure as="div" className="mb-4">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="w-full flex justify-between items-center bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition">
                      <span>Menu</span>
                      <ChevronDownIcon className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
                    </Disclosure.Button>
                    <Transition
                      as={Fragment}
                      enter="transition	duration-200 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-150 ease-in"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="mt-3 space-y-2">
                        {filteredTabs.map(({ key, label }) => (
                          <Disclosure.Button
                            key={key}
                            as="button"
                            onClick={() => setActiveTab(key)}
                            className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                              activeTab === key
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-indigo-400 hover:text-white'
                            }`}
                          >
                            {label}
                          </Disclosure.Button>
                        ))}
                        <Disclosure.Button
                          as="button"
                          onClick={() => { logout(); navigate('/'); }}
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
              {activeTab === 'gopa'    && user.gopa           && <GopaProfileTab   profile={user.gopa} />}
              {activeTab === 'mepa'    && user.mepa           && <MepaProfileTab   profile={user.mepa} />}
              {activeTab === 'seller'  && user.sellerDetails  && <SellerDetailsTab details={user.sellerDetails} />}
              {activeTab === 'deliver' && user.deliver        && <DeliverProfileTab deliver={user.deliver} />}
              {activeTab === 'groups'  && ( <GroupsRolesTab groups={user.user_groups ?? []} roles={user.user_roles ?? []} /> )}
              {activeTab === 'payments'&& user.paymentAccounts&& <PaymentAccountsTab accounts={user.paymentAccounts} />}
              {activeTab === 'address' && <AddressDetails />}
              {activeTab === 'wallet'  && <WalletDetails />}
            </div>
          </main>
        </div>
      </div>

      {/* Profile Switcher */}
      {showSwitcher && (
       <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10"
                 onClick={() => setShowSwitcher(false)}>
       <div className="bg-white rounded-lg p-6 w-80 text-center"
           onClick={(e) => e.stopPropagation()}>
         <h3 className="text-lg font-semibold mb-4">Switch Account Type</h3>
         <ul className="space-y-3">
           {availableRoles.map(role => (
             <li key={role}>
               <button
                 onClick={() => { setAccountType(role); setShowSwitcher(false); }}
                 className="w-full py-2 px-6 bg-gradient-to-r from-blue to-blue-500 text-white font-medium rounded-2xl shadow-md hover:opacity-90 transition"
               >
                 {role}
               </button>
             </li>
           ))}
         </ul>
       </div>
     </div>
     
     
      )}
    </section>
)
}

export default MyAccount;
