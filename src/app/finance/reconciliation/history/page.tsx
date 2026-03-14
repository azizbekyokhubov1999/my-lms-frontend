"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface SyncLog {
  id: string;
  date: string;
  time: string;
  status: "Success" | "Failed";
  recordsImported: number | null;
  errorLog: string | null;
}

const MOCK_HISTORY: SyncLog[] = [
  { id: "sync1", date: "2026-03-06", time: "08:15", status: "Success", recordsImported: 156, errorLog: null },
  { id: "sync2", date: "2026-03-05", time: "08:02", status: "Failed", recordsImported: null, errorLog: "Connection timeout to 1C. Retry recommended." },
  { id: "sync3", date: "2026-03-05", time: "07:58", status: "Success", recordsImported: 142, errorLog: null },
  { id: "sync4", date: "2026-03-04", time: "08:01", status: "Failed", recordsImported: null, errorLog: "Invalid file format: expected CSV columns [ref, amount, date]." },
];

export default function ReconciliationHistoryPage() {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/reconciliation" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Reconciliation
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Sync History</h1>
        <p className="mt-1 text-sm text-slate-600">
          Log of 1C data imports with status and error details.
        </p>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Time</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Records</th>
                <th className="w-24 px-4 py-3 text-left font-medium text-slate-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_HISTORY.map((entry) => (
                <React.Fragment key={entry.id}>
                  <tr className="hover:bg-emerald-50/70">
                    <td className="px-4 py-3 text-slate-900">{entry.date}</td>
                    <td className="px-4 py-3 text-slate-600">{entry.time}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          entry.status === "Success" && "bg-emerald-100 text-emerald-700",
                          entry.status === "Failed" && "bg-red-100 text-red-700",
                        )}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {entry.recordsImported ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {entry.errorLog && (
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                          className="text-sm font-medium text-emerald-700 hover:underline"
                        >
                          {expandedId === entry.id ? "Hide log" : "View error log"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedId === entry.id && entry.errorLog && (
                    <tr>
                      <td colSpan={5} className="bg-red-50/50 px-4 py-3">
                        <pre className="whitespace-pre-wrap text-xs text-red-800 font-mono">
                          {entry.errorLog}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
