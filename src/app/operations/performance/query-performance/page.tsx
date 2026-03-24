"use client";

import * as React from "react";
import Link from "next/link";
import { Database } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type QueryRow = {
  id: string;
  query: string;
  executionTime: number;
  frequency: string;
  optimized: boolean;
};

const INITIAL_ROWS: QueryRow[] = [
  { id: "q1", query: "SELECT * FROM attendance WHERE period_id = ?", executionTime: 2.4, frequency: "1.2k/day", optimized: false },
  { id: "q2", query: "db.events.find({ userId, ts: { $gt: ... } })", executionTime: 1.6, frequency: "3.4k/day", optimized: false },
  { id: "q3", query: "SELECT AVG(score) FROM grades GROUP BY class_id", executionTime: 2.8, frequency: "860/day", optimized: false },
];

export default function QueryPerformancePage() {
  const [rows, setRows] = React.useState(INITIAL_ROWS);

  const optimize = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, optimized: true, executionTime: Math.max(0.8, r.executionTime - 0.9) } : r)));
  };

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/performance" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Performance Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Query Performance</h1>
        </div>
        <Database className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Query</th>
                <th className="px-4 py-3">Execution Time</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const slow = row.executionTime > 2;
                return (
                  <tr key={row.id} className="border-t border-slate-200 text-slate-700">
                    <td className="px-4 py-3 font-mono text-xs text-slate-900">{row.query}</td>
                    <td className={`px-4 py-3 font-semibold ${slow ? "text-rose-500" : "text-emerald-500"}`}>
                      {row.executionTime.toFixed(1)}s
                    </td>
                    <td className="px-4 py-3">{row.frequency}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={row.optimized}
                        onClick={() => optimize(row.id)}
                        className="rounded-md border border-indigo-400 bg-indigo-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {row.optimized ? "Optimized" : "Optimize"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
