"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PaymentStatus = "Verified" | "Pending" | "Rejected";

interface PaymentRow {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
}

const MOCK_PAYMENTS: PaymentRow[] = [
  { id: "p1", transactionId: "TXN-2841", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, method: "Card", status: "Verified", date: "2026-03-06" },
  { id: "p2", transactionId: "TXN-2840", studentName: "Ivan Kozlov", studentId: "STU-10002", amount: 38000, method: "Bank Transfer", status: "Pending", date: "2026-03-06" },
  { id: "p3", transactionId: "TXN-2839", studentName: "Maria Sokolova", studentId: "STU-10003", amount: 52000, method: "Card", status: "Verified", date: "2026-03-05" },
  { id: "p4", transactionId: "TXN-2838", studentName: "Dmitri Volkov", studentId: "STU-10004", amount: 29000, method: "Cash", status: "Verified", date: "2026-03-05" },
  { id: "p5", transactionId: "TXN-2837", studentName: "Elena Novikova", studentId: "STU-10005", amount: 60000, method: "Bank Transfer", status: "Rejected", date: "2026-03-04" },
  { id: "p6", transactionId: "TXN-2836", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, method: "Bank Transfer", status: "Verified", date: "2026-03-03" },
];

const STATUS_OPTIONS: PaymentStatus[] = ["Verified", "Pending", "Rejected"];

export default function PaymentsListPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return MOCK_PAYMENTS.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!p.studentName.toLowerCase().includes(q) && !p.transactionId.toLowerCase().includes(q) && !p.studentId.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [search, statusFilter]);

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tracking & recording. View all payment transactions and status.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/finance/payments/history"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            History
          </Link>
          <Link
            href="/finance/payments/record"
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Record Payment
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder="Search by student name, ID, or transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Status: All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Transaction ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Method</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-emerald-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700">{p.transactionId}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{p.studentName}</p>
                    <p className="text-xs text-slate-500">{p.studentId}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{formatAmount(p.amount)}</td>
                  <td className="px-4 py-3 text-slate-600">{p.method}</td>
                  <td className="px-4 py-3 text-slate-600">{p.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        p.status === "Verified" && "bg-emerald-100 text-emerald-800",
                        p.status === "Pending" && "bg-amber-100 text-amber-800",
                        p.status === "Rejected" && "bg-red-100 text-red-800",
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/finance/payments/${p.id}`}
                        className="text-sm font-medium text-emerald-700 hover:underline"
                      >
                        View
                      </Link>
                      <span className="text-slate-300">|</span>
                      <Link
                        href={`/finance/payments/${p.id}#receipt`}
                        className="text-sm font-medium text-slate-600 hover:underline"
                      >
                        View Receipt
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No payments match the filters.</p>
        )}
      </Card>
    </div>
  );
}
