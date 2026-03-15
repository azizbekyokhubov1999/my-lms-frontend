"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface PromiseRecord {
  id: string;
  studentId: string;
  studentName: string;
  expectedDate: string;
  amount: number | null;
  status: "pending" | "kept" | "broken";
  recordedAt: string;
  notes: string | null;
}

const MOCK_PROMISES: PromiseRecord[] = [
  { id: "pr1", studentId: "STU-10001", studentName: "Anna Petrova", expectedDate: "2026-03-15", amount: 52500, status: "pending", recordedAt: "2026-03-01", notes: "Agreed after call" },
  { id: "pr2", studentId: "STU-10002", studentName: "Ivan Kozlov", expectedDate: "2026-03-20", amount: 95000, status: "pending", recordedAt: "2026-03-03", notes: null },
  { id: "pr3", studentId: "STU-10005", studentName: "Elena Novikova", expectedDate: "2026-03-08", amount: 78000, status: "kept", recordedAt: "2026-02-28", notes: null },
  { id: "pr4", studentId: "STU-10001", studentName: "Anna Petrova", expectedDate: "2026-02-15", amount: 50000, status: "broken", recordedAt: "2026-01-20", notes: "Did not pay on time" },
];

const STATUS_LABELS: Record<PromiseRecord["status"], string> = {
  pending: "Pending",
  kept: "Kept",
  broken: "Broken",
};

export default function PromisesListPage() {
  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  const sorted = [...MOCK_PROMISES].sort(
    (a, b) => new Date(b.expectedDate).getTime() - new Date(a.expectedDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/debts/collection" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Debt Collection
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Promise to Pay List</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track all Promise to Pay records and their expected dates.
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">All Promises</h2>
          <p className="mt-0.5 text-xs text-slate-600">Expected date, amount, and status.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Expected Date</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Recorded</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Notes</th>
                <th className="w-20 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((p) => (
                <tr key={p.id} className="hover:bg-emerald-50/70">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{p.studentName}</p>
                    <p className="text-xs text-slate-500">{p.studentId}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.expectedDate}</td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {p.amount != null ? formatAmount(p.amount) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        p.status === "pending" && "bg-amber-100 text-amber-800",
                        p.status === "kept" && "bg-emerald-100 text-emerald-800",
                        p.status === "broken" && "bg-rose-100 text-rose-800",
                      )}
                    >
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.recordedAt}</td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-slate-600" title={p.notes ?? undefined}>
                    {p.notes ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/finance/debts/${p.studentId}`}
                      className="text-sm font-medium text-emerald-700 hover:underline"
                    >
                      View
                    </Link>
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
