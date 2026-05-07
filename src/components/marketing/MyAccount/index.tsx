import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAccountType } from '@/features/accountTypeContext';
import { useAuth } from '@/features/auth';

import MyWallet, { WalletRole } from '@/components/marketing/MyWallet';

import AddressDetails from './AddressDetails';
import DeliverProfileTab from './DeliverProfileTab';
import GeneralDetails from './GeneralDetails';
import GopaProfileTab from './GopaProfileTab';
import GroupsRolesTab from './GroupsRolesTab';
import MepaProfileTab from './MepaProfileTab';
import PaymentAccountsTab from './PaymentAccountsTab';
import RiderDocumentsTab from './RiderDocumentsTab';
import SellerDetailsTab from './SellerDetailsTab';
import SellerDocumentsTab from './SellerDocumentsTab';

type TabKey =
  | 'general'
  | 'gopa'
  | 'mepa'
  | 'seller'
  | 'sellerDocs'
  | 'deliver'
  | 'riderDocs'
  | 'groups'
  | 'payments'
  | 'address'
  | 'wallet';

type Role = 'GOPA' | 'SELLER' | 'RIDER' | 'MEPA' | 'BUYER';

const ROLE_LABELS: Record<Role, string> = {
  GOPA: 'GOPA',
  SELLER: 'Seller',
  RIDER: 'Rider',
  MEPA: 'MEPA',
  BUYER: 'Buyer'
};

const MyAccount: React.FC = () => {
  const { authData, logout, refetchUser } = useAuth();
  // availableRoles comes from the AccountTypeContext so this list stays in
  // lockstep with the context's role-detection rules (any role added via
  // admin or self-registration shows up here without a duplicate gate).
  const { accountType, setAccountType, availableRoles: contextAvailableRoles } = useAccountType();
  const user = authData!.user!;
  const navigate = useNavigate();

  useEffect(() => {
    refetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createdMonthYear = new Date(user.createdAt).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const [showSwitcher, setShowSwitcher] = useState(false);
  // Single source of truth — pulled from context so any role detection
  // change there (e.g. enabling MEPA later) propagates without an edit here.
  const availableRoles = contextAvailableRoles as Role[];

  const allTabs: Array<{ key: TabKey; label: string }> = [
    { key: 'general', label: 'General Profile' },
    user.gopa && { key: 'gopa', label: 'GOPA Profile' },
    user.sellerDetails && { key: 'seller', label: 'Seller Profile' },
    user.sellerDetails && { key: 'sellerDocs', label: 'Seller Documents' },
    user.deliver && { key: 'deliver', label: 'Delivery Profile' },
    user.deliver && { key: 'riderDocs', label: 'Rider Documents' },
    user.mepa && { key: 'mepa', label: 'MEPA Profile' },
    ((user.user_groups?.length ?? 0) > 0 || (user.user_roles?.length ?? 0) > 0) && { key: 'groups', label: 'Groups & Roles' },
    (user.paymentAccounts?.length ?? 0) > 0 && { key: 'payments', label: 'Payment Accounts' },
    { key: 'address', label: 'Addresses' },
    { key: 'wallet', label: 'Wallet' }
  ]
    .filter(Boolean)
    .map((item) => item as { key: TabKey; label: string });

  const filteredTabs = allTabs.filter(({ key }) => {
    if (key === 'general') {
      return true;
    }
    if (accountType === 'GOPA' && (key === 'gopa' || key === 'wallet')) {
      return true;
    }
    if (accountType === 'SELLER' && (key === 'seller' || key === 'sellerDocs' || key === 'wallet')) {
      return true;
    }
    if (accountType === 'RIDER' && (key === 'deliver' || key === 'riderDocs' || key === 'wallet')) {
      return true;
    }
    if (accountType === 'MEPA' && (key === 'mepa' || key === 'wallet')) {
      return true;
    }
    if (accountType === 'BUYER' && (key === 'address' || key === 'payments')) {
      return true;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<TabKey>('general');

  const initials =
    user.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  return (
    <section className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your profile, documents, and settings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/95668339501103956045/registration-selection')}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2.5 px-5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Profile
            </button>
            <button
              onClick={() => navigate('/95668339501103956045/auth/manage-pin')}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2.5 px-5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v2H9v-2c0-1.657 1.343-3 3-3z M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
              </svg>
              Manage PIN
            </button>
            <button
              onClick={() => setShowSwitcher(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-5 rounded-xl shadow-sm hover:opacity-90 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
              Switch Profile
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Sidebar */}
          <aside className="xl:w-[280px] w-full shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              {/* Profile header */}
              <div className="bg-gradient-to-br from-blue to-blue-500 px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-white/70 mt-0.5">Since {createdMonthYear}</p>
                  </div>
                </div>
                {accountType && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                      {ROLE_LABELS[accountType as Role] || accountType}
                    </span>
                  </div>
                )}
              </div>

              {/* Desktop Tabs */}
              <div className="p-3 hidden xl:block">
                <nav className="flex flex-col gap-1">
                  {filteredTabs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`w-full text-left text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-150 ${
                        activeTab === key ? 'bg-blue/10 text-blue' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
                <div className="border-t border-gray-100 mt-3 pt-3">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="xl:hidden p-3">
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="w-full flex justify-between items-center bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl focus:outline-none transition">
                        <span>Menu</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
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
                        <Disclosure.Panel className="mt-2 space-y-1">
                          {filteredTabs.map(({ key, label }) => (
                            <Disclosure.Button
                              key={key}
                              as="button"
                              onClick={() => setActiveTab(key)}
                              className={`block w-full text-left text-sm font-medium px-4 py-2.5 rounded-xl transition ${
                                activeTab === key ? 'bg-blue/10 text-blue' : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {label}
                            </Disclosure.Button>
                          ))}
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <Disclosure.Button
                              as="button"
                              onClick={() => {
                                logout();
                                navigate('/');
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition"
                            >
                              Sign Out
                            </Disclosure.Button>
                          </div>
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 xl:p-10">
              {activeTab === 'general' && <GeneralDetails user={user} />}
              {activeTab === 'gopa' && user.gopa && <GopaProfileTab profile={user.gopa} />}
              {/* MEPA and RIDER tabs hidden for now */}
              {activeTab === 'mepa' && user.mepa && <MepaProfileTab profile={user.mepa} />}
              {activeTab === 'seller' && user.sellerDetails && <SellerDetailsTab details={user.sellerDetails} />}
              {activeTab === 'sellerDocs' && user.sellerDetails && <SellerDocumentsTab />}
              {activeTab === 'deliver' && user.deliver && <DeliverProfileTab deliver={user.deliver} />}
              {activeTab === 'riderDocs' && user.deliver && <RiderDocumentsTab />}
              {activeTab === 'groups' && <GroupsRolesTab groups={user.user_groups ?? []} roles={user.user_roles ?? []} />}
              {activeTab === 'payments' && user.paymentAccounts && <PaymentAccountsTab accounts={user.paymentAccounts} />}
              {activeTab === 'address' && <AddressDetails />}
              {activeTab === 'wallet' &&
                (['SELLER', 'RIDER', 'GOPA', 'MEPA'] as WalletRole[]).includes(accountType as WalletRole) && (
                  <MyWallet role={accountType as WalletRole} />
                )}
            </div>
          </main>
        </div>
      </div>

      {/* Profile Switcher Modal */}
      {showSwitcher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowSwitcher(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[340px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Switch Profile</h3>
              <p className="text-sm text-gray-500 mt-1">Select the account type you want to use</p>
            </div>
            <ul className="space-y-2">
              {availableRoles.map((role) => (
                <li key={role}>
                  <button
                    onClick={() => {
                      setShowSwitcher(false);
                      // BUYER is the default profile every user has — no PIN
                      // required to step down to it. Elevated profiles
                      // (SELLER / RIDER / GOPA / MEPA) go through the PIN gate.
                      if (role === 'BUYER') {
                        setAccountType('BUYER');
                        navigate('/95668339501103956045/home');
                        return;
                      }
                      localStorage.setItem('pendingAccountType', role);
                      navigate('/95668339501103956045/auth/profile-switch-otp');
                    }}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium transition ${
                      accountType === role
                        ? 'bg-blue/10 text-blue border border-blue/20'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <span>{ROLE_LABELS[role]}</span>
                    {accountType === role && <span className="text-xs bg-blue text-white px-2 py-0.5 rounded-full">Current</span>}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowSwitcher(false)}
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyAccount;
