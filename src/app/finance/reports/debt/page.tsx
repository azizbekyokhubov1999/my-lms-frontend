"use client";

import Link from "next/link";
import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const AGING_DEBT = [
  { bucket: "0-30 days", amount: 185000, count: 8 },
  { bucket: "31-60 days", amount: 142000, count: 5 },
  { bucket: "61-90 days", amount: 95000, count: 3 },
  { bucket: "90+ days", amount: 30000, count: 2 },
];

const COLORS = ["#059669", "#d97706", "#dc2626", "#7c2d12"];

function exportToExcel(rows: Array<Record<string, string | number>>, filename: string) {
  const headers = Object.keys(rows[0] ?? {});
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => r[h]).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DebtReportPage() {
  const handleExportExcel = () => {
    exportToExcel(
      AGING_DEBT.map((r) => ({ Bucket: r.bucket, Amount: r.amount, Count: r.count })),
      "debt-aging-report.csv"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/finance/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Reports
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Debt Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">
            Aging breakdown: 30, 60, 90+ days overdue.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleExportExcel}>
          Export to Excel
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Aging Debt (₸)
        </h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={AGING_DEBT} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="bucket" width={70} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString()} ₸`, "Amount"]} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {AGING_DEBT.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Aging Bucket</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Count</th>
              </tr>
            </thead>
            <tbody>
              {AGING_DEBT.map((r) => (
                <tr key={r.bucket} className="border-b border-slate-100 hover:bg-emerald-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.bucket}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">{r.amount.toLocaleString()} ₸</td>
                  <td className="px-4 py-3 text-right text-slate-700">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
