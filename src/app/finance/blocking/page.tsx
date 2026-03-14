"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface BlockedStudent {
  id: string;
  studentName: string;
  studentId: string;
  blockReason: string;
  amountNeeded: number;
  blockedAt: string;
}

const MOCK_BLOCKED: BlockedStudent[] = [
  { id: "STU-10001", studentName: "Anna Petrova", studentId: "STU-10001", blockReason: "Overdue debt (3 installments)", amountNeeded: 315000, blockedAt: "2026-02-25" },
  { id: "STU-10002", studentName: "Ivan Kozlov", studentId: "STU-10002", blockReason: "Overdue debt (1 installment)", amountNeeded: 95000, blockedAt: "2026-03-01" },
  { id: "STU-10005", studentName: "Elena Novikova", studentId: "STU-10005", blockReason: "Overdue debt (2 installments)", amountNeeded: 156000, blockedAt: "2026-03-03" },
];

export default function BlockedStudentsPage() {
  const [search, setSearch] = React.useState("");
  const [debtThreshold, setDebtThreshold] = React.useState("500000");
  const [overdueDays, setOverdueDays] = React.useState("10");

  const filtered = React.useMemo(() => {
    if (!search.trim()) return MOCK_BLOCKED;
    const q = search.trim().toLowerCase();
    return MOCK_BLOCKED.filter(
      (s) =>
        s.studentName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q)
    );
  }, [search]);

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Blocking System</h1>
          <p className="mt-1 text-sm text-slate-600">
            Access control. Students with restricted LMS access due to debt.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/finance/blocking/unblocking-requests"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Unblocking Requests
          </Link>
          <Link
            href="/finance/blocking/history"
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Blocking History
          </Link>
        </div>
      </div>

      {/* Auto-Block Rules Panel */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Auto-Block Rules</h2>
        <p className="mt-1 text-xs text-slate-600">Configure the threshold for automatic blocking.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Debt Threshold (UZS)"
            type="number"
            placeholder="e.g. 1000000"
            value={debtThreshold}
            onChange={(e) => setDebtThreshold(e.target.value)}
            helperText="Block if debt exceeds this amount"
          />
          <Input
            label="Overdue Days"
            type="number"
            placeholder="e.g. 10"
            value={overdueDays}
            onChange={(e) => setOverdueDays(e.target.value)}
            helperText="Block if overdue more than N days"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Rule: Block if debt &gt; threshold <strong>and</strong> overdue &gt; N days.
        </p>
        <button
          type="button"
          onClick={() => alert(`Rules saved (Demo): debt &gt; ${debtThreshold} UZS, overdue &gt; ${overdueDays} days.`)}
          className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Save Rules
        </button>
      </Card>

      {/* Blocked Students List */}
      <Card className="p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Blocked Students</h2>
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Block Reason</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount Needed for Unblocking</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Blocked At</th>
                <th className="w-20 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-emerald-50/70">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{s.studentName}</p>
                    <p className="text-xs text-slate-500">{s.studentId}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.blockReason}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatAmount(s.amountNeeded)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                      Blocked
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.blockedAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/finance/debts/${s.id}`}
                      className="text-sm font-medium text-emerald-700 hover:underline"
                    >
                      View Debt
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No blocked students match the search.</p>
        )}
      </Card>
    </div>
  );
}
