"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AuditEntry {
  id: string;
  timestamp: string;
  who: string;
  whoId: string;
  entityType: "Contract" | "Payment";
  entityId: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

const MOCK_AUDIT: AuditEntry[] = [
  { id: "a1", timestamp: "2026-03-06 14:32:18", who: "Maria Ivanova", whoId: "FIN-001", entityType: "Payment", entityId: "TXN-2841", field: "amount", oldValue: "45000", newValue: "45000", reason: "Verification correction" },
  { id: "a2", timestamp: "2026-03-06 11:15:02", who: "Dmitri Petrov", whoId: "FIN-002", entityType: "Contract", entityId: "CNT-2025-00142", field: "totalAmount", oldValue: "400000", newValue: "450000", reason: "Scholarship adjustment" },
  { id: "a3", timestamp: "2026-03-05 16:40:33", who: "Anna Sokolova", whoId: "FIN-003", entityType: "Payment", entityId: "TXN-2839", field: "status", oldValue: "Pending", newValue: "Verified", reason: "Bank confirmation received" },
  { id: "a4", timestamp: "2026-03-05 09:22:11", who: "Dmitri Petrov", whoId: "FIN-002", entityType: "Contract", entityId: "CNT-2025-00089", field: "endDate", oldValue: "2029-06-30", newValue: "2029-12-31", reason: "Payment plan extension" },
];

export default function AuditLogsPage() {
  const [search, setSearch] = React.useState("");
  const [entityFilter, setEntityFilter] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return MOCK_AUDIT.filter((e) => {
      if (entityFilter && e.entityType !== entityFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!e.entityId.toLowerCase().includes(q) && !e.who.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, entityFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Audit & Logs</h1>
          <p className="mt-1 text-sm text-slate-600">
            Transaction history. Read-only audit trail (WHO, WHAT, WHY).
          </p>
        </div>
        <Link
          href="/finance/audit/transactions"
          className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Transaction History
        </Link>
      </div>

      {/* Data Integrity Check Widget */}
      <Card className="border-l-4 border-l-emerald-600 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Data Consistency Status
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-sm font-medium text-slate-700">Contracts ↔ Payments balanced</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-sm font-medium text-slate-700">1C reconciliation synced</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-sm font-medium text-slate-700">Last verified: 2026-03-06 08:00</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          All financial data is consistent. No orphaned or duplicate records detected.
        </p>
      </Card>

      {/* Financial Audit Logs */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Financial Audit Logs
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">Read-only · High-security</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="search"
              placeholder="Search by ID or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-[200px] font-mono text-sm"
            />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Entity: All</option>
              <option value="Contract">Contract</option>
              <option value="Payment">Payment</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Who</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Entity</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Field</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Old → New</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{e.timestamp}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{e.who}</p>
                    <p className="font-mono text-xs text-slate-500">{e.whoId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {e.entityType}
                    </span>
                    <p className="mt-0.5 font-mono text-xs text-slate-600">{e.entityId}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">{e.field}</td>
                  <td className="px-4 py-3">
                    <span className="text-slate-500 line-through">{e.oldValue}</span>
                    <span className="mx-1 text-slate-400">→</span>
                    <span className="font-medium text-slate-900">{e.newValue}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{e.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No audit entries match the filters.</p>
        )}
      </Card>
    </div>
  );
}
