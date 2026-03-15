"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TxStatus = "Verified" | "Pending" | "Rejected";

interface HistoryRow {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  amount: number;
  method: string;
  status: TxStatus;
  date: string;
  contractId: string;
}

const MOCK_HISTORY: HistoryRow[] = [
  { id: "p1", transactionId: "TXN-2841", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, method: "Card", status: "Verified", date: "2026-03-06", contractId: "CNT-2025-00142" },
  { id: "p2", transactionId: "TXN-2840", studentName: "Ivan Kozlov", studentId: "STU-10002", amount: 38000, method: "Bank Transfer", status: "Pending", date: "2026-03-06", contractId: "CNT-2025-00089" },
  { id: "p3", transactionId: "TXN-2839", studentName: "Maria Sokolova", studentId: "STU-10003", amount: 52000, method: "Card", status: "Verified", date: "2026-03-05", contractId: "CNT-2024-00321" },
  { id: "p4", transactionId: "TXN-2838", studentName: "Dmitri Volkov", studentId: "STU-10004", amount: 29000, method: "Cash", status: "Verified", date: "2026-03-05", contractId: "CNT-2024-00215" },
  { id: "p5", transactionId: "TXN-2837", studentName: "Elena Novikova", studentId: "STU-10005", amount: 60000, method: "Bank Transfer", status: "Rejected", date: "2026-03-04", contractId: "CNT-2025-00188" },
  { id: "p6", transactionId: "TXN-2836", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, method: "Bank Transfer", status: "Verified", date: "2026-03-03", contractId: "CNT-2025-00142" },
  { id: "p7", transactionId: "TXN-2835", studentName: "Dmitri Volkov", studentId: "STU-10004", amount: 105000, method: "Bank Transfer", status: "Verified", date: "2026-02-28", contractId: "CNT-2024-00215" },
  { id: "p8", transactionId: "TXN-2834", studentName: "Maria Sokolova", studentId: "STU-10003", amount: 130000, method: "Card", status: "Verified", date: "2026-02-15", contractId: "CNT-2024-00321" },
  { id: "p9", transactionId: "TXN-2833", studentName: "Elena Novikova", studentId: "STU-10005", amount: 78000, method: "Card", status: "Verified", date: "2026-01-20", contractId: "CNT-2025-00188" },
  { id: "p10", transactionId: "TXN-2832", studentName: "Ivan Kozlov", studentId: "STU-10002", amount: 95000, method: "Bank Transfer", status: "Verified", date: "2026-01-10", contractId: "CNT-2025-00089" },
];

const STATUS_OPTIONS: TxStatus[] = ["Verified", "Pending", "Rejected"];

export default function PaymentHistoryPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [methodFilter, setMethodFilter] = React.useState<string>("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const filtered = React.useMemo(() => {
    return MOCK_HISTORY.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (methodFilter && p.method !== methodFilter) return false;
      if (dateFrom && p.date < dateFrom) return false;
      if (dateTo && p.date > dateTo) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !p.studentName.toLowerCase().includes(q) &&
          !p.transactionId.toLowerCase().includes(q) &&
          !p.studentId.toLowerCase().includes(q) &&
          !p.contractId.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, statusFilter, methodFilter, dateFrom, dateTo]);

  const sorted = React.useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered]
  );

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;
  const methods = Array.from(new Set(MOCK_HISTORY.map((p) => p.method)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/finance/payments" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Payments
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Payment History</h1>
          <p className="mt-1 text-sm text-slate-600">
            Searchable archive of every transaction. Filter by date, status, method.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            type="search"
            placeholder="Search by student, ID, transaction, contract..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[200px] max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">Status: All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">Method: All</option>
            {methods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <Input
            type="date"
            placeholder="From"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="max-w-[140px]"
          />
          <Input
            type="date"
            placeholder="To"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="max-w-[140px]"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Transaction ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Contract</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Method</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((p) => (
                <tr key={p.id} className="hover:bg-emerald-50/70">
                  <td className="px-4 py-3 text-slate-700">{p.date}</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{p.transactionId}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{p.studentName}</p>
                    <p className="text-xs text-slate-500">{p.studentId}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">{p.contractId}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{formatAmount(p.amount)}</td>
                  <td className="px-4 py-3 text-slate-600">{p.method}</td>
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
                    <Link
                      href={`/finance/payments/${p.id}`}
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
        {sorted.length === 0 && (
          <p className="py-8 text-center text-slate-500">No transactions match the filters.</p>
        )}
        <p className="mt-3 text-xs text-slate-500">
          Showing {sorted.length} transaction(s). Full archive searchable above.
        </p>
      </Card>
    </div>
  );
}
