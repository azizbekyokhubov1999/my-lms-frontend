"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Mock data
const KPIS = {
  totalRevenueMtd: 124750,
  outstandingDebt: 45200,
  collectionRate: 85,
  blockedStudents: 12,
};

const REVENUE_VS_TARGETS = [
  { month: "Oct", revenue: 98, target: 100 },
  { month: "Nov", revenue: 102, target: 105 },
  { month: "Dec", revenue: 115, target: 110 },
  { month: "Jan", revenue: 108, target: 112 },
  { month: "Feb", revenue: 120, target: 118 },
  { month: "Mar", revenue: 125, target: 125 },
];

const PAYMENT_METHODS = [
  { label: "Card", value: 52, color: "#059669" },
  { label: "Bank Transfer", value: 38, color: "#0891b2" },
  { label: "Cash", value: 10, color: "#64748b" },
];

const AT_RISK_STUDENTS = [
  { id: "STU-10042", name: "Anna Petrova", overdue: 4, amount: 1200 },
  { id: "STU-10088", name: "Ivan Kozlov", overdue: 3, amount: 900 },
  { id: "STU-10105", name: "Maria Sokolova", overdue: 5, amount: 1500 },
  { id: "STU-10121", name: "Dmitri Volkov", overdue: 3, amount: 750 },
];

const RECENT_TRANSACTIONS = [
  { id: "TXN-2841", student: "STU-09912", amount: 450, method: "Card", date: "Today, 14:32", status: "Confirmed" as const },
  { id: "TXN-2840", student: "STU-10021", amount: 380, method: "Bank Transfer", date: "Today, 11:15", status: "Pending" as const },
  { id: "TXN-2839", student: "STU-09988", amount: 520, method: "Card", date: "Yesterday, 16:40", status: "Confirmed" as const },
  { id: "TXN-2838", student: "STU-10055", amount: 290, method: "Cash", date: "Yesterday, 09:22", status: "Confirmed" as const },
  { id: "TXN-2837", student: "STU-10077", amount: 600, method: "Bank Transfer", date: "Mar 4, 15:10", status: "Pending" as const },
];

function BarChart({ data }: { data: typeof REVENUE_VS_TARGETS }) {
  const max = Math.max(...data.flatMap((d) => [d.revenue, d.target])) * 1.1;

  return (
    <div className="space-y-2.5">
      {data.map((d) => {
        const revenueW = (d.revenue / max) * 100;
        const targetW = (d.target / max) * 100;
        return (
          <div key={d.month} className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-xs font-medium text-slate-600">{d.month}</span>
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <div
                className="h-5 rounded bg-emerald-600"
                style={{ width: `${revenueW}%`, minWidth: d.revenue > 0 ? 6 : 0 }}
              />
              <div
                className="h-5 rounded border border-dashed border-slate-300 bg-slate-50/50"
                style={{ width: `${targetW}%`, minWidth: d.target > 0 ? 6 : 0 }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-xs text-slate-500">
              {d.revenue}k / {d.target}k
            </span>
          </div>
        );
      })}
      <div className="flex gap-4 pt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded bg-emerald-600" /> Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded border border-dashed border-slate-300" /> Target
        </span>
      </div>
    </div>
  );
}

function PieChart({ data }: { data: typeof PAYMENT_METHODS }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let accDeg = 0;
  const segments = data.map((d) => {
    const startDeg = accDeg;
    const sweepDeg = (d.value / total) * 360;
    accDeg += sweepDeg;
    return { ...d, startDeg, sweepDeg };
  });
  const r = 40;
  const cx = 50;
  const cy = 50;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg viewBox="0 0 100 100" className="h-40 w-40 shrink-0">
        {segments.map((s, i) => {
          const toRad = (deg: number) => (deg * Math.PI) / 180;
          const x1 = cx + r * Math.cos(toRad(s.startDeg));
          const y1 = cy + r * Math.sin(toRad(s.startDeg));
          const x2 = cx + r * Math.cos(toRad(s.startDeg + s.sweepDeg));
          const y2 = cy + r * Math.sin(toRad(s.startDeg + s.sweepDeg));
          const largeArc = s.sweepDeg > 180 ? 1 : 0;
          const d = [`M ${cx} ${cy}`, `L ${x1} ${y1}`, `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`, "Z"].join(" ");
          return <path key={i} d={d} fill={s.color} stroke="white" strokeWidth="2" />;
        })}
      </svg>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
              {d.label}
            </span>
            <span className="font-medium text-slate-700">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FinanceDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Finance Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Overview of revenue, collections, and key financial metrics.</p>
      </div>

      {/* KPI Stats Grid */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Key Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-emerald-600 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Revenue (MTD)</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {KPIS.totalRevenueMtd.toLocaleString()} ₸
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Money collected this month</p>
          </Card>
          <Card className="border-l-4 border-l-amber-500 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Outstanding Debt</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{KPIS.outstandingDebt.toLocaleString()} ₸</p>
            <p className="mt-0.5 text-xs text-slate-500">Total unpaid from students</p>
          </Card>
          <Card className="border-l-4 border-l-emerald-700 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Collection Rate</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">{KPIS.collectionRate}%</p>
            <p className="mt-0.5 text-xs text-slate-500">Paid vs due</p>
          </Card>
          <Card className="border-l-4 border-l-red-500 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Blocked Students</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{KPIS.blockedStudents}</p>
            <p className="mt-0.5 text-xs text-slate-500">Currently blocked for non-payment</p>
          </Card>
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Charts</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-4 shadow-sm">
            <h3 className="mb-4 text-sm font-medium text-slate-700">Revenue vs Targets (last 6 months)</h3>
            <BarChart data={REVENUE_VS_TARGETS} />
          </Card>
          <Card className="p-4 shadow-sm">
            <h3 className="mb-4 text-sm font-medium text-slate-700">Payment Methods</h3>
            <PieChart data={PAYMENT_METHODS} />
          </Card>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Urgent Alerts */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Urgent Alerts</h2>
          <Card className="overflow-hidden p-0 shadow-sm">
            <p className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
              At-risk students (3+ overdue installments)
            </p>
            <ul className="divide-y divide-slate-100">
              {AT_RISK_STUDENTS.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50/50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.id}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      {s.overdue} overdue
                    </span>
                    <span className="text-sm font-medium text-slate-700">{s.amount.toLocaleString()} ₸</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
              <Link
                href="/finance/debts"
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                View all debts →
              </Link>
            </div>
          </Card>
        </section>

        {/* Recent Transactions */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Transactions</h2>
          <Card className="overflow-hidden p-0 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">ID</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">Student</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-600">Amount</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_TRANSACTIONS.map((t) => (
                    <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{t.id}</td>
                      <td className="px-4 py-2.5 text-slate-700">{t.student}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-slate-900">{t.amount.toLocaleString()} ₸</td>
                      <td className="px-4 py-2.5 text-right">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            t.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800",
                          )}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
              <Link
                href="/finance/payments"
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                View all payments →
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
