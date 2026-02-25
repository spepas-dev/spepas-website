// src/components/role-homes/GopaHome.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth";
import RequestList from "@/components/gopa/RequestList";
import {
  getGOPAAssignedActiveRequestsAPI,
  getGOPAAssignedRequestHistoryAPI,
  getGOPAUnassignedActiveRequestsAPI,
  getGOPAUnassignedRequestHistoryAPI,
} from "@/lib/orderBidsApis";
import GopaInvoicesPanel from "./GopaInvoicesPanel";
import SpepasLoader from "@/components/common/SpepasLoader";
import {
  ShieldCheck,
  RefreshCw,
  ClipboardList,
  Inbox,
  AlertTriangle,
} from "lucide-react";

type TabKey =
  | "ASSIGNED_ACTIVE"
  | "ASSIGNED_HISTORY"
  | "UNASSIGNED_ACTIVE"
  | "UNASSIGNED_HISTORY";

const TABS: { key: TabKey; label: string }[] = [
  { key: "ASSIGNED_ACTIVE", label: "Assigned (Active)" },
  { key: "ASSIGNED_HISTORY", label: "Assigned (History)" },
  { key: "UNASSIGNED_ACTIVE", label: "Unassigned (Active)" },
  { key: "UNASSIGNED_HISTORY", label: "Unassigned (History)" },
];

const EMPTY_MESSAGES: Record<TabKey, string> = {
  ASSIGNED_ACTIVE: "No active requests assigned to you.",
  ASSIGNED_HISTORY: "No assignment history found.",
  UNASSIGNED_ACTIVE: "No unassigned active requests found.",
  UNASSIGNED_HISTORY: "No unassigned request history found.",
};

const GopaHome: React.FC<{ name: string; gopaId?: string }> = ({
  name,
  gopaId,
}) => {
  const { authData } = useAuth();
  const effectiveGopaId = gopaId ?? authData?.user?.gopa?.Gopa_ID ?? null;

  const [activeTab, setActiveTab] = useState<TabKey>("ASSIGNED_ACTIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cache, setCache] = useState<Record<TabKey, any[]>>({
    ASSIGNED_ACTIVE: [],
    ASSIGNED_HISTORY: [],
    UNASSIGNED_ACTIVE: [],
    UNASSIGNED_HISTORY: [],
  });

  const fetcher = useMemo(
    () => ({
      ASSIGNED_ACTIVE: (user_id: string) =>
        getGOPAAssignedActiveRequestsAPI({ user_id }),
      ASSIGNED_HISTORY: (user_id: string) =>
        getGOPAAssignedRequestHistoryAPI({ user_id }),
      UNASSIGNED_ACTIVE: (user_id: string) =>
        getGOPAUnassignedActiveRequestsAPI({ user_id }),
      UNASSIGNED_HISTORY: (user_id: string) =>
        getGOPAUnassignedRequestHistoryAPI({ user_id }),
    }),
    []
  );

  const load = async (tab: TabKey, force = false) => {
    if (!effectiveGopaId) return;
    if (!force && cache[tab].length) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher[tab](effectiveGopaId);
      const data = Array.isArray(res?.data) ? res.data : res;
      setCache((prev) => ({ ...prev, [tab]: data ?? [] }));
    } catch (e: any) {
      setError(e?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveGopaId) load(activeTab);
  }, [activeTab, effectiveGopaId]);

  /* ---- No GOPA profile guard ---- */
  if (!effectiveGopaId) {
    return (
      <section className="bg-gray-1 min-h-screen pt-24 pb-10 sm:pt-28 sm:pb-16">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          {/* Page header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-dark">GOPA Dashboard</h1>
              <p className="text-sm text-dark-4">Manage requests and invoices</p>
            </div>
          </div>

          {/* Empty state */}
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-12 w-12 rounded-xl bg-blue-light-5 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-blue" />
              </div>
              <p className="text-base font-medium text-dark mb-1">
                Hi {name},
              </p>
              <p className="text-sm text-dark-4">
                No GOPA profile found. Please contact support.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-1 min-h-screen pt-24 pb-10 sm:pt-28 sm:pb-16">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-dark">GOPA Dashboard</h1>
            <p className="text-sm text-dark-4">
              Manage requests and invoices
            </p>
          </div>
        </div>

        {/* ---------- Requests section ---------- */}
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6 mb-6">
          {/* Section title */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-8 w-8 rounded-lg bg-blue-light-5 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-blue" />
            </div>
            <h2 className="text-base font-semibold text-dark">
              Request Management
            </h2>
          </div>

          {/* Tabs row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={
                  activeTab === t.key
                    ? "bg-blue text-white font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200"
                    : "bg-white text-dark-2 font-medium text-sm py-2 px-4 rounded-lg border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
                }
              >
                {t.label}
              </button>
            ))}

            <button
              onClick={() => load(activeTab, true)}
              className="ml-auto inline-flex items-center gap-1.5 bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <SpepasLoader size="md" label="Loading requests..." fullSection />
          ) : error ? (
            <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-sm font-medium text-dark mb-1">
                  Something went wrong
                </p>
                <p className="text-sm text-dark-4 text-center max-w-sm">
                  {error}
                </p>
                <button
                  onClick={() => load(activeTab, true)}
                  className="mt-4 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : cache[activeTab]?.length ? (
            <RequestList requests={cache[activeTab]} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-12 w-12 rounded-xl bg-blue-light-5 flex items-center justify-center mb-4">
                <Inbox className="h-6 w-6 text-blue" />
              </div>
              <p className="text-sm font-medium text-dark mb-1">
                No requests found
              </p>
              <p className="text-sm text-dark-4 text-center max-w-sm">
                {EMPTY_MESSAGES[activeTab]}
              </p>
            </div>
          )}
        </div>

        {/* ---------- Invoices section ---------- */}
        <GopaInvoicesPanel />
      </div>
    </section>
  );
};

export default GopaHome;
