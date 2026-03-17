"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const DATA_SOURCES = [
  { id: "enrollment", label: "Enrollment" },
  { id: "finance", label: "Finance & revenue" },
  { id: "attendance", label: "Attendance" },
  { id: "grades", label: "Grades & GPA" },
  { id: "incidents", label: "Incidents" },
  { id: "quality", label: "Quality (AQAD)" },
];

export default function ExportCenterPage() {
  const [source, setSource] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("2024-01-01");
  const [dateTo, setDateTo] = React.useState("2025-12-31");
  const [format, setFormat] = React.useState("CSV");
  const [exporting, setExporting] = React.useState(false);

  const handleExport = () => {
    if (!source) return;
    setExporting(true);
    setTimeout(() => setExporting(false), 1200);
    alert(`Export requested: ${source}, ${dateFrom}–${dateTo}, ${format}. (Demo – no file generated.)`);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/reports" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Reports
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Export center</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Detailed filters to export raw data for external auditing.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Export filters
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Select data source, date range, and format. Export runs with current filters.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Data source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="">Select…</option>
              {DATA_SOURCES.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="CSV">CSV</option>
              <option value="Excel">Excel</option>
              <option value="JSON">JSON</option>
            </select>
          </div>
          <Input type="date" label="Date from" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input type="date" label="Date to" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <div className="mt-4">
          <Button
            type="button"
            onClick={handleExport}
            disabled={!source || exporting}
            className="bg-slate-800 hover:bg-slate-700"
          >
            {exporting ? "Exporting…" : "Export raw data"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
