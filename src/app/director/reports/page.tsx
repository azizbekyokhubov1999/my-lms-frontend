"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const REPORT_HISTORY = [
  { id: "r1", name: "Institutional Health Report", generated: "2025-03-06 09:00", type: "Strategic" },
  { id: "r2", name: "Institutional Health Report", generated: "2025-03-01 08:30", type: "Strategic" },
  { id: "r3", name: "Q4 Financial Summary", generated: "2025-02-28 14:00", type: "Financial" },
  { id: "r4", name: "Institutional Health Report", generated: "2025-02-24 09:00", type: "Strategic" },
];

export default function ExecutiveReportsPage() {
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Executive reports, history, scheduled delivery, and export center.
        </p>
      </div>

      {/* 1. Executive Reports – one-click generation */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Executive reports
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          One-click generation of the Institutional Health Report (KPIs, financials, quality, incidents).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="bg-slate-800 hover:bg-slate-700"
          >
            {generating ? "Generating…" : "Generate Institutional Health Report"}
          </Button>
          {generated && (
            <span className="text-sm font-medium text-emerald-600">Report generated. Check Report History below.</span>
          )}
        </div>
      </Card>

      {/* 2. Report History – archive */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Report history
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Archive of all previously generated strategic reports.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-800">
                <th className="px-4 py-3 text-left font-medium text-slate-200">Report name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-200">Generated</th>
                <th className="px-4 py-3 text-left font-medium text-slate-200">Type</th>
                <th className="px-4 py-3 text-right font-medium text-slate-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {REPORT_HISTORY.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">{row.generated}</td>
                  <td className="px-4 py-3 text-slate-600">{row.type}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="text-slate-600 underline hover:text-slate-900">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/director/reports/scheduled">
          <Card className="h-full border-slate-200 bg-slate-50/50 transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Scheduled reports</h2>
            <p className="mt-1 text-xs text-slate-600">
              Automatically email the Dashboard summary to the Rector every Monday.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-slate-600">Configure →</span>
          </Card>
        </Link>
        <Link href="/director/reports/export">
          <Card className="h-full border-slate-200 bg-slate-50/50 transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Export center</h2>
            <p className="mt-1 text-xs text-slate-600">
              Detailed filters to export raw data for external auditing.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-slate-600">Open export →</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
