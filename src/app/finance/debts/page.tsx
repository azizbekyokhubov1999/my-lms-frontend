"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type RiskLevel = "Low" | "Medium" | "High";

interface DebtRow {
  id: string;
  studentName: string;
  studentId: string;
  totalContract: number;
  paid: number;
  remainingDebt: number;
  daysOverdue: number;
  riskLevel: RiskLevel;
  nextDeadline: string | null;
}

const MOCK_DEBTS: DebtRow[] = [
  { id: "STU-10001", studentName: "Anna Petrova", studentId: "STU-10001", totalContract: 450000, paid: 135000, remainingDebt: 315000, daysOverdue: 12, riskLevel: "High", nextDeadline: null },
  { id: "STU-10002", studentName: "Ivan Kozlov", studentId: "STU-10002", totalContract: 380000, paid: 95000, remainingDebt: 285000, daysOverdue: 5, riskLevel: "Medium", nextDeadline: "2026-03-15" },
  { id: "STU-10003", studentName: "Maria Sokolova", studentId: "STU-10003", totalContract: 520000, paid: 260000, remainingDebt: 260000, daysOverdue: 0, riskLevel: "Low", nextDeadline: "2026-03-25" },
  { id: "STU-10005", studentName: "Elena Novikova", studentId: "STU-10005", totalContract: 390000, paid: 78000, remainingDebt: 312000, daysOverdue: 3, riskLevel: "Medium", nextDeadline: "2026-03-08" },
];

const RISK_OPTIONS: RiskLevel[] = ["Low", "Medium", "High"];

export default function DebtsListPage() {
  const [search, setSearch] = React.useState("");
  const [riskFilter, setRiskFilter] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return MOCK_DEBTS.filter((d) => {
      if (riskFilter && d.riskLevel !== riskFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!d.studentName.toLowerCase().includes(q) && !d.studentId.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, riskFilter]);

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  const isOverdue = (row: DebtRow) => row.daysOverdue > 0;
  const isApproaching = (row: DebtRow) => row.daysOverdue === 0 && row.nextDeadline && (() => {
    const days = Math.ceil((new Date(row.nextDeadline).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    return days <= 7 && days > 0;
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Debt Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Monitoring & collection. View outstanding balances and risk levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/finance/debts/payment-plans"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Payment Plans
          </Link>
          <Link
            href="/finance/debts/collection"
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Collection Hub
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Risk: All</option>
            {RISK_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Total Contract</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Paid</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Remaining Debt</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Days Overdue</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Risk Level</th>
                <th className="w-20 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className={cn("hover:bg-emerald-50/70 transition-colors", isOverdue(row) && "bg-rose-50/50")}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{row.studentName}</p>
                    <p className="text-xs text-slate-500">{row.studentId}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{formatAmount(row.totalContract)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{formatAmount(row.paid)}</td>
                  <td className={cn("px-4 py-3 text-right font-semibold", isOverdue(row) ? "text-rose-600" : isApproaching(row) ? "text-amber-500" : "text-slate-900")}>
                    {formatAmount(row.remainingDebt)}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-medium", isOverdue(row) ? "text-rose-600" : "text-slate-600")}>
                    {row.daysOverdue > 0 ? `${row.daysOverdue} days` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        row.riskLevel === "High" && "bg-rose-100 text-rose-800",
                        row.riskLevel === "Medium" && "bg-amber-100 text-amber-800",
                        row.riskLevel === "Low" && "bg-emerald-100 text-emerald-800",
                      )}
                    >
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/finance/debts/${row.id}`}
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
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No debts match the filters.</p>
        )}
      </Card>
    </div>
  );
}
