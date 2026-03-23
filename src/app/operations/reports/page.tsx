"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

type MetricsKey = "health" | "security" | "incidents";

type ReportFormat = "PDF" | "Excel";

type ReportMetric = {
  key: MetricsKey;
  label: string;
  description: string;
};

type ReportDraft = {
  startDate: string;
  endDate: string;
  metrics: MetricsKey[];
  includeAppendix: boolean;
  format: ReportFormat;
};

type GeneratedReport = {
  id: string;
  title: string;
  createdAt: string;
  draft: ReportDraft;
  preview: string;
};

const STORAGE_KEY = "ops_technical_reports_v1";

const METRICS: ReportMetric[] = [
  {
    key: "health",
    label: "Health",
    description: "Uptime, CPU/RAM/Disk gauges, and system telemetry.",
  },
  {
    key: "security",
    label: "Security",
    description: "Threat overview, TLS expiry, and firewall status.",
  },
  {
    key: "incidents",
    label: "Incidents",
    description: "Active incidents summary and post-mortem notes.",
  },
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalDateInputValue(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function randomId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function buildPreview(draft: ReportDraft) {
  const lines: string[] = [];
  lines.push("IT Operations - Technical Report");
  lines.push(`GeneratedAt: ${new Date().toISOString()}`);
  lines.push(`Range: ${draft.startDate} -> ${draft.endDate}`);
  lines.push(`Metrics: ${draft.metrics.map((m) => m.toUpperCase()).join(", ") || "(none)"}`);
  lines.push(`IncludeAppendix: ${draft.includeAppendix ? "Yes" : "No"}`);
  lines.push("");
  lines.push("--- MODULE SUMMARY (MOCK) ---");

  for (const m of draft.metrics) {
    if (m === "health") {
      lines.push("[Health]");
      lines.push("- Server uptime: stable");
      lines.push("- CPU/RAM/Disk utilization: within thresholds");
      lines.push("");
    }
    if (m === "security") {
      lines.push("[Security]");
      lines.push("- Threats: no sustained critical spikes");
      lines.push("- TLS: certificates expiring beyond safe window");
      lines.push("- Firewall: rules active");
      lines.push("");
    }
    if (m === "incidents") {
      lines.push("[Incidents]");
      lines.push("- Active high-priority items: monitored");
      lines.push("- Post-mortems: template + action items available");
      lines.push("");
    }
  }

  if (draft.includeAppendix) {
    lines.push("--- APPENDIX (MOCK) ---");
    lines.push("- Data source references (placeholder)");
    lines.push("- Export generation notes (placeholder)");
    lines.push("");
  }

  return lines.join("\n");
}

function downloadBlob({ content, filename, mime }: { content: string; filename: string; mime: string }) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportAsPDFLike(preview: string) {
  // Placeholder export: downloads text with `.pdf` extension.
  downloadBlob({
    content: preview,
    filename: `technical-report-${new Date().toISOString().slice(0, 10)}.pdf`,
    mime: "application/pdf",
  });
}

function exportAsExcelLike(draft: ReportDraft) {
  const rows: string[] = [];
  rows.push("Metric,Included,RangeStart,RangeEnd,AppendixIncluded");
  for (const m of METRICS) {
    const included = draft.metrics.includes(m.key) ? "Yes" : "No";
    rows.push(
      `${m.label},${included},${draft.startDate},${draft.endDate},${draft.includeAppendix ? "Yes" : "No"}`,
    );
  }
  const csv = rows.join("\n");
  downloadBlob({
    content: csv,
    filename: `technical-report-${new Date().toISOString().slice(0, 10)}.xlsx`,
    mime: "application/vnd.ms-excel",
  });
}

export default function OperationsReportsPage() {
  const today = new Date();
  const defaultStart = new Date(today.getTime() - 7 * 86400_000);

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [draft, setDraft] = React.useState<ReportDraft>(() => ({
    startDate: toLocalDateInputValue(defaultStart),
    endDate: toLocalDateInputValue(today),
    metrics: ["health", "security"],
    includeAppendix: false,
    format: "PDF",
  }));

  const [generated, setGenerated] = React.useState<GeneratedReport[]>([]);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [activeReport, setActiveReport] = React.useState<GeneratedReport | null>(null);
  const [shareStatus, setShareStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const list: GeneratedReport[] = raw ? (JSON.parse(raw) as GeneratedReport[]) : [];
      setGenerated(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      setGenerated([]);
    }
  }, []);

  const toggleMetric = React.useCallback((key: MetricsKey) => {
    setDraft((prev) => {
      const exists = prev.metrics.includes(key);
      const nextMetrics = exists ? prev.metrics.filter((m) => m !== key) : [...prev.metrics, key];
      return { ...prev, metrics: nextMetrics };
    });
  }, []);

  const canGoNext = React.useMemo(() => {
    if (step === 1) return Boolean(draft.startDate && draft.endDate);
    if (step === 2) return draft.metrics.length > 0;
    return true;
  }, [draft.endDate, draft.metrics.length, draft.startDate, step]);

  const saveGenerated = React.useCallback((report: GeneratedReport) => {
    setGenerated((prev) => [report, ...prev].slice(0, 50));
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const list: GeneratedReport[] = raw ? (JSON.parse(raw) as GeneratedReport[]) : [];
      const next = [report, ...list].slice(0, 50);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const generate = React.useCallback(() => {
    const preview = buildPreview(draft);
    const title = `Technical Report (${draft.startDate} → ${draft.endDate})`;
    const id = randomId();
    const report: GeneratedReport = {
      id,
      title,
      createdAt: new Date().toISOString(),
      draft,
      preview,
    };
    saveGenerated(report);

    if (draft.format === "PDF") exportAsPDFLike(preview);
    else exportAsExcelLike(draft);

    setActiveReport(report);
    setPreviewOpen(true);
  }, [draft, saveGenerated]);

  const nextStep = () => setStep((s) => (s === 1 ? 2 : 3));
  const prevStep = () => setStep((s) => (s === 3 ? 2 : 1));

  const shareReport = React.useCallback(async (report: GeneratedReport) => {
    try {
      const url = `${window.location.origin}/operations/reports#report-${report.id}`;
      await navigator.clipboard.writeText(url);
      setShareStatus("Share link copied to clipboard.");
      window.setTimeout(() => setShareStatus(null), 2000);
    } catch {
      setShareStatus("Could not copy link (clipboard permission).");
      window.setTimeout(() => setShareStatus(null), 2500);
    }
  }, []);

  const openPreview = React.useCallback((report: GeneratedReport) => {
    setActiveReport(report);
    setPreviewOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Report Generator</h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Multi-step generation for Health, Security, and Incidents exports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-indigo-400/30 bg-indigo-400/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/60">
              Step
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-100">
              {step} / 3
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-2">
          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-100">Step 1: Date Range</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={draft.startDate}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                    End date
                  </label>
                  <input
                    type="date"
                    value={draft.endDate}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-100">Step 2: Metrics & Format</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                    Metrics
                  </p>
                  <div className="space-y-2">
                    {METRICS.map((m) => {
                      const checked = draft.metrics.includes(m.key);
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => toggleMetric(m.key)}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                            checked
                              ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                              : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:border-indigo-400/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">{m.label}</p>
                              <p className="mt-1 text-xs text-slate-100/60">
                                {m.description}
                              </p>
                            </div>
                            <span
                              className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${
                                checked
                                  ? "border-indigo-400/60 bg-indigo-400/10"
                                  : "border-indigo-400/20 bg-slate-950/10"
                              }`}
                            >
                              {checked ? "✓" : ""}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                    Output
                  </p>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                      Format
                    </label>
                    <select
                      value={draft.format}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, format: e.target.value as ReportFormat }))
                      }
                      className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                    >
                      <option value="PDF">PDF</option>
                      <option value="Excel">Excel</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-100">
                      Include appendix
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.includeAppendix}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, includeAppendix: e.target.checked }))
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-100">Step 3: Review & Export</h2>
              <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4">
                <p className="text-sm font-semibold text-slate-100">
                  {draft.metrics.length ? "Metrics selected" : "No metrics selected"}
                </p>
                <p className="mt-1 text-sm text-slate-100/70">
                  Range: {draft.startDate} → {draft.endDate}
                </p>
                <p className="mt-1 text-sm text-slate-100/70">
                  Format: {draft.format}
                </p>
                <p className="mt-1 text-sm text-slate-100/70">
                  Appendix: {draft.includeAppendix ? "Included" : "Not included"}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-400/20 bg-slate-950/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  Preview (first ~30 lines)
                </p>
                <pre className="mt-3 max-h-[260px] overflow-y-auto whitespace-pre-wrap wrap-break-word rounded-xl border border-indigo-400/20 bg-slate-950 p-3 text-xs text-slate-100/70">
                  {buildPreview(draft)
                    .split("\n")
                    .slice(0, 30)
                    .join("\n")}
                  {"\n"}...
                </pre>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="rounded-xl border border-indigo-400/30 bg-slate-950/30 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => (step === 3 ? generate() : nextStep())}
              disabled={!canGoNext}
              className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {step === 3 ? "Generate Report" : "Next"}
            </button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-indigo-400/30 bg-slate-950">
            <h2 className="text-sm font-semibold text-slate-100">Technical Reports</h2>
            <p className="mt-1 text-xs text-slate-100/60">
              Library of previously generated reports.
            </p>

            <div className="mt-4 space-y-3">
              {generated.length === 0 ? (
                <p className="text-sm text-slate-100/70">
                  No reports generated yet. Create one using the generator.
                </p>
              ) : null}

              {generated.slice(0, 7).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => openPreview(r)}
                  className="w-full rounded-xl border border-indigo-400/20 bg-slate-950/30 px-4 py-3 text-left transition-colors hover:border-indigo-400/40 hover:bg-indigo-400/5"
                >
                  <p className="text-sm font-semibold text-slate-100">{r.title}</p>
                  <p className="mt-1 text-xs text-slate-100/60">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-100/60">
                    {r.draft.format} · Metrics: {r.draft.metrics.length}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {generated.length > 7 ? (
            <Card className="border-indigo-400/30 bg-slate-950">
              <p className="text-sm font-semibold text-slate-100">More reports available</p>
              <p className="mt-1 text-xs text-slate-100/60">
                Generate more to populate the library; preview from the latest cards.
              </p>
            </Card>
          ) : null}
        </div>
      </div>

      {previewOpen && activeReport ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-indigo-400/40 bg-slate-950 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-100">
                  {activeReport.title}
                </h2>
                <p className="mt-1 text-sm text-slate-100/70">
                  Created: {new Date(activeReport.createdAt).toLocaleString()} · Format:{" "}
                  {activeReport.draft.format}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-indigo-400/30 bg-slate-900/30 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/10"
              >
                Close
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-indigo-400/20">
              <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap wrap-break-word bg-slate-950 p-4 text-xs text-slate-100/70">
                {activeReport.preview}
              </pre>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => shareReport(activeReport)}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
              >
                Share
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeReport.draft.format === "PDF") exportAsPDFLike(activeReport.preview);
                  else exportAsExcelLike(activeReport.draft);
                }}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
              >
                Download Again
              </button>
            </div>

            {shareStatus ? (
              <p className="mt-3 text-sm text-slate-100/70">{shareStatus}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}


