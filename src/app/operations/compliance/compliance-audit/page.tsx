"use client";

import * as React from "react";
import Link from "next/link";
import { ClipboardCheck, Upload } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type PassFail = "pass" | "fail";

type ChecklistItem = {
  id: string;
  area: "GDPR" | "ISO";
  title: string;
  evidenceNote: string;
  result: PassFail;
};

type GroupKey = "GDPR" | "ISO";

function statusBadge(result: PassFail) {
  if (result === "pass") {
    return "border-emerald-200 bg-emerald-50 text-emerald-600";
  }
  return "border-amber-200 bg-amber-50 text-amber-600";
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ComplianceAuditPage() {
  const [lastAuditAt, setLastAuditAt] = React.useState<string | null>(null);
  const [running, setRunning] = React.useState(false);

  const [items, setItems] = React.useState<ChecklistItem[]>([
    {
      id: "gdpr-1",
      area: "GDPR",
      title: "Data retention policy is defined and enforced",
      evidenceNote: "Retention config + access logs",
      result: "pass",
    },
    {
      id: "gdpr-2",
      area: "GDPR",
      title: "Consent tracking for user data processing",
      evidenceNote: "Consent registry export sample",
      result: "fail",
    },
    {
      id: "gdpr-3",
      area: "GDPR",
      title: "Data subject request workflow is documented",
      evidenceNote: "Runbook + ticket samples",
      result: "pass",
    },
    {
      id: "iso-1",
      area: "ISO",
      title: "Access control reviews are performed periodically",
      evidenceNote: "Quarterly review reports",
      result: "pass",
    },
    {
      id: "iso-2",
      area: "ISO",
      title: "Incident management meets defined SLAs",
      evidenceNote: "Post-mortem templates + SLA dashboard",
      result: "fail",
    },
    {
      id: "iso-3",
      area: "ISO",
      title: "Security training completion is tracked",
      evidenceNote: "Completion logs and attestations",
      result: "pass",
    },
    {
      id: "iso-4",
      area: "ISO",
      title: "Change management approvals are enforced",
      evidenceNote: "Approval workflow exports",
      result: "pass",
    },
  ]);

  const [uploadMsg, setUploadMsg] = React.useState<Record<string, string>>({});

  const toggleResult = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, result: it.result === "pass" ? "fail" : "pass" } : it)),
    );
  };

  const onEvidenceUpload = (id: string) => {
    setUploadMsg((prev) => ({
      ...prev,
      [id]: "Evidence file queued for review (simulated).",
    }));
  };

  const runAudit = React.useCallback(() => {
    if (running) return;
    setRunning(true);

    window.setTimeout(() => {
      setItems((prev) =>
        prev.map((it) => {
          const r = Math.random();
          const next: PassFail = r < 0.78 ? "pass" : "fail";
          return { ...it, result: next };
        }),
      );
      setLastAuditAt(new Date().toISOString());
      setRunning(false);
    }, 1400);
  }, [running]);

  const groupCounts = React.useMemo(() => {
    const res: Record<GroupKey, { pass: number; fail: number }> = {
      GDPR: { pass: 0, fail: 0 },
      ISO: { pass: 0, fail: 0 },
    };

    for (const it of items) {
      res[it.area][it.result === "pass" ? "pass" : "fail"] += 1;
    }

    return res;
  }, [items]);

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/operations/compliance"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Compliance Hub
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">Security &amp; Audit</h1>
            <ClipboardCheck className="h-6 w-6 text-indigo-400" />
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Security standards checklist with Pass/Fail and evidence capture.
          </p>
          {lastAuditAt ? (
            <p className="mt-2 text-xs text-slate-500">Last automated scan: {formatDateTime(lastAuditAt)}</p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">No automated scan run yet.</p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <button
            type="button"
            onClick={runAudit}
            disabled={running}
            className="rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? "Running Audit..." : "Run Audit"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(["GDPR", "ISO"] as GroupKey[]).map((area) => (
          <Card key={area} className="border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{area}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-600">Pass</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-600">{groupCounts[area].pass}</p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-600">Fail</p>
                <p className="mt-2 text-2xl font-semibold text-amber-600">{groupCounts[area].fail}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        {(["GDPR", "ISO"] as GroupKey[]).map((area) => (
          <div key={area}>
            <h2 className="text-sm font-semibold text-slate-900">{area} Standards</h2>
            <div className="mt-3 space-y-3">
              {items
                .filter((it) => it.area === area)
                .map((it) => (
                  <Card key={it.id} className="border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
                              it.result,
                            )}`}
                          >
                            {it.result === "pass" ? "Pass" : "Fail"}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                            {it.id.toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{it.title}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          Expected evidence:{" "}
                          <span className="text-slate-900">{it.evidenceNote}</span>
                        </p>
                        {uploadMsg[it.id] ? (
                          <p className="mt-2 text-xs font-medium text-indigo-600">{uploadMsg[it.id]}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <span className="text-xs font-medium text-slate-600">Result</span>
                          <button
                            type="button"
                            onClick={() => toggleResult(it.id)}
                            className={`rounded-md px-3 py-1 text-xs font-semibold ${
                              it.result === "pass"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {it.result === "pass" ? "Pass" : "Fail"}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onEvidenceUpload(it.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-indigo-400 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                        >
                          <Upload className="h-4 w-4 text-indigo-400" />
                          Evidence Upload
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
