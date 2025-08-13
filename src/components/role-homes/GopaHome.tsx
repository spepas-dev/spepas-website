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

const GopaHome: React.FC<{ name: string; gopaId?: string }> = ({ name, gopaId }) => {
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

  if (!effectiveGopaId) {
    return (
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0 py-6">
        <h1 className="text-2xl font-semibold mb-3">Home</h1>
        <div className="bg-white border rounded-xl p-6">
          <p className="mb-2 font-medium">Hi {name},</p>
          <p className="text-gray-600">No GOPA profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0 py-6 pt-20">
      <h1 className="text-2xl font-semibold mb-5">Home</h1>

      {/* ---------- Requests section (tabs) ---------- */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-2 rounded-lg text-sm ${
                activeTab === t.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto">
            <button
              onClick={() => load(activeTab, true)}
              className="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading…</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : cache[activeTab]?.length ? (
          <RequestList requests={cache[activeTab]} />
        ) : (
          <div className="p-6 text-sm text-gray-500">
            {activeTab === "ASSIGNED_ACTIVE" && "No active requests assigned to you."}
            {activeTab === "ASSIGNED_HISTORY" && "No assignment history found."}
            {activeTab === "UNASSIGNED_ACTIVE" && "No unassigned active requests found."}
            {activeTab === "UNASSIGNED_HISTORY" && "No unassigned request history found."}
          </div>
        )}
      </div>

      {/* ---------- Invoices section (own tabs) ---------- */}
      <GopaInvoicesPanel />

      <p className="text-xs text-gray-500 mt-6">
        Signed in as <span className="font-medium">{name}</span> (GOPA #{effectiveGopaId})
      </p>
    </div>
  );
};

export default GopaHome;
