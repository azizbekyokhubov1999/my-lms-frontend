"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "@/app/components/ui/Card";

type AccessLogRow = {
  id: string;
  who: string;
  where: string;
  what: string;
  level: "Info" | "Warning" | "Critical";
};

const LOGS: AccessLogRow[] = [
  { id: "l1", who: "ops.admin", where: "Berlin, DE", what: "Revoked API key", level: "Warning" },
  { id: "l2", who: "security.analyst", where: "Lagos, NG", what: "Enabled MFA policy", level: "Info" },
  { id: "l3", who: "unknown", where: "Untrusted IP", what: "Failed privileged login", level: "Critical" },
];

export default function AccessLogsPage() {
  const [query, setQuery] = React.useState("");
  const [level, setLevel] = React.useState<"All" | AccessLogRow["level"]>("All");

  const filtered = LOGS.filter((row) => {
    const q = query.trim().toLowerCase();
    const matchesText = !q || `${row.who} ${row.where} ${row.what}`.toLowerCase().includes(q);
    const matchesLevel = level === "All" || row.level === level;
    return matchesText && matchesLevel;
  });

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <Link href="/operations/access" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Back to Access Hub
      </Link>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Access Logs</h1>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs..." className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2" />
          <select value={level} onChange={(e) => setLevel(e.target.value as "All" | AccessLogRow["level"])} className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2">
            <option value="All">All Levels</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Who</th>
                <th className="px-4 py-3">Where</th>
                <th className="px-4 py-3">What</th>
                <th className="px-4 py-3">Level</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3">{row.who}</td>
                  <td className="px-4 py-3">{row.where}</td>
                  <td className="px-4 py-3">{row.what}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${row.level === "Critical" ? "border-rose-200 bg-rose-50 text-rose-600" : row.level === "Warning" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-indigo-200 bg-indigo-50 text-indigo-600"}`}>{row.level}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
