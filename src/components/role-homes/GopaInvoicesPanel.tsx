// src/components/role-homes/GopaInvoicesPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  getInvoicesForGopaToAccept,
  acceptInvoiceByGopa,
  getGopaAcceptedInvoices,
  getGopaAcceptedInvoiceDetails,
  getGopaAcceptedInvoiceItemDetails,
} from "@/lib/gopaInvoiceApis";
import SpepasLoader from "@/components/common/SpepasLoader";
import {
  FileText,
  RefreshCw,
  Inbox,
  AlertTriangle,
  CheckCircle,
  Hash,
  ChevronRight,
  Receipt,
  Package,
  CircleDollarSign,
  Keyboard,
} from "lucide-react";

type InvTab = "TO_ACCEPT" | "ACCEPTED" | "ACCEPT_BY_ID";

const INV_TABS: { key: InvTab; label: string; icon: React.ReactNode }[] = [
  {
    key: "TO_ACCEPT",
    label: "To Accept",
    icon: <Receipt className="h-3.5 w-3.5" />,
  },
  {
    key: "ACCEPTED",
    label: "Accepted",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  {
    key: "ACCEPT_BY_ID",
    label: "Accept by ID",
    icon: <Keyboard className="h-3.5 w-3.5" />,
  },
];

const GopaInvoicesPanel: React.FC = () => {
  const [tab, setTab] = useState<InvTab>("TO_ACCEPT");

  // data caches
  const [toAccept, setToAccept] = useState<any[]>([]);
  const [accepted, setAccepted] = useState<any[]>([]);
  const [invoiceDetails, setInvoiceDetails] = useState<any | null>(null);
  const [itemDetails, setItemDetails] = useState<any | null>(null);

  // ui state
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // accept-by-id form
  const [acceptingId, setAcceptingId] = useState("");
  const [acceptingBusy, setAcceptingBusy] = useState(false);

  const loaders = useMemo(
    () => ({
      TO_ACCEPT: async () => {
        const res = await getInvoicesForGopaToAccept();
        setToAccept(Array.isArray(res?.data) ? res.data : res ?? []);
      },
      ACCEPTED: async () => {
        const res = await getGopaAcceptedInvoices();
        setAccepted(Array.isArray(res?.data) ? res.data : res ?? []);
      },
    }),
    []
  );

  const loadTab = async (force = false) => {
    setErr(null);
    if (!force) {
      if (tab === "TO_ACCEPT" && toAccept.length) return;
      if (tab === "ACCEPTED" && accepted.length) return;
      if (tab === "ACCEPT_BY_ID") return;
    }
    setLoading(true);
    try {
      await loaders[tab as "TO_ACCEPT" | "ACCEPTED"]?.();
    } catch (e: any) {
      setErr(e?.message || "Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTab();
    // clear details when switching tabs
    setInvoiceDetails(null);
    setItemDetails(null);
  }, [tab]);

  const refreshAll = async () => {
    await Promise.all([loaders.TO_ACCEPT?.(), loaders.ACCEPTED?.()]);
  };

  const handleAccept = async (id: string) => {
    await acceptInvoiceByGopa({ invoice_id: id });
    await refreshAll();
  };

  const openInvoiceDetails = async (invoice_id: string) => {
    setLoading(true);
    setErr(null);
    setItemDetails(null);
    try {
      const res = await getGopaAcceptedInvoiceDetails(invoice_id);
      setInvoiceDetails(res?.data ?? res);
      setTab("ACCEPTED");
    } catch (e: any) {
      setErr(e?.message || "Failed to load invoice details.");
    } finally {
      setLoading(false);
    }
  };

  const openItemDetails = async (item_id: string) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getGopaAcceptedInvoiceItemDetails(item_id);
      setItemDetails(res?.data ?? res);
    } catch (e: any) {
      setErr(e?.message || "Failed to load item details.");
    } finally {
      setLoading(false);
    }
  };

  const submitAcceptById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingId.trim()) return;
    setAcceptingBusy(true);
    try {
      await acceptInvoiceByGopa({ invoice_id: acceptingId.trim() });
      setAcceptingId("");
      await refreshAll();
      setTab("ACCEPTED");
    } finally {
      setAcceptingBusy(false);
    }
  };

  /* ---------- Status badge helper ---------- */
  const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    const label = status || "Unknown";
    let colorClasses = "bg-gray-1 text-dark-4";
    const lower = label.toLowerCase();
    if (lower.includes("accept") || lower.includes("paid")) {
      colorClasses = "bg-green-50 text-green-700";
    } else if (lower.includes("pending") || lower.includes("waiting")) {
      colorClasses = "bg-amber-50 text-amber-700";
    } else if (lower.includes("reject") || lower.includes("cancel")) {
      colorClasses = "bg-red-50 text-red-600";
    }
    return (
      <span
        className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${colorClasses}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 sm:p-6">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8 w-8 rounded-lg bg-blue-light-5 flex items-center justify-center">
          <FileText className="h-4 w-4 text-blue" />
        </div>
        <h2 className="text-base font-semibold text-dark">
          Invoice Management
        </h2>
      </div>

      {/* Tabs row */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {INV_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              tab === t.key
                ? "inline-flex items-center gap-1.5 bg-blue text-white font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200"
                : "inline-flex items-center gap-1.5 bg-white text-dark-2 font-medium text-sm py-2 px-4 rounded-lg border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
            }
          >
            {t.icon}
            {t.label}
          </button>
        ))}

        {tab !== "ACCEPT_BY_ID" && (
          <button
            onClick={() => loadTab(true)}
            className="ml-auto inline-flex items-center gap-1.5 bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        )}
      </div>

      {/* Error banner */}
      {err && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{err}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <SpepasLoader size="md" label="Loading invoices..." fullSection />
      )}

      {/* ==================== TO ACCEPT ==================== */}
      {tab === "TO_ACCEPT" && !loading && (
        <>
          {toAccept.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-12 w-12 rounded-xl bg-blue-light-5 flex items-center justify-center mb-4">
                <Inbox className="h-6 w-6 text-blue" />
              </div>
              <p className="text-sm font-medium text-dark mb-1">
                No invoices to accept
              </p>
              <p className="text-sm text-dark-4">
                New invoices will appear here when available.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {toAccept.map((inv) => (
                <div
                  key={inv.invoice_id}
                  className="bg-white rounded-2xl border border-gray-3 shadow-1 hover:shadow-2 transition-shadow p-4"
                >
                  {/* Top row: ID + status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-light-5 flex items-center justify-center shrink-0">
                        <Hash className="h-4 w-4 text-blue" />
                      </div>
                      <span className="text-sm font-semibold text-dark truncate">
                        #{inv.invoice_id}
                      </span>
                    </div>
                    <StatusBadge status={inv.statusMessage} />
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2 mb-4">
                    <CircleDollarSign className="h-4 w-4 text-dark-4" />
                    <span className="text-sm text-dark-2 font-medium">
                      GH&#8373; {inv.total_amount}
                    </span>
                  </div>

                  {/* Accept button */}
                  <button
                    onClick={() => handleAccept(inv.invoice_id)}
                    className="w-full bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
                  >
                    Accept Invoice
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ==================== ACCEPTED ==================== */}
      {tab === "ACCEPTED" && !loading && (
        <>
          {accepted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-12 w-12 rounded-xl bg-blue-light-5 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue" />
              </div>
              <p className="text-sm font-medium text-dark mb-1">
                No accepted invoices
              </p>
              <p className="text-sm text-dark-4">
                Invoices you accept will appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-5 gap-4">
              {/* Invoice list - left pane */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-3 bg-gray-1">
                  <h3 className="text-sm font-semibold text-dark">
                    Accepted Invoices
                  </h3>
                </div>
                <ul className="max-h-[400px] overflow-auto divide-y divide-gray-3">
                  {accepted.map((inv) => (
                    <li key={inv.invoice_id}>
                      <button
                        onClick={() => openInvoiceDetails(inv.invoice_id)}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between gap-2 hover:bg-gray-1 transition-colors duration-150 ${
                          invoiceDetails?.invoice_id === inv.invoice_id
                            ? "bg-blue-light-5"
                            : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-dark truncate">
                            #{inv.invoice_id}
                          </p>
                          <p className="text-xs text-dark-4">
                            GH&#8373; {inv.total_amount}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-dark-4 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Details - right pane */}
              <div className="md:col-span-3 bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-3 bg-gray-1">
                  <h3 className="text-sm font-semibold text-dark">
                    Invoice Details
                  </h3>
                </div>

                {invoiceDetails ? (
                  <div className="p-4">
                    {/* Invoice summary */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center shrink-0">
                        <FileText className="h-4.5 w-4.5 text-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark">
                          Invoice #{invoiceDetails.invoice_id}
                        </p>
                        <p className="text-xs text-dark-4 mt-0.5">
                          Total: GH&#8373; {invoiceDetails.total_amount}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <StatusBadge status={invoiceDetails.statusMessage} />
                      </div>
                    </div>

                    {/* Items list */}
                    {invoiceDetails.items?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-dark-4 uppercase tracking-wider mb-2">
                          Line Items
                        </p>
                        <div className="space-y-2">
                          {invoiceDetails.items.map((it: any) => (
                            <button
                              key={it.item_id}
                              onClick={() => openItemDetails(it.item_id)}
                              className={`w-full text-left flex items-center justify-between gap-2 p-3 rounded-xl border transition-colors duration-150 ${
                                itemDetails?.item_id === it.item_id
                                  ? "border-blue bg-blue-light-5"
                                  : "border-gray-3 hover:bg-gray-1"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Package className="h-4 w-4 text-dark-4 shrink-0" />
                                <span className="text-sm text-dark truncate">
                                  {it.item_id}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-dark-2 shrink-0">
                                GH&#8373; {it.total_amount}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Item detail expand */}
                    {itemDetails && (
                      <div className="mt-4 pt-4 border-t border-gray-3">
                        <p className="text-xs font-semibold text-dark-4 uppercase tracking-wider mb-3">
                          Item Detail
                        </p>
                        <div className="bg-gray-1 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-dark-4">
                              Item ID
                            </span>
                            <span className="text-sm font-medium text-dark">
                              {itemDetails.item_id}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-dark-4">
                              Quantity
                            </span>
                            <span className="text-sm font-medium text-dark">
                              {itemDetails.total_items}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-dark-4">
                              Amount
                            </span>
                            <span className="text-sm font-medium text-dark">
                              GH&#8373; {itemDetails.total_amount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-dark-4">
                              Status
                            </span>
                            <StatusBadge status={itemDetails.statusMessage} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center mb-3">
                      <FileText className="h-5 w-5 text-blue" />
                    </div>
                    <p className="text-sm text-dark-4">
                      Select an invoice to view details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== ACCEPT BY ID ==================== */}
      {tab === "ACCEPT_BY_ID" && !loading && (
        <div className="flex flex-col items-center py-10 px-4">
          <div className="w-full max-w-md">
            {/* Form header */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center">
                <Keyboard className="h-4.5 w-4.5 text-blue" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-dark">
                  Accept Invoice by ID
                </h3>
                <p className="text-xs text-dark-4">
                  Enter an invoice ID to accept it directly.
                </p>
              </div>
            </div>

            <form onSubmit={submitAcceptById}>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Invoice ID
              </label>
              <input
                type="text"
                value={acceptingId}
                onChange={(e) => setAcceptingId(e.target.value)}
                required
                placeholder="e.g. INV-00123"
                className="w-full border border-gray-3 rounded-xl px-4 py-2.5 text-sm text-dark placeholder:text-dark-4 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={acceptingBusy}
                className="mt-4 w-full bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {acceptingBusy ? "Processing..." : "Accept Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GopaInvoicesPanel;
