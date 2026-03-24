"use client";

import * as React from "react";
import Link from "next/link";
import { FileSearch } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type ActionType = "Sensitive" | "Configuration" | "Read-only" | "All";

type LogRow = {
  id: string;
  ts: string;
  user: string;
  action: string;
  actionType: Exclude<ActionType, "All">;
  resource: string;
};

const ROWS: LogRow[] = [
  {
    id: "1",
    ts: "2026-03-24T09:12:00",
    user: "ops.admin",
    action: "Changed retention policy",
    actionType: "Sensitive",
    resource: "Policy #R-30",
  },
  {
    id: "2",
    ts: "2026-03-24T08:44:00",
    user: "security.analyst",
    action: "Exported audit bundle",
    actionType: "Sensitive",
    resource: "ISO-27001",
  },
  {
    id: "3",
    ts: "2026-03-24T07:01:00",
    user: "system",
    action: "Automated backup verification",
    actionType: "Configuration",
    resource: "Backup job #8821",
  },
  {
    id: "4",
    ts: "2026-03-23T16:22:00",
    user: "auditor.ext",
    action: "Viewed compliance dashboard",
    actionType: "Read-only",
    resource: "Dashboard",
  },
  {
    id: "5",
    ts: "2026-03-23T14:05:00",
    user: "ops.admin",
    action: "Revoked API key",
    actionType: "Sensitive",
    resource: "Key k-ops-01",
  },
];

const USERS = Array.from(new Set(ROWS.map((r) => r.user))).sort();

function formatTs(iso: string) {
  return new Date(iso).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AuditLogsPage() {
  const [userFilter, setUserFilter] = React.useState<string>("All");
  const [actionType, setActionType] = React.useState<ActionType>("All");
  const [fromTs, setFromTs] = React.useState("");
  const [toTs, setToTs] = React.useState("");

  const filtered = React.useMemo(() => {
    return ROWS.filter((r) => {
      if (userFilter !== "All" && r.user !== userFilter) return false;
      if (actionType !== "All" && r.actionType !== actionType) return false;
      const t = new Date(r.ts).getTime();
      if (fromTs) {
        const from = new Date(fromTs).getTime();
        if (t < from) return false;
      }
      if (toTs) {
        const to = new Date(toTs).getTime();
        if (t > to) return false;
      }
      return true;
    });
  }, [userFilter, actionType, fromTs, toTs]);

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/operations/compliance"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to Compliance Hub
        </Link>
        <FileSearch className="h-6 w-6 text-indigo-400" />
      </div>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-600">
          High-volume audit trail with filters for user, sensitive action type, and time range.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600">User</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            >
              <option value="All">All users</option>
              {USERS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Action type</label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value as ActionType)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            >
              <option value="All">All</option>
              <option value="Sensitive">Sensitive</option>
              <option value="Configuration">Configuration</option>
              <option value="Read-only">Read-only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">From (timestamp)</label>
            <input
              type="datetime-local"
              value={fromTs}
              onChange={(e) => setFromTs(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">To (timestamp)</label>
            <input
              type="datetime-local"
              value={toTs}
              onChange={(e) => setToTs(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Resource</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-slate-200 text-slate-700">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{formatTs(r.ts)}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.user}</td>
                  <td className="px-4 py-3">{r.action}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        r.actionType === "Sensitive"
                          ? "border-amber-200 bg-amber-50 text-amber-600"
                          : "border-indigo-200 bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {r.actionType}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">Showing {filtered.length} of {ROWS.length} events</p>
      </Card>
    </div>
  );
}
