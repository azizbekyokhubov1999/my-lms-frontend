"use client";

import Link from "next/link";
import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const PROFITABILITY = [
  { name: "Engineering", revenue: 450, cost: 180, profit: 270 },
  { name: "Business", revenue: 380, cost: 95, profit: 285 },
  { name: "Medicine", revenue: 520, cost: 220, profit: 300 },
  { name: "Law", revenue: 290, cost: 100, profit: 190 },
  { name: "Arts & Sciences", revenue: 210, cost: 80, profit: 130 },
];

const COLORS = ["#059669", "#0891b2", "#7c3aed", "#d97706", "#64748b"];

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

export default function RevenueAnalyticsPage() {
  const handleExportExcel = () => {
    exportToExcel(
      PROFITABILITY.map((r) => ({
        "Course/Department": r.name,
        Revenue: r.revenue,
        Cost: r.cost,
        Profit: r.profit,
        "Margin %": ((r.profit / r.revenue) * 100).toFixed(1),
      })),
      "revenue-analytics.csv"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/finance/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Reports
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Revenue Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">
            Profitability metrics per course or department.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleExportExcel}>
          Export to Excel
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Profit by Department (k ₸)
        </h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PROFITABILITY} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}k`} />
              <Tooltip
                formatter={(v: number) => [`${v}k ₸`, ""]}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="profit" radius={[4, 4, 0, 0]} name="Profit">
                {PROFITABILITY.map((_, i) => (
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
                <th className="px-4 py-3 text-left font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Revenue</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Cost</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Profit</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Margin</th>
              </tr>
            </thead>
            <tbody>
              {PROFITABILITY.map((r) => (
                <tr key={r.name} className="border-b border-slate-100 hover:bg-emerald-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{r.revenue}k ₸</td>
                  <td className="px-4 py-3 text-right text-slate-700">{r.cost}k ₸</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-700">{r.profit}k ₸</td>
                  <td className="px-4 py-3 text-right text-slate-600">{((r.profit / r.revenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
