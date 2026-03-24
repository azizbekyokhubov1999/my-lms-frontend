"use client";

import * as React from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

export default function PerformanceReportsPage() {
  const [period, setPeriod] = React.useState("Weekly");
  const [format, setFormat] = React.useState("PDF");
  const [message, setMessage] = React.useState("");

  const generate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(`System Speed Audit generated: ${period} (${format}).`);
  };

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/performance" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Performance Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Performance Reports</h1>
        </div>
        <SlidersHorizontal className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <form onSubmit={generate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Audit Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
              >
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Export Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
              >
                <option>PDF</option>
                <option>Excel</option>
              </select>
            </div>
          </div>

          <button type="submit" className="rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Generate System Speed Audit
          </button>

          {message ? <p className="text-sm font-medium text-indigo-600">{message}</p> : null}
        </form>
      </Card>
    </div>
  );
}
