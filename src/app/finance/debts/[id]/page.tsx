"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../../components/ui/Card";

interface MissedInstallment {
  id: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
}

interface TimelineEvent {
  id: string;
  date: string;
  type: "installment_due" | "payment" | "missed" | "reminder";
  label: string;
  amount?: number;
}

const MOCK_STUDENTS: Record<string, { name: string; studentId: string; totalContract: number; paid: number; remainingDebt: number; riskLevel: string }> = {
  "STU-10001": { name: "Anna Petrova", studentId: "STU-10001", totalContract: 450000, paid: 135000, remainingDebt: 315000, riskLevel: "High" },
  "STU-10002": { name: "Ivan Kozlov", studentId: "STU-10002", totalContract: 380000, paid: 95000, remainingDebt: 285000, riskLevel: "Medium" },
  "STU-10003": { name: "Maria Sokolova", studentId: "STU-10003", totalContract: 520000, paid: 260000, remainingDebt: 260000, riskLevel: "Low" },
  "STU-10005": { name: "Elena Novikova", studentId: "STU-10005", totalContract: 390000, paid: 78000, remainingDebt: 312000, riskLevel: "Medium" },
};

const MOCK_MISSED: Record<string, MissedInstallment[]> = {
  "STU-10001": [
    { id: "i1", dueDate: "2025-12-15", amount: 112500, daysOverdue: 81 },
    { id: "i2", dueDate: "2026-01-15", amount: 112500, daysOverdue: 51 },
    { id: "i3", dueDate: "2026-02-15", amount: 90000, daysOverdue: 19 },
  ],
  "STU-10002": [
    { id: "i4", dueDate: "2026-02-20", amount: 95000, daysOverdue: 14 },
  ],
  "STU-10003": [],
  "STU-10005": [
    { id: "i5", dueDate: "2026-03-01", amount: 78000, daysOverdue: 5 },
  ],
};

const MOCK_TIMELINE: Record<string, TimelineEvent[]> = {
  "STU-10001": [
    { id: "t1", date: "2025-09-15", type: "payment", label: "Payment received", amount: 45000 },
    { id: "t2", date: "2025-10-15", type: "payment", label: "Payment received", amount: 45000 },
    { id: "t3", date: "2025-11-15", type: "payment", label: "Payment received", amount: 45000 },
    { id: "t4", date: "2025-12-15", type: "installment_due", label: "Installment due" },
    { id: "t5", date: "2025-12-15", type: "missed", label: "Missed payment" },
    { id: "t6", date: "2026-01-15", type: "missed", label: "Missed payment" },
    { id: "t7", date: "2026-01-20", type: "reminder", label: "Reminder sent (SMS)" },
    { id: "t8", date: "2026-02-15", type: "missed", label: "Missed payment" },
  ],
  "STU-10002": [
    { id: "t9", date: "2025-09-20", type: "payment", label: "Payment received", amount: 47500 },
    { id: "t10", date: "2025-10-20", type: "payment", label: "Payment received", amount: 47500 },
    { id: "t11", date: "2026-02-20", type: "missed", label: "Missed payment" },
  ],
  "STU-10003": [
    { id: "t12", date: "2025-10-01", type: "payment", label: "Payment received", amount: 130000 },
    { id: "t13", date: "2026-01-15", type: "payment", label: "Payment received", amount: 130000 },
  ],
  "STU-10005": [
    { id: "t14", date: "2025-09-10", type: "payment", label: "Payment received", amount: 78000 },
    { id: "t15", date: "2026-03-01", type: "missed", label: "Missed payment" },
  ],
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function StudentDebtPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const student = id ? MOCK_STUDENTS[id] : null;
  const missed = (id && MOCK_MISSED[id]) ?? [];
  const timeline = (id && MOCK_TIMELINE[id]) ?? [];

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  if (!student) {
    return (
      <div className="space-y-6">
        <Link href="/finance/debts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Debts
        </Link>
        <p className="text-slate-600">Student not found.</p>
      </div>
    );
  }

  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/debts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Debts
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{student.name}</h1>
        <p className="mt-0.5 text-sm text-slate-600">Student ID: {student.studentId}</p>
      </div>

      {/* Summary */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Debt Summary</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Total Contract</dt>
            <dd className="text-lg font-semibold text-slate-900">{formatAmount(student.totalContract)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Paid</dt>
            <dd className="text-lg font-semibold text-emerald-700">{formatAmount(student.paid)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Remaining Debt</dt>
            <dd className="text-lg font-semibold text-rose-600">{formatAmount(student.remainingDebt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Risk Level</dt>
            <dd>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  student.riskLevel === "High" && "bg-rose-100 text-rose-800",
                  student.riskLevel === "Medium" && "bg-amber-100 text-amber-800",
                  student.riskLevel === "Low" && "bg-emerald-100 text-emerald-800",
                )}
              >
                {student.riskLevel}
              </span>
            </dd>
          </div>
        </dl>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Missed Installments */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Missed Installments</h2>
          {missed.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-2.5 text-left font-medium text-slate-600">Due Date</th>
                    <th className="px-4 py-2.5 text-right font-medium text-slate-600">Amount</th>
                    <th className="px-4 py-2.5 text-right font-medium text-slate-600">Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {missed.map((i) => (
                    <tr key={i.id} className="border-b border-slate-100 last:border-0 hover:bg-rose-50/50">
                      <td className="px-4 py-2.5 text-slate-700">{i.dueDate}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-rose-600">{formatAmount(i.amount)}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-rose-600">{i.daysOverdue} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No missed installments.</p>
          )}
        </Card>

        {/* Debt Timeline */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Debt Timeline</h2>
          <ul className="mt-4 border-l-2 border-slate-200 pl-4">
            {sortedTimeline.map((e) => (
              <li key={e.id} className="relative pb-4 last:pb-0">
                <span
                  className={cn(
                    "absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-white shadow",
                    e.type === "payment" && "bg-emerald-500",
                    e.type === "missed" && "bg-rose-500",
                    e.type === "installment_due" && "bg-slate-400",
                    e.type === "reminder" && "bg-amber-500",
                  )}
                />
                <p className="text-sm font-medium text-slate-900">{e.label}</p>
                <p className="text-xs text-slate-500">{e.date}</p>
                {e.amount != null && (
                  <p className="mt-0.5 text-xs font-medium text-emerald-700">{formatAmount(e.amount)}</p>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
