"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

type AuditState = "Safe" | "Audit";

type ChecklistItem = {
  id: string;
  area: "GDPR" | "ISO";
  title: string;
  evidence: string;
  state: AuditState;
};

type GroupKey = "GDPR" | "ISO";

function badgeStyle(state: AuditState) {
  if (state === "Safe") {
    return "border-indigo-400/40 bg-indigo-400/10 text-indigo-100";
  }
  return "border-amber-500/40 bg-amber-500/10 text-amber-100";
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

export default function OperationsCompliancePage() {
  const [lastAuditAt, setLastAuditAt] = React.useState<string | null>(
    null,
  );
  const [running, setRunning] = React.useState(false);

  const [items, setItems] = React.useState<ChecklistItem[]>([
    {
      id: "gdpr-1",
      area: "GDPR",
      title: "Data retention policy is defined and enforced",
      evidence: "Retention config + access logs",
      state: "Safe",
    },
    {
      id: "gdpr-2",
      area: "GDPR",
      title: "Consent tracking for user data processing",
      evidence: "Consent registry export sample",
      state: "Audit",
    },
    {
      id: "gdpr-3",
      area: "GDPR",
      title: "Data subject request workflow is documented",
      evidence: "Runbook + ticket samples",
      state: "Safe",
    },
    {
      id: "iso-1",
      area: "ISO",
      title: "Access control reviews are performed periodically",
      evidence: "Quarterly review reports",
      state: "Safe",
    },
    {
      id: "iso-2",
      area: "ISO",
      title: "Incident management meets defined SLAs",
      evidence: "Post-mortem templates + SLA dashboard",
      state: "Audit",
    },
    {
      id: "iso-3",
      area: "ISO",
      title: "Security training completion is tracked",
      evidence: "Completion logs and attestations",
      state: "Safe",
    },
    {
      id: "iso-4",
      area: "ISO",
      title: "Change management approvals are enforced",
      evidence: "Approval workflow exports",
      state: "Safe",
    },
  ]);

  const runAudit = React.useCallback(() => {
    if (running) return;
    setRunning(true);

    const start = new Date();
    const tick = window.setTimeout(() => {
      setItems((prev) =>
        prev.map((it) => {
          // Simulate realistic results: mostly Safe, some Audit.
          const r = Math.random();
          const next: AuditState = r < 0.72 ? "Safe" : "Audit";
          return { ...it, state: next };
        }),
      );
      setLastAuditAt(new Date().toISOString());
      setRunning(false);
    }, 1400);

    return () => window.clearTimeout(tick);
  }, [running]);

  const groupCounts = React.useMemo(() => {
    const res: Record<GroupKey, { Safe: number; Audit: number }> = {
      GDPR: { Safe: 0, Audit: 0 },
      ISO: { Safe: 0, Audit: 0 },
    };

    for (const it of items) {
      res[it.area][it.state] += 1;
    }

    return res;
  }, [items]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Compliance Audit
          </h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Checklist-style review for GDPR and ISO standards.
          </p>
          {lastAuditAt ? (
            <p className="mt-2 text-xs text-slate-100/50">
              Last run: {formatDateTime(lastAuditAt)}
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-100/50">
              No audits run yet.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <button
            type="button"
            onClick={runAudit}
            disabled={running}
            className="rounded-xl border border-amber-500/60 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? "Running Audit..." : "Run Audit"}
          </button>
          <p className="text-xs text-slate-100/50">
            Safe uses indigo-400; Audit/Issues uses amber-500.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(["GDPR", "ISO"] as GroupKey[]).map((area) => (
          <Card
            key={area}
            className="border-indigo-400/30 bg-slate-950"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
              {area}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3">
                <p className="text-xs font-semibold text-slate-100/70">
                  Safe
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">
                  {groupCounts[area].Safe}
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <p className="text-xs font-semibold text-slate-100/70">
                  Audit needed
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">
                  {groupCounts[area].Audit}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        {(["GDPR", "ISO"] as GroupKey[]).map((area) => (
          <div key={area}>
            <h2 className="text-sm font-semibold text-slate-100">{area} Standards</h2>
            <div className="mt-3 space-y-3">
              {items
                .filter((it) => it.area === area)
                .map((it) => (
                  <Card
                    key={it.id}
                    className={`border-indigo-400/30 bg-slate-950`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle(
                              it.state,
                            )}`}
                          >
                            {it.state}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-100/60">
                            {it.id.toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-100">
                          {it.title}
                        </p>
                        <p className="mt-2 text-sm text-slate-100/70">
                          Evidence: <span className="text-slate-100/90">{it.evidence}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl border border-indigo-400/20 bg-indigo-400/5 flex items-center justify-center">
                          <span className={`h-3 w-3 rounded-full ${it.state === "Safe" ? "bg-indigo-400" : "bg-amber-500"}`} aria-hidden />
                        </div>
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


