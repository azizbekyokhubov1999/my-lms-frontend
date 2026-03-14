"use client";

import Link from "next/link";
import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const FISCAL_YEAR = [
  { month: "Jul", projected: 120, actual: 118 },
  { month: "Aug", projected: 125, actual: 122 },
  { month: "Sep", projected: 130, actual: 128 },
  { month: "Oct", projected: 135, actual: 130 },
  { month: "Nov", projected: 140, actual: 142 },
  { month: "Dec", projected: 145, actual: 138 },
  { month: "Jan", projected: 150, actual: 148 },
  { month: "Feb", projected: 155, actual: 152 },
  { month: "Mar", projected: 160, actual: 158 },
];

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

export default function PaymentTrendsPage() {
  const handleExportExcel = () => {
    exportToExcel(
      FISCAL_YEAR.map((r) => ({ Month: r.month, "Projected (k)": r.projected, "Actual (k)": r.actual })),
      "payment-trends-fy.csv"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/finance/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Reports
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Payment Trends</h1>
          <p className="mt-1 text-sm text-slate-600">
            Projected Revenue vs Actual Collection over the fiscal year.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleExportExcel}>
          Export to Excel
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Projected vs Actual (k ₸)
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={FISCAL_YEAR} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="projected"
                name="Projected Revenue"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#64748b" }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual Collection"
                stroke="#059669"
                strokeWidth={2}
                dot={{ fill: "#059669" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Month</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Projected</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actual</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Variance</th>
              </tr>
            </thead>
            <tbody>
              {FISCAL_YEAR.map((r) => (
                <tr key={r.month} className="border-b border-slate-100 hover:bg-emerald-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.month}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{r.projected}k</td>
                  <td className="px-4 py-3 text-right text-slate-900">{r.actual}k</td>
                  <td className={`px-4 py-3 text-right font-medium ${r.actual >= r.projected ? "text-emerald-700" : "text-amber-700"}`}>
                    {r.actual >= r.projected ? "+" : ""}{(r.actual - r.projected).toFixed(0)}k
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
