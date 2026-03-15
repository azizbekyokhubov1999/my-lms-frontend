"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PlanStatus = "on_track" | "defaulted" | "fulfilled";

interface PaymentPlan {
  id: string;
  studentId: string;
  studentName: string;
  totalAmount: number;
  paidAmount: number;
  installmentsCount: number;
  nextDueDate: string | null;
  finalDeadline: string;
  status: PlanStatus;
  createdAt: string;
}

const MOCK_PLANS: PaymentPlan[] = [
  {
    id: "pp1",
    studentId: "STU-10001",
    studentName: "Anna Petrova",
    totalAmount: 315000,
    paidAmount: 52500,
    installmentsCount: 6,
    nextDueDate: "2026-03-15",
    finalDeadline: "2026-06-15",
    status: "on_track",
    createdAt: "2026-01-15",
  },
  {
    id: "pp2",
    studentId: "STU-10002",
    studentName: "Ivan Kozlov",
    totalAmount: 285000,
    paidAmount: 95000,
    installmentsCount: 4,
    nextDueDate: "2026-02-20",
    finalDeadline: "2026-05-20",
    status: "defaulted",
    createdAt: "2026-01-10",
  },
  {
    id: "pp3",
    studentId: "STU-10003",
    studentName: "Maria Sokolova",
    totalAmount: 260000,
    paidAmount: 260000,
    installmentsCount: 4,
    nextDueDate: null,
    finalDeadline: "2026-04-01",
    status: "fulfilled",
    createdAt: "2025-11-01",
  },
];

const STATUS_LABELS: Record<PlanStatus, string> = {
  on_track: "On Track",
  defaulted: "Defaulted",
  fulfilled: "Fulfilled",
};

export default function PaymentPlansHistoryPage() {
  const [plans, setPlans] = React.useState<PaymentPlan[]>(MOCK_PLANS);

  const handleRemoveOrComplete = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan?.status === "fulfilled") {
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } else {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === planId ? { ...p, status: "fulfilled" as PlanStatus, nextDueDate: null } : p
        )
      );
    }
  };

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;
  const activePlans = plans.filter((p) => p.status !== "fulfilled");
  const fulfilledPlans = plans.filter((p) => p.status === "fulfilled");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/finance/debts/payment-plans" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Payment Plans
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Payment Plan History</h1>
          <p className="mt-1 text-sm text-slate-600">
            Monitor active plans and complete or remove fulfilled plans.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Active Plans</h2>
          <p className="mt-0.5 text-xs text-slate-600">Status: On Track or Defaulted. Use Remove/Complete when a plan is fulfilled.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Total</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Paid</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Next Due</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Final Deadline</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="w-36 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activePlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No active payment plans.
                  </td>
                </tr>
              ) : (
                activePlans.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-50/70">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{p.studentName}</p>
                      <p className="text-xs text-slate-500">{p.studentId}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">{formatAmount(p.totalAmount)}</td>
                    <td className="px-4 py-3 text-right text-emerald-700">{formatAmount(p.paidAmount)}</td>
                    <td className="px-4 py-3 text-slate-700">{p.nextDueDate ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{p.finalDeadline}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          p.status === "on_track" && "bg-emerald-100 text-emerald-800",
                          p.status === "defaulted" && "bg-rose-100 text-rose-800",
                        )}
                      >
                        {STATUS_LABELS[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRemoveOrComplete(p.id)}
                      >
                        Mark fulfilled
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {fulfilledPlans.length > 0 && (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Fulfilled Plans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Total</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Final Deadline</th>
                  <th className="w-28 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fulfilledPlans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{p.studentName}</p>
                      <p className="text-xs text-slate-500">{p.studentId}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">{formatAmount(p.totalAmount)}</td>
                    <td className="px-4 py-3 text-slate-700">{p.finalDeadline}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="text-slate-600 hover:bg-slate-200"
                        onClick={() => handleRemoveOrComplete(p.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
