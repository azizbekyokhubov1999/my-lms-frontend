"use client";

import * as React from "react";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";
import {
  type GeneratedReport,
  type ReportDraft,
  type ReportFormat,
  type ReportType,
  OPS_REPORTS_STORAGE_KEY,
} from "../_lib/ops-reports";

const REPORT_TYPES: { value: ReportType; label: string; hint: string }[] = [
  { value: "Security", label: "Security", hint: "Audit findings, IAM, TLS, vuln posture" },
  { value: "Health", label: "Health", hint: "Uptime, SLOs, capacity, synthetic checks" },
  { value: "Performance", label: "Performance", hint: "Latency, throughput, saturation" },
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
  lines.push(`IT Operations — ${draft.reportType} report`);
  lines.push(`GeneratedAt: ${new Date().toISOString()}`);
  lines.push(`Range: ${draft.startDate} -> ${draft.endDate}`);
  lines.push(`Format: ${draft.format}`);
  lines.push("");
  lines.push("--- SUMMARY (MOCK) ---");

  if (draft.reportType === "Security") {
    lines.push("[Security]");
    lines.push("- Critical findings: 0 open");
    lines.push("- TLS: all certs valid > 30 days");
    lines.push("- IAM: quarterly review complete");
  } else if (draft.reportType === "Health") {
    lines.push("[Health]");
    lines.push("- Availability (30d): 99.95%");
    lines.push("- Saturation: within policy");
    lines.push("- Backups: last run OK");
  } else {
    lines.push("[Performance]");
    lines.push("- p95 API latency: 412 ms");
    lines.push("- Peak RPS: 8.4k");
    lines.push("- DB query p95: 38 ms");
  }

  lines.push("");
  lines.push("--- END ---");
  return lines.join("\n");
}

function formatSizeLabel(content: string) {
  const bytes = new Blob([content]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
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

function exportAsPDFLike(preview: string, draft: ReportDraft) {
  const safe = `${draft.reportType}-${draft.startDate}-${draft.endDate}`.replace(/[^a-z0-9-]/gi, "-");
  downloadBlob({
    content: preview,
    filename: `report-${safe}.pdf`,
    mime: "application/pdf",
  });
}

function exportAsXlsx(draft: ReportDraft, preview: string) {
  const rows = [
    ["ReportType", "Start", "End", "Format"],
    [draft.reportType, draft.startDate, draft.endDate, draft.format],
    [],
    ["Preview"],
    [preview.replace(/\n/g, " | ")],
  ];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const safe = `${draft.reportType}-${draft.startDate}`.replace(/[^a-z0-9-]/gi, "-");
  downloadBlob({
    content: "\uFEFF" + csv,
    filename: `report-${safe}.xlsx`,
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

const GENERATED_BY = "ops.console@lms.com";

export default function ReportGeneratorPage() {
  const today = new Date();
  const defaultStart = new Date(today.getTime() - 7 * 86400_000);

  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [draft, setDraft] = React.useState<ReportDraft>(() => ({
    reportType: "Health",
    startDate: toLocalDateInputValue(defaultStart),
    endDate: toLocalDateInputValue(today),
    format: "PDF",
  }));

  const [generated, setGenerated] = React.useState<GeneratedReport[]>([]);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [activeReport, setActiveReport] = React.useState<GeneratedReport | null>(null);
  const [shareStatus, setShareStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(OPS_REPORTS_STORAGE_KEY);
      const list: GeneratedReport[] = raw ? (JSON.parse(raw) as GeneratedReport[]) : [];
      setGenerated(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      setGenerated([]);
    }
  }, []);

  const dateOrderOk = React.useMemo(() => {
    if (!draft.startDate || !draft.endDate) return false;
    return new Date(draft.startDate) <= new Date(draft.endDate);
  }, [draft.endDate, draft.startDate]);

  const canGoNext = React.useMemo(() => {
    if (step === 1) return Boolean(draft.reportType);
    if (step === 2) return dateOrderOk;
    if (step === 3) return Boolean(draft.format);
    return false;
  }, [dateOrderOk, draft.format, draft.reportType, step]);

  const saveGenerated = React.useCallback((report: GeneratedReport) => {
    setGenerated((prev) => [report, ...prev].slice(0, 50));
    try {
      const raw = sessionStorage.getItem(OPS_REPORTS_STORAGE_KEY);
      const list: GeneratedReport[] = raw ? (JSON.parse(raw) as GeneratedReport[]) : [];
      const next = [report, ...list].slice(0, 50);
      sessionStorage.setItem(OPS_REPORTS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const generate = React.useCallback(() => {
    const preview = buildPreview(draft);
    const title = `${draft.reportType} report (${draft.startDate} – ${draft.endDate})`;
    const id = randomId();
    const report: GeneratedReport = {
      id,
      title,
      createdAt: new Date().toISOString(),
      generatedBy: GENERATED_BY,
      sizeLabel: formatSizeLabel(preview),
      draft,
      preview,
    };
    saveGenerated(report);

    if (draft.format === "PDF") exportAsPDFLike(preview, draft);
    else exportAsXlsx(draft, preview);

    setActiveReport(report);
    setPreviewOpen(true);
  }, [draft, saveGenerated]);

  const nextStep = () => setStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s));
  const prevStep = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));

  const shareReport = React.useCallback(async (report: GeneratedReport) => {
    try {
      const url = `${window.location.origin}/operations/reports/report-history#report-${report.id}`;
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

  const downloadReport = (r: GeneratedReport) => {
    if (r.draft.format === "PDF") exportAsPDFLike(r.preview, r.draft);
    else exportAsXlsx(r.draft, r.preview);
  };

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-900/70">Step</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {step} / 4
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Report generator</h1>
        <p className="mt-1 text-sm text-slate-900/80">
          Security, Health, or Performance — pick a range, format, then generate.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">Step 1: Select type</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {REPORT_TYPES.map((t) => {
                  const active = draft.reportType === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, reportType: t.value }))}
                      className={`rounded-xl border-2 px-4 py-4 text-left transition-colors ${
                        active
                          ? "border-indigo-400 bg-indigo-50"
                          : "border-slate-200 bg-white hover:border-indigo-300"
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-900">{t.label}</p>
                      <p className="mt-2 text-xs text-slate-900/75">{t.hint}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">Step 2: Date range</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900/70">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={draft.startDate}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900/70">
                    End date
                  </label>
                  <input
                    type="date"
                    value={draft.endDate}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
              </div>
              {!dateOrderOk ? (
                <p className="text-sm font-medium text-rose-600">End date must be on or after start date.</p>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">Step 3: Format</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["PDF", "XLSX"] as ReportFormat[]).map((fmt) => {
                  const active = draft.format === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, format: fmt }))}
                      className={`rounded-xl border-2 px-4 py-4 text-center text-sm font-semibold transition-colors ${
                        active
                          ? "border-indigo-400 bg-indigo-50 text-slate-900"
                          : "border-slate-200 bg-white text-slate-900 hover:border-indigo-300"
                      }`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">Step 4: Review & generate</h2>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <dl className="grid gap-2 text-sm text-slate-900">
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-900/70">Type</dt>
                    <dd className="font-semibold">{draft.reportType}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-900/70">Range</dt>
                    <dd className="font-semibold">
                      {draft.startDate} → {draft.endDate}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-900/70">Format</dt>
                    <dd className="font-semibold">{draft.format}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-900/70">
                  Preview (excerpt)
                </p>
                <pre className="mt-3 max-h-[200px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900">
                  {buildPreview(draft).split("\n").slice(0, 14).join("\n")}
                  {"\n"}...
                </pre>
              </div>
              <button
                type="button"
                onClick={generate}
                className="w-full rounded-xl bg-indigo-400 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
              >
                Generate
              </button>
            </div>
          ) : null}

          {step < 4 ? (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                disabled={!canGoNext}
                className="rounded-xl bg-indigo-400 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">This session</h2>
            <p className="mt-1 text-xs text-slate-900/75">
              Recent outputs (also listed under Report history).
            </p>

            <div className="mt-4 space-y-3">
              {generated.length === 0 ? (
                <p className="text-sm text-slate-900/80">
                  No reports yet. Complete all steps and click Generate.
                </p>
              ) : null}

              {generated.slice(0, 7).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => openPreview(r)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50/50"
                >
                  <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                  <p className="mt-1 text-xs text-slate-900/75">
                    {new Date(r.createdAt).toLocaleString()} · {r.draft.format} · {r.sizeLabel}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {previewOpen && activeReport ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  {activeReport.title}
                </h2>
                <p className="mt-1 text-sm text-slate-900/80">
                  {new Date(activeReport.createdAt).toLocaleString()} · {activeReport.draft.format} ·{" "}
                  {activeReport.sizeLabel}
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  Generated by: <span className="font-medium">{activeReport.generatedBy}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap wrap-break-word bg-slate-50 p-4 text-xs text-slate-900">
                {activeReport.preview}
              </pre>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => shareReport(activeReport)}
                className="rounded-xl border-2 border-indigo-400 bg-white px-4 py-3 text-sm font-semibold text-indigo-400 transition-colors hover:bg-indigo-50"
              >
                Share
              </button>

              <button
                type="button"
                onClick={() => downloadReport(activeReport)}
                className="rounded-xl bg-indigo-400 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Download again
              </button>
            </div>

            {shareStatus ? (
              <p className="mt-3 text-sm text-slate-900/80">{shareStatus}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
