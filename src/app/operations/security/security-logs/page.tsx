"use client";

import * as React from "react";
import { FileText } from "lucide-react";

import { SecuritySubpageShell } from "../_components/SecuritySubpageShell";

type LogLevel = "Info" | "Warning" | "Alert";

type SecurityLog = {
  id: string;
  ts: string;
  level: LogLevel;
  source: string;
  message: string;
};

const logs: SecurityLog[] = [
  { id: "l1", ts: "2026-03-06 08:21", level: "Warning", source: "Auth", message: "4 failed admin login attempts from unknown IP." },
  { id: "l2", ts: "2026-03-06 07:58", level: "Info", source: "Keys", message: "Token rotation completed for ops/webhooks." },
  { id: "l3", ts: "2026-03-06 07:42", level: "Alert", source: "TLS", message: "Certificate expiration threshold reached for admin domain." },
  { id: "l4", ts: "2026-03-06 07:11", level: "Info", source: "Firewall", message: "Policy sync completed successfully." },
];

export default function SecurityLogsPage() {
  const [query, setQuery] = React.useState("");
  const [level, setLevel] = React.useState<"All" | LogLevel>("All");

  const filtered = logs.filter((row) => {
    const levelOk = level === "All" || row.level === level;
    const q = query.trim().toLowerCase();
    const textOk = !q || `${row.source} ${row.message}`.toLowerCase().includes(q);
    return levelOk && textOk;
  });

  return (
    <SecuritySubpageShell
      title="Security Logs"
      description="Search and filter security events by severity and source context."
      icon={FileText}
      badgeText="Event explorer"
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search message or source..."
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as "All" | LogLevel)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
          >
            <option value="All">All Levels</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Alert">Alert</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3">{row.ts}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      row.level === "Alert"
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-600"
                        : row.level === "Warning"
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-indigo-200 bg-indigo-50 text-indigo-600"
                    }`}>
                      {row.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3">{row.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SecuritySubpageShell>
  );
}
