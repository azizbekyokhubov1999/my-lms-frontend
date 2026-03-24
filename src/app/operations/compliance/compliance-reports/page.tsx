"use client";

import * as React from "react";
import Link from "next/link";
import { FileBarChart2 } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

export default function ComplianceReportsPage() {
  const [includeAuditLogs, setIncludeAuditLogs] = React.useState(true);
  const [includeGdpr, setIncludeGdpr] = React.useState(true);
  const [includeRetention, setIncludeRetention] = React.useState(true);
  const [msg, setMsg] = React.useState("");

  const downloadPdf = () => {
    const sections: string[] = [];
    if (includeAuditLogs) sections.push("Audit logs");
    if (includeGdpr) sections.push("GDPR status");
    if (includeRetention) sections.push("Retention policy");
    const body = [
      "Compliance Report (PDF bundle - simulated)",
      `Sections: ${sections.length ? sections.join(", ") : "(none selected)"}`,
      `Generated: ${new Date().toISOString()}`,
    ].join("\n");
    const blob = new Blob([body], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compliance-report.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setMsg("PDF report prepared with selected sections.");
  };

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/operations/compliance"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to Compliance Hub
        </Link>
        <FileBarChart2 className="h-6 w-6 text-indigo-400" />
      </div>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Compliance Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Choose sections to include in the official compliance documentation export.
        </p>

        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={includeAuditLogs}
              onChange={(e) => setIncludeAuditLogs(e.target.checked)}
              className="h-4 w-4 accent-indigo-500"
            />
            <span className="text-sm font-medium text-slate-900">Include audit logs summary</span>
            <span className="ml-auto inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
              Recommended
            </span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={includeGdpr}
              onChange={(e) => setIncludeGdpr(e.target.checked)}
              className="h-4 w-4 accent-indigo-500"
            />
            <span className="text-sm font-medium text-slate-900">Include GDPR status</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={includeRetention}
              onChange={(e) => setIncludeRetention(e.target.checked)}
              className="h-4 w-4 accent-indigo-500"
            />
            <span className="text-sm font-medium text-slate-900">Include retention policy</span>
          </label>
        </div>

        <button
          type="button"
          onClick={downloadPdf}
          className="mt-6 rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Download PDF Report
        </button>
        {msg ? <p className="mt-3 text-sm font-medium text-indigo-600">{msg}</p> : null}
      </Card>
    </div>
  );
}
