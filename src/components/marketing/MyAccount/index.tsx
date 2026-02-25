import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Disclosure, Transition } from '@headlessui/react';
import {
  ChevronDown,
  User,
  ShieldCheck,
  Store,
  Truck,
  CreditCard,
  MapPin,
  Wallet,
  Users,
  FileText,
  LogOut,
  ArrowRightLeft,
  UserPlus,
} from 'lucide-react';
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
import SellerDocumentsTab from './SellerDocumentsTab';
import RiderDocumentsTab from './RiderDocumentsTab';

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

type Role = 'GOPA' | 'MEPA' | 'SELLER' | 'RIDER' | 'BUYER';

const TAB_ICONS: Record<TabKey, React.ElementType> = {
  general: User,
  gopa: ShieldCheck,
  mepa: Store,
  seller: Store,
  sellerDocs: FileText,
  deliver: Truck,
  riderDocs: FileText,
  groups: Users,
  payments: CreditCard,
  address: MapPin,
  wallet: Wallet,
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] ?? '?').toUpperCase();
};

const MyAccount: React.FC = () => {
  const { authData, logout, refetchUser } = useAuth();
  const { accountType } = useAccountType();
  const user = authData!.user!;
  const navigate = useNavigate();

  useEffect(() => {
    refetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createdMonthYear = new Date(user.createdAt).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [showSwitcher, setShowSwitcher] = useState(false);
  useEffect(() => {
    const roles: Role[] = [];
    if (user.gopa) roles.push('GOPA');
    if (user.mepa) roles.push('MEPA');
    if (user.sellerDetails) roles.push('SELLER');
    if (user.deliver) roles.push('RIDER');
    roles.push('BUYER');
    setAvailableRoles(roles);
  }, [user]);

  const allTabs: Array<{ key: TabKey; label: string }> = [
    { key: 'general', label: 'General Profile' },
    user.gopa && { key: 'gopa', label: 'My GOPA Profile' },
    user.mepa && { key: 'mepa', label: 'My MEPA Profile' },
    user.sellerDetails && { key: 'seller', label: 'My Seller Profile' },
    user.sellerDetails && { key: 'sellerDocs', label: 'Seller Documents' },
    user.deliver && { key: 'deliver', label: 'My Delivery Profile' },
    user.deliver && { key: 'riderDocs', label: 'Rider Documents' },
    ((user.user_groups?.length ?? 0) > 0 || (user.user_roles?.length ?? 0) > 0) && { key: 'groups', label: 'Groups/Roles' },
    (user.paymentAccounts?.length ?? 0) > 0 && { key: 'payments', label: 'My Payment Accounts' },
    { key: 'address', label: 'My Addresses' },
    { key: 'wallet', label: 'My Wallet' },
  ]
    .filter(Boolean)
    .map((item) => item as { key: TabKey; label: string });

  const filteredTabs = allTabs.filter(({ key }) => {
    if (key === 'general') return true;
    if (accountType === 'GOPA' && key === 'gopa') return true;
    if (accountType === 'MEPA' && key === 'mepa') return true;
    if (accountType === 'SELLER' && (key === 'seller' || key === 'sellerDocs' || key === 'wallet')) return true;
    if (accountType === 'RIDER' && (key === 'deliver' || key === 'riderDocs')) return true;
    if (accountType === 'BUYER' && (key === 'address' || key === 'payments')) return true;
    return false;
  });

  const [activeTab, setActiveTab] = useState<TabKey>('general');

  return (
    <section className="py-10 sm:py-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Top action buttons */}
        <div className="flex justify-end mb-6 gap-3">
          <button
            onClick={() => navigate('/95668339501103956045/registration-selection')}
            className="inline-flex items-center gap-2 bg-white text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
          >
            <UserPlus className="h-4 w-4" />
            Add Profile
          </button>
          <button
            onClick={() => setShowSwitcher(true)}
            className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Switch Profile
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Sidebar */}
          <aside className="xl:w-[300px] w-full shrink-0">
            <div className="bg-white rounded-2xl shadow-1 border border-gray-3 sticky top-24">
              {/* Sidebar header */}
              <div className="flex items-center gap-3.5 py-5 px-6 border-b border-gray-3">
                <div className="flex-shrink-0 h-11 w-11 rounded-full bg-blue-light-5 flex items-center justify-center">
                  <span className="text-blue font-semibold text-base">{getInitials(user.name)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">{user.name}</p>
                  <p className="text-xs text-dark-4 mt-0.5">Member since {createdMonthYear}</p>
                </div>
              </div>

              {/* Desktop tabs */}
              <div className="p-4 hidden xl:block">
                <div className="flex flex-col gap-1">
                  {filteredTabs.map(({ key, label }) => {
                    const Icon = TAB_ICONS[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`w-full text-left flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 text-sm font-medium ${
                          activeTab === key
                            ? 'bg-blue text-white'
                            : 'text-dark-2 hover:bg-blue-light-5 hover:text-blue'
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                        {label}
                      </button>
                    );
                  })}
                  <div className="border-t border-gray-3 mt-3 pt-3">
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 font-medium text-sm rounded-xl border border-red-200 hover:bg-red-100 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile tabs */}
              <div className="xl:hidden px-4 py-3">
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="w-full flex justify-between items-center bg-blue text-white text-sm font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/30 transition">
                        <span>Menu</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
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
                          {filteredTabs.map(({ key, label }) => {
                            const Icon = TAB_ICONS[key];
                            return (
                              <Disclosure.Button
                                key={key}
                                as="button"
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                  activeTab === key
                                    ? 'bg-blue text-white'
                                    : 'text-dark-2 hover:bg-blue-light-5 hover:text-blue'
                                }`}
                              >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                {label}
                              </Disclosure.Button>
                            );
                          })}
                          <div className="border-t border-gray-3 mt-2 pt-2">
                            <Disclosure.Button
                              as="button"
                              onClick={() => { logout(); navigate('/'); }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 font-medium text-sm rounded-xl border border-red-200 hover:bg-red-100 transition-colors duration-200"
                            >
                              <LogOut className="h-4 w-4" />
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

          {/* Main content */}
          <main className="xl:flex-1 w-full min-w-0">
            <div className="bg-white rounded-2xl shadow-1 border border-gray-3 py-8 px-6 sm:px-8 xl:px-10">
              {activeTab === 'general' && <GeneralDetails user={user} />}
              {activeTab === 'gopa' && user.gopa && <GopaProfileTab profile={user.gopa} />}
              {activeTab === 'mepa' && user.mepa && <MepaProfileTab profile={user.mepa} />}
              {activeTab === 'seller' && user.sellerDetails && <SellerDetailsTab details={user.sellerDetails} />}
              {activeTab === 'sellerDocs' && user.sellerDetails && <SellerDocumentsTab />}
              {activeTab === 'deliver' && user.deliver && <DeliverProfileTab deliver={user.deliver} />}
              {activeTab === 'riderDocs' && user.deliver && <RiderDocumentsTab />}
              {activeTab === 'groups' && <GroupsRolesTab groups={user.user_groups ?? []} roles={user.user_roles ?? []} />}
              {activeTab === 'payments' && user.paymentAccounts && <PaymentAccountsTab accounts={user.paymentAccounts} />}
              {activeTab === 'address' && <AddressDetails />}
              {activeTab === 'wallet' && user.sellerDetails && <WalletDetails />}
            </div>
          </main>
        </div>
      </div>

      {/* Profile switcher modal */}
      {showSwitcher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm"
          onClick={() => setShowSwitcher(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-3 p-8 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
                <ArrowRightLeft className="h-5 w-5 text-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark">Switch Profile</h3>
                <p className="text-xs text-dark-4">Select the account type to switch to</p>
              </div>
            </div>

            <ul className="space-y-2">
              {availableRoles.map((role) => {
                const isActive = accountType === role;
                return (
                  <li key={role}>
                    <button
                      onClick={() => {
                        localStorage.setItem('pendingAccountType', role);
                        setShowSwitcher(false);
                        navigate('/95668339501103956045/auth/profile-switch-otp');
                      }}
                      className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-light-5 text-blue border border-blue/20'
                          : 'bg-gray-1 text-dark-2 border border-gray-3 hover:bg-gray-2'
                      }`}
                    >
                      <span>{role}</span>
                      {isActive && (
                        <span className="text-[10px] bg-blue text-white px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={() => setShowSwitcher(false)}
              className="mt-5 w-full py-2.5 text-sm font-medium text-dark-4 hover:text-dark transition-colors"
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
