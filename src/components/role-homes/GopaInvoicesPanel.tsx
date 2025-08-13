// src/components/role-homes/GopaInvoicesPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  getInvoicesForGopaToAccept,
  acceptInvoiceByGopa,
  getGopaAcceptedInvoices,
  getGopaAcceptedInvoiceDetails,
  getGopaAcceptedInvoiceItemDetails,
} from "@/lib/gopaInvoiceApis";

type InvTab = "TO_ACCEPT" | "ACCEPTED" | "ACCEPT_BY_ID";

const INV_TABS: { key: InvTab; label: string }[] = [
  { key: "TO_ACCEPT", label: "To Accept" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "ACCEPT_BY_ID", label: "Accept by ID" },
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
    // clear details when switching lists
    setInvoiceDetails(null);
    setItemDetails(null);
  }, [tab]);

  const refreshAll = async () => {
    await Promise.all([
      loaders.TO_ACCEPT?.(),
      loaders.ACCEPTED?.(),
    ]);
  };

  const handleAccept = async (id: string) => {
    await acceptInvoiceByGopa({ invoice_id: id });
    // move it from "to accept" to "accepted"
    await refreshAll();
  };

  const openInvoiceDetails = async (invoice_id: string) => {
    setLoading(true);
    setErr(null);
    setItemDetails(null);
    try {
      const res = await getGopaAcceptedInvoiceDetails(invoice_id);
      setInvoiceDetails(res?.data ?? res);
      setTab("ACCEPTED"); // ensure we're on Accepted
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {INV_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 rounded-lg text-sm ${
              tab === t.key
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
        {tab !== "ACCEPT_BY_ID" && (
          <button
            onClick={() => loadTab(true)}
            className="ml-auto px-3 py-2 rounded-lg text-sm border hover:bg-gray-50"
          >
            Refresh
          </button>
        )}
      </div>

      {err && <div className="p-3 text-sm text-red-600">{err}</div>}
      {loading && <div className="p-3 text-sm text-gray-500">Loading…</div>}

      {/* -------------------- TO ACCEPT -------------------- */}
      {tab === "TO_ACCEPT" && !loading && (
        <>
          {toAccept.length === 0 ? (
            <p className="text-sm text-gray-500 p-3">No invoices to accept.</p>
          ) : (
            <>
              {/* Table for md+ */}
              <div className="hidden md:block">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left text-sm">
                      <th className="border px-3 py-2">Invoice ID</th>
                      <th className="border px-3 py-2">Total Amount</th>
                      <th className="border px-3 py-2">Status</th>
                      <th className="border px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toAccept.map((inv) => (
                      <tr key={inv.invoice_id} className="text-sm">
                        <td className="border px-3 py-2">{inv.invoice_id}</td>
                        <td className="border px-3 py-2">GH₵ {inv.total_amount}</td>
                        <td className="border px-3 py-2">{inv.statusMessage}</td>
                        <td className="border px-3 py-2">
                          <button
                            onClick={() => handleAccept(inv.invoice_id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards for mobile */}
              <div className="grid gap-3 md:hidden">
                {toAccept.map((inv) => (
                  <div key={inv.invoice_id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">#{inv.invoice_id}</div>
                      <div className="text-sm text-gray-500">{inv.statusMessage}</div>
                    </div>
                    <div className="text-sm mt-1">GH₵ {inv.total_amount}</div>
                    <button
                      onClick={() => handleAccept(inv.invoice_id)}
                      className="mt-3 w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* -------------------- ACCEPTED -------------------- */}
      {tab === "ACCEPTED" && !loading && (
        <>
          {accepted.length === 0 ? (
            <p className="text-sm text-gray-500 p-3">No accepted invoices found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {/* list */}
              <div className="border rounded-lg">
                <div className="px-3 py-2 border-b font-medium">Accepted Invoices</div>
                <ul className="max-h-[380px] overflow-auto divide-y">
                  {accepted.map((inv) => (
                    <li key={inv.invoice_id} className="p-3">
                      <button
                        onClick={() => openInvoiceDetails(inv.invoice_id)}
                        className="text-left w-full hover:underline"
                      >
                        #{inv.invoice_id} — GH₵ {inv.total_amount}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* details */}
              <div className="border rounded-lg">
                <div className="px-3 py-2 border-b font-medium">Details</div>
                {invoiceDetails ? (
                  <div className="p-3 text-sm">
                    <div className="font-semibold mb-1">
                      Invoice {invoiceDetails.invoice_id}
                    </div>
                    <div>Total Amount: GH₵ {invoiceDetails.total_amount}</div>
                    <div>Status: {invoiceDetails.statusMessage}</div>

                    <div className="mt-3 font-medium">Items</div>
                    <ul className="divide-y mt-1">
                      {invoiceDetails.items?.map((it: any) => (
                        <li key={it.item_id} className="py-2">
                          <button
                            onClick={() => openItemDetails(it.item_id)}
                            className="text-blue-600 hover:underline"
                          >
                            {it.item_id} — GH₵ {it.total_amount}
                          </button>
                        </li>
                      ))}
                    </ul>

                    {itemDetails && (
                      <div className="mt-4 border-t pt-3">
                        <div className="font-medium">Item {itemDetails.item_id}</div>
                        <div>Quantity: {itemDetails.total_items}</div>
                        <div>Amount: GH₵ {itemDetails.total_amount}</div>
                        <div>Status: {itemDetails.statusMessage}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 text-sm text-gray-500">
                    Select an invoice to view details.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* -------------------- ACCEPT BY ID -------------------- */}
      {tab === "ACCEPT_BY_ID" && !loading && (
        <form onSubmit={submitAcceptById} className="max-w-md">
          <h3 className="text-lg font-semibold mb-3">Accept Invoice</h3>
          <label className="block text-sm mb-2">
            Invoice ID
            <input
              type="text"
              value={acceptingId}
              onChange={(e) => setAcceptingId(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </label>
          <button
            type="submit"
            disabled={acceptingBusy}
            className="mt-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-black/80"
          >
            {acceptingBusy ? "Processing…" : "Accept"}
          </button>
        </form>
      )}
    </div>
  );
};

export default GopaInvoicesPanel;
