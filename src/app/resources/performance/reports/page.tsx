"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

export default function PerformanceReportsPage() {
  const [generating, setGenerating] = React.useState<"pdf" | "excel" | null>(null);
  const [generated, setGenerated] = React.useState(false);

  const handleGenerate = (format: "pdf" | "excel") => {
    setGenerating(format);
    setTimeout(() => {
      setGenerating(null);
      setGenerated(true);
      alert(`Generated ${format.toUpperCase()} summary for Rectorate (Demo).`);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/resources/performance"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Performance
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Performance reports</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Generate PDF or Excel summaries for the Rectorate: rankings, feedback scores, and Q&amp;A SLA.
        </p>
      </div>

      <Card className="border-teal-100 bg-white/80">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Export options</h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Choose format and date range. Report includes all faculties and teacher-level aggregates.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleGenerate("pdf")}
            disabled={generating !== null}
            className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
          >
            {generating === "pdf" ? "Generating…" : "Generate PDF"}
          </button>
          <button
            type="button"
            onClick={() => handleGenerate("excel")}
            disabled={generating !== null}
            className="inline-flex h-10 items-center justify-center rounded-md border border-teal-600 bg-white px-4 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-50"
          >
            {generating === "excel" ? "Generating…" : "Generate Excel"}
          </button>
        </div>
        {generated && (
          <p className="mt-3 text-sm text-teal-600">
            Report ready. In production, download would start automatically.
          </p>
        )}
      </Card>
    </div>
  );
}
