/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/role-homes/GopaHome.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useQueries } from '@tanstack/react-query';

import SpepasLoader from '@/components/common/SpepasLoader';
import RequestList from '@/components/gopa/RequestList';
import { useAuth } from '@/features/auth';
import {
  getGOPAAssignedActiveRequestsAPI,
  getGOPAAssignedRequestHistoryAPI,
  getGOPAUnassignedActiveRequestsAPI,
  getGOPAUnassignedRequestHistoryAPI,
  getRequestBidsAllAPI
} from '@/lib/orderBidsApis';

import GopaInvoicesPanel from './GopaInvoicesPanel';

type TabKey = 'ASSIGNED_ACTIVE' | 'ASSIGNED_HISTORY' | 'UNASSIGNED_ACTIVE' | 'UNASSIGNED_HISTORY';

const TABS: { key: TabKey; label: string; emptyMsg: string }[] = [
  { key: 'ASSIGNED_ACTIVE', label: 'Active', emptyMsg: 'No active requests assigned to you.' },
  { key: 'ASSIGNED_HISTORY', label: 'History', emptyMsg: 'No assignment history found.' },
  { key: 'UNASSIGNED_ACTIVE', label: 'Active', emptyMsg: 'No unassigned active requests.' },
  { key: 'UNASSIGNED_HISTORY', label: 'History', emptyMsg: 'No unassigned request history.' }
];

const STALE_TIME = 10 * 60_000; // 10 minutes — data stays fresh, manual refresh to update

const fetchers: Record<TabKey, (user_id: string) => Promise<any>> = {
  ASSIGNED_ACTIVE: (user_id) => getGOPAAssignedActiveRequestsAPI({ user_id }),
  ASSIGNED_HISTORY: (user_id) => getGOPAAssignedRequestHistoryAPI({ user_id }),
  UNASSIGNED_ACTIVE: (user_id) => getGOPAUnassignedActiveRequestsAPI({ user_id }),
  UNASSIGNED_HISTORY: (user_id) => getGOPAUnassignedRequestHistoryAPI({ user_id }),
};

const GopaHome: React.FC<{ name: string; gopaId?: string }> = ({ name, gopaId }) => {
  const navigate = useNavigate();
  const { authData } = useAuth();
  const effectiveGopaId = gopaId ?? authData?.user?.gopa?.User_ID ?? null;
  const specialties = authData?.user?.gopa?.Specialties ?? [];

  const [section, setSection] = useState<'assigned' | 'unassigned'>('assigned');
  const [subTab, setSubTab] = useState<'active' | 'history'>('active');

  const activeTab: TabKey =
    section === 'assigned'
      ? subTab === 'active' ? 'ASSIGNED_ACTIVE' : 'ASSIGNED_HISTORY'
      : subTab === 'active' ? 'UNASSIGNED_ACTIVE' : 'UNASSIGNED_HISTORY';

  // ── Fetch requests for the active tab ──────────────────────────
  const requestsQuery = useQuery({
    queryKey: ['gopa-requests', activeTab, effectiveGopaId],
    queryFn: () => fetchers[activeTab](effectiveGopaId!),
    enabled: !!effectiveGopaId,
    staleTime: STALE_TIME,
    select: (res) => {
      const data: any[] = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      // Deduplicate by request_ID
      const seen = new Map<string, any>();
      for (const item of data) {
        const reqId = item.orderRequest?.request_ID ?? item.request_ID ?? item.request_id;
        if (reqId && !seen.has(reqId)) seen.set(reqId, item);
      }
      return Array.from(seen.entries()); // [reqId, request][]
    },
  });

  // Also prefetch assigned active count for the tab badge (even when on a different tab)
  const assignedActiveQuery = useQuery({
    queryKey: ['gopa-requests', 'ASSIGNED_ACTIVE', effectiveGopaId],
    queryFn: () => fetchers.ASSIGNED_ACTIVE(effectiveGopaId!),
    enabled: !!effectiveGopaId && activeTab !== 'ASSIGNED_ACTIVE',
    staleTime: STALE_TIME,
    select: (res) => {
      const data: any[] = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const seen = new Set<string>();
      for (const item of data) {
        const reqId = item.orderRequest?.request_ID ?? item.request_ID ?? item.request_id;
        if (reqId) seen.add(reqId);
      }
      return seen.size;
    },
  });

  const unassignedActiveQuery = useQuery({
    queryKey: ['gopa-requests', 'UNASSIGNED_ACTIVE', effectiveGopaId],
    queryFn: () => fetchers.UNASSIGNED_ACTIVE(effectiveGopaId!),
    enabled: !!effectiveGopaId && activeTab !== 'UNASSIGNED_ACTIVE',
    staleTime: STALE_TIME,
    select: (res) => {
      const data: any[] = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const seen = new Set<string>();
      for (const item of data) {
        const reqId = item.orderRequest?.request_ID ?? item.request_ID ?? item.request_id;
        if (reqId) seen.add(reqId);
      }
      return seen.size;
    },
  });

  const groupedRequests = requestsQuery.data ?? [];

  // ── Fetch real bid counts per request ──────────────────────────
  const bidCountQueries = useQueries({
    queries: groupedRequests.map(([reqId]) => ({
      queryKey: ['request-bids', reqId],
      queryFn: () => getRequestBidsAllAPI({ request_id: reqId }),
      staleTime: STALE_TIME,
        select: (res: any) => {
        const bids: any[] = Array.isArray(res?.data) ? res.data : [];
        return { total: bids.length, submitted: bids.filter((b: any) => b.status === 1).length };
      },
    })),
  });

  // Build final data with bid counts
  const currentData = useMemo(
    () =>
      groupedRequests.map(([, request], i) => ({
        ...request,
        _totalBids: bidCountQueries[i]?.data?.total ?? 0,
        _submittedBids: bidCountQueries[i]?.data?.submitted ?? 0,
        _bidCountsLoaded: bidCountQueries[i]?.isSuccess ?? false,
      })),
    [groupedRequests, bidCountQueries]
  );

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const loading = requestsQuery.isLoading;
  const error = requestsQuery.error;

  // Tab badge counts
  const assignedActiveCount = activeTab === 'ASSIGNED_ACTIVE'
    ? groupedRequests.length
    : (assignedActiveQuery.data ?? 0);
  const unassignedActiveCount = activeTab === 'UNASSIGNED_ACTIVE'
    ? groupedRequests.length
    : (unassignedActiveQuery.data ?? 0);

  if (!effectiveGopaId) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <p className="font-medium text-gray-700 mb-1">Hi {name},</p>
          <p className="text-sm text-gray-500">No GOPA profile found. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {name}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your spare part requests and seller assignments</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/95668339501103956045/gopa/wallet')}
          className="shrink-0 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          My Wallet
        </button>
      </div>
      <div className="mb-8">
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {specialties.map((s: string) => (
              <span key={s} className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Requests ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">
        {/* Section toggle */}
        <div className="border-b border-gray-100 px-5 pt-4">
          <div className="flex gap-6">
            <button
              onClick={() => setSection('assigned')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                section === 'assigned' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Assigned Requests
              {assignedActiveCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-semibold">
                  {assignedActiveCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setSection('unassigned')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                section === 'unassigned' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Unassigned Requests
              {unassignedActiveCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold">
                  {unassignedActiveCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sub-tabs + refresh */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => setSubTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                subTab === 'active' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setSubTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                subTab === 'history' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              History
            </button>
          </div>
          <button
            onClick={() => requestsQuery.refetch()}
            disabled={requestsQuery.isFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${requestsQuery.isFetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {loading ? (
            <SpepasLoader className="py-12 flex items-center justify-center" />
          ) : error ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-sm text-red-600 font-medium">{(error as Error).message || 'Failed to load requests.'}</p>
              <button onClick={() => requestsQuery.refetch()} className="mt-2 text-xs text-indigo-500 hover:underline">
                Try again
              </button>
            </div>
          ) : currentData.length > 0 ? (
            <RequestList requests={currentData} />
          ) : (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">{currentTab.emptyMsg}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Invoices ───────────────────────────────────────────── */}
      <GopaInvoicesPanel />
    </div>
  );
};

export default GopaHome;
