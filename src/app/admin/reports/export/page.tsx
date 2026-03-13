"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const DATA_SETS = [
  { id: "users", label: "Users", description: "Accounts, roles, profile fields" },
  { id: "grades", label: "Grades", description: "Assignment and exam scores, feedback" },
  { id: "payments", label: "Payments", description: "Transactions, refunds, revenue" },
  { id: "courses", label: "Courses", description: "Courses, enrollments, content metadata" },
  { id: "activity", label: "Activity", description: "Logins, page views, events" },
];

const EXPORT_FORMATS = [
  { id: "excel", label: "Excel (.xlsx)", tools: "Excel, Google Sheets" },
  { id: "csv", label: "CSV", tools: "Excel, Tableau, Power BI, any BI tool" },
  { id: "json", label: "JSON", tools: "Custom scripts, Power BI" },
];

export default function DataExportPage() {
  const [selectedSets, setSelectedSets] = React.useState<Set<string>>(new Set());
  const [format, setFormat] = React.useState("csv");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [exporting, setExporting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const toggleSet = (id: string) => {
    setSelectedSets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExport = () => {
    if (selectedSets.size === 0) {
      alert("Select at least one data set.");
      return;
    }
    setExporting(true);
    setDone(false);
    setTimeout(() => {
      setExporting(false);
      setDone(true);
      const ext = format === "excel" ? "xlsx" : format === "json" ? "json" : "csv";
      const names = Array.from(selectedSets).join("-");
      const blob = new Blob(["Demo export: " + names], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${names}-${new Date().toISOString().slice(0, 10)}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Reports
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Data Export</h1>
          <p className="mt-1 text-sm text-slate-600">
            Select data sets and export for Excel, Tableau, Power BI, or other BI tools.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/reports" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">System Reports</Link>
          <Link href="/admin/reports/analytics" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Analytics</Link>
          <Link href="/admin/reports/export" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Data Export</Link>
        </nav>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Select data sets
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Choose one or more data sets to include in the export.
        </p>
        <ul className="mt-4 space-y-2">
          {DATA_SETS.map((ds) => (
            <li key={ds.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50/50">
                <input
                  type="checkbox"
                  checked={selectedSets.has(ds.id)}
                  onChange={() => toggleSet(ds.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <div>
                  <span className="font-medium text-slate-900">{ds.label}</span>
                  <p className="text-sm text-slate-500">{ds.description}</p>
                </div>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Export options
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Format</label>
            <div className="mt-2 space-y-2">
              {EXPORT_FORMATS.map((f) => (
                <label key={f.id} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="format"
                    value={f.id}
                    checked={format === f.id}
                    onChange={() => setFormat(f.id)}
                    className="h-4 w-4 border-slate-300 text-blue-900 focus:ring-blue-900"
                  />
                  <span className="text-sm text-slate-900">{f.label}</span>
                  <span className="text-xs text-slate-500">— {f.tools}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Date range (optional)</label>
            <div className="mt-2 flex gap-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="max-w-[140px]"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="max-w-[140px]"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Leave empty for full export.</p>
          </div>
        </div>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={exporting || selectedSets.size === 0}
          >
            {exporting ? "Exporting…" : "Export"}
          </Button>
          {done && <p className="mt-2 text-sm text-emerald-600">Export completed. File downloaded.</p>}
        </div>
      </Card>
    </div>
  );
}
