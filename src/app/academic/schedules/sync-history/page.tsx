"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

const MOCK_SYNC_LOG = [
  { id: "sync1", at: "2026-03-06 08:15", status: "success", groups: 142, conflicts: 0, message: "Sync completed." },
  { id: "sync2", at: "2026-03-05 08:10", status: "success", groups: 142, conflicts: 2, message: "Sync completed. 2 conflicts detected." },
  { id: "sync3", at: "2026-03-04 08:05", status: "success", groups: 140, conflicts: 0, message: "Sync completed. 2 new groups." },
  { id: "sync4", at: "2026-03-03 08:00", status: "error", groups: 0, conflicts: 0, message: "aSc connection timeout." },
];

export default function SyncHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/schedules" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Schedules
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Sync history</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Log of all previous aSc Timetable synchronizations.
        </p>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-purple-200 bg-purple-100">
                <th className="px-4 py-3 text-left font-medium text-purple-900">Date & time</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Status</th>
                <th className="px-4 py-3 text-right font-medium text-purple-900">Groups</th>
                <th className="px-4 py-3 text-right font-medium text-purple-900">Conflicts</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_SYNC_LOG.map((row) => (
                <tr key={row.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-mono text-slate-700">{row.at}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.groups}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.conflicts}</td>
                  <td className="px-4 py-3 text-slate-600">{row.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
