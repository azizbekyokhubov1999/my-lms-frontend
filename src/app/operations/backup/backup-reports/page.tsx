"use client";

import * as React from "react";
import Link from "next/link";
import { FileBarChart2 } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

export default function BackupReportsPage() {
  const [fromDate, setFromDate] = React.useState("2026-03-01");
  const [toDate, setToDate] = React.useState("2026-03-06");
  const [message, setMessage] = React.useState("");

  const generateReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(`Report generated for ${fromDate} to ${toDate}.`);
  };

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/backup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Backup Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Backup Reports</h1>
          <p className="mt-1 text-sm text-slate-600">Generate backup health reports for a selected date range.</p>
        </div>
        <FileBarChart2 className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <form onSubmit={generateReport} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Generate Report
          </button>

          {message ? <p className="text-sm font-medium text-indigo-600">{message}</p> : null}
        </form>
      </Card>
    </div>
  );
}
