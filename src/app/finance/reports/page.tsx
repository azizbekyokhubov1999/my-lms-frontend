"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const FACULTIES = ["All", "Engineering", "Business", "Medicine", "Law", "Arts & Sciences"];
const COURSE_TYPES = ["All", "Bachelor", "Master", "PhD", "Certificate"];
const PAYMENT_METHODS = ["All", "Card", "Bank Transfer", "Cash"];

const MOCK_INCOME = [
  { faculty: "Engineering", revenue: 450000, expenses: 120000 },
  { faculty: "Business", revenue: 380000, expenses: 95000 },
  { faculty: "Medicine", revenue: 520000, expenses: 180000 },
  { faculty: "Law", revenue: 290000, expenses: 78000 },
  { faculty: "Arts & Sciences", revenue: 210000, expenses: 62000 },
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

export default function FinancialReportsPage() {
  const [startDate, setStartDate] = React.useState("2026-01-01");
  const [endDate, setEndDate] = React.useState("2026-03-31");
  const [faculty, setFaculty] = React.useState("All");
  const [courseType, setCourseType] = React.useState("All");
  const [paymentMethod, setPaymentMethod] = React.useState("All");

  const handleExportExcel = () => {
    const rows = MOCK_INCOME.map((r) => ({
      Faculty: r.faculty,
      Revenue: r.revenue,
      Expenses: r.expenses,
      "Net Income": r.revenue - r.expenses,
    }));
    exportToExcel(rows, `income-statement-${startDate}-${endDate}.csv`);
  };

  const totalRevenue = MOCK_INCOME.reduce((s, r) => s + r.revenue, 0);
  const totalExpenses = MOCK_INCOME.reduce((s, r) => s + r.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">
            Financial insights. Generate income statements and analytics.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/finance/reports/debt"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            Debt Analytics
          </Link>
          <Link
            href="/finance/reports/trends"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            Payment Trends
          </Link>
          <Link
            href="/finance/reports/revenue"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            Revenue Analytics
          </Link>
          <Link
            href="/finance/reports/compliance"
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Compliance & Export
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Income Statement
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">Generate by date range and filters.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-800">Faculty</label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {FACULTIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Course Type</label>
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {COURSE_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {PAYMENT_METHODS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleExportExcel}
          >
            Export to Excel
          </Button>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Faculty</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Revenue</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Expenses</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Net Income</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INCOME.map((r) => (
                <tr key={r.faculty} className="border-b border-slate-100 hover:bg-emerald-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.faculty}</td>
                  <td className="px-4 py-3 text-right text-slate-900">{r.revenue.toLocaleString()} ₸</td>
                  <td className="px-4 py-3 text-right text-slate-700">{r.expenses.toLocaleString()} ₸</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-700">{(r.revenue - r.expenses).toLocaleString()} ₸</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                <td className="px-4 py-3 text-slate-900">Total</td>
                <td className="px-4 py-3 text-right text-slate-900">{totalRevenue.toLocaleString()} ₸</td>
                <td className="px-4 py-3 text-right text-slate-700">{totalExpenses.toLocaleString()} ₸</td>
                <td className="px-4 py-3 text-right text-emerald-700">{netIncome.toLocaleString()} ₸</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
