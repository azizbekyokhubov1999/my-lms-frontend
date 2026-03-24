"use client";

import * as React from "react";
import { FileBarChart2 } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

function csvEscape(cell: string) {
  if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

function buildHealthRows() {
  return [
    ["Metric", "Value", "Unit", "Status"],
    ["API availability (30d)", "99.94", "%", "Healthy"],
    ["p95 latency", "412", "ms", "Healthy"],
    ["Error budget burn", "12", "%", "Healthy"],
    ["Disk committed", "78", "%", "Watch"],
    ["Replica lag (max)", "180", "ms", "Healthy"],
  ];
}

function buildCostRows() {
  return [
    ["Category", "Budget USD", "Actual USD", "Unit efficiency"],
    ["Compute", "120000", "108000", "0.91"],
    ["Storage", "64000", "71000", "0.88"],
    ["Network", "22000", "19000", "0.94"],
    ["Licensing", "38000", "35000", "0.92"],
  ];
}

export default function CapacityReportsPage() {
  const [infraHealth, setInfraHealth] = React.useState(true);
  const [costEfficiency, setCostEfficiency] = React.useState(true);
  const [period, setPeriod] = React.useState("2026-02");

  const exportExcel = () => {
    const sections: string[] = [];
    if (infraHealth) {
      sections.push("=== Infrastructure Health ===");
      sections.push(buildHealthRows().map((r) => r.map(csvEscape).join(",")).join("\n"));
    }
    if (costEfficiency) {
      sections.push("\n=== Cost Efficiency ===");
      sections.push(buildCostRows().map((r) => r.map(csvEscape).join(",")).join("\n"));
    }
    sections.push(`\nGenerated,${new Date().toISOString()},,`);
    sections.push(`Period,${period},,`);
    const blob = new Blob(["\uFEFF", sections.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `capacity-report-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const rows: string[] = [];
    if (infraHealth) {
      rows.push("<h2>Infrastructure Health</h2><table border='1' cellpadding='6'>");
      buildHealthRows().forEach((r, i) => {
        rows.push(
          `<tr>${r.map((c) => (i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`,
        );
      });
      rows.push("</table>");
    }
    if (costEfficiency) {
      rows.push("<h2>Cost Efficiency</h2><table border='1' cellpadding='6'>");
      buildCostRows().forEach((r, i) => {
        rows.push(
          `<tr>${r.map((c) => (i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`,
        );
      });
      rows.push("</table>");
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Capacity Report</title>
      <style>body{font-family:system-ui,sans-serif;color:#0f172a;padding:24px;}h1{font-size:18px;}h2{font-size:14px;margin-top:20px;}table{border-collapse:collapse;width:100%;font-size:12px;}th{background:#f1f5f9}button{margin-top:16px;padding:10px 16px;border-radius:8px;border:2px solid #818cf8;background:#818cf8;color:#fff;font-weight:600;cursor:pointer}</style>
      </head><body>
      <h1>IT Operations — Capacity report</h1>
      <p>Period: ${period} · Generated ${new Date().toLocaleString()}</p>
      ${rows.join("")}
      <p style="margin-top:16px;font-size:11px;color:#64748b">Choose Print and select &quot;Save as PDF&quot; as the destination.</p>
      <button type="button" onclick="window.print()">Print / Save as PDF</button>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    }
  };

  const canExport = infraHealth || costEfficiency;

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <FileBarChart2 className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Capacity reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Build exports for executives and finance. Excel uses CSV (Excel-compatible UTF-8); PDF
          uses the browser print dialog (Save as PDF).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Free space (hot + warm)
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">1.2 TB</p>
          <p className="mt-1 text-xs text-slate-600">After deduplication · healthy headroom</p>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Efficiency score
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">0.87</p>
          <p className="mt-1 text-xs text-slate-600">Workload fit vs. provisioned capacity</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Report builder</h2>
        <p className="mt-1 text-xs text-slate-600">
          Select sections to include, then export in the format your stakeholders need.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Reporting period
            </label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>
        </div>

        <fieldset className="mt-5 space-y-3 rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Sections
          </legend>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={infraHealth}
              onChange={(e) => setInfraHealth(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-400 focus:ring-indigo-400"
            />
            <span className="text-sm text-slate-900">
              <span className="font-semibold">Infrastructure health</span> — SLIs/SLOs, latency,
              error budget, disk commitment
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={costEfficiency}
              onChange={(e) => setCostEfficiency(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-400 focus:ring-indigo-400"
            />
            <span className="text-sm text-slate-900">
              <span className="font-semibold">Cost efficiency</span> — budget vs. actual, unit
              economics, variance commentary
            </span>
          </label>
        </fieldset>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={!canExport}
            onClick={exportExcel}
            className="rounded-xl border-2 border-indigo-400 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-400 shadow-sm transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export Excel (.csv)
          </button>
          <button
            type="button"
            disabled={!canExport}
            onClick={exportPdf}
            className="rounded-xl bg-indigo-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export PDF (print)
          </button>
        </div>
      </Card>
    </div>
  );
}
