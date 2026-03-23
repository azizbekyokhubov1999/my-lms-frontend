"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { Card } from "../../../components/ui/Card";

type Severity = "critical" | "high" | "medium" | "low";

type IncidentTimelineEvent = {
  ts: string;
  label: string;
  detail: string;
};

type Incident = {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  urgency: Severity;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  assignedTo: string | null;
  timeline: IncidentTimelineEvent[];
  postMortem?: {
    createdAt: string;
    summary: string;
    rootCause: string;
  };
};

const STORAGE_KEY = "ops_incidents_v1";

function severityPill(sev: Severity) {
  if (sev === "critical") return "border-rose-500/50 bg-rose-500/15 text-rose-100";
  if (sev === "high") return "border-amber-400/40 bg-amber-400/10 text-amber-100";
  if (sev === "medium") return "border-indigo-400/40 bg-indigo-400/10 text-indigo-200";
  return "border-slate-400/30 bg-slate-400/10 text-slate-200";
}

function formatShort(d: Date) {
  return d.toLocaleString([], { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function IncidentDetailPage() {
  const params = useParams<{ incidentId: string }>();
  const incidentId = params?.incidentId;

  const [incident, setIncident] = React.useState<Incident | null>(null);
  const [postMortemOpen, setPostMortemOpen] = React.useState(false);
  const [summary, setSummary] = React.useState("");
  const [rootCause, setRootCause] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!incidentId) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const list: Incident[] = raw ? (JSON.parse(raw) as Incident[]) : [];
      const found = list.find((i) => i.id === incidentId) ?? null;
      setIncident(found);
    } catch {
      setIncident(null);
    }
  }, [incidentId]);

  const persist = React.useCallback(
    (next: Incident) => {
      setIncident(next);
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const list: Incident[] = raw ? (JSON.parse(raw) as Incident[]) : [];
        const idx = list.findIndex((i) => i.id === next.id);
        const updated = idx >= 0 ? [...list.slice(0, idx), next, ...list.slice(idx + 1)] : list;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    },
    [],
  );

  const createPostMortem = React.useCallback(async () => {
    if (!incident) return;
    const safeSummary = summary.trim();
    const safeRoot = rootCause.trim();
    if (!safeSummary || !safeRoot) return;

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const next: Incident = {
        ...incident,
        postMortem: {
          createdAt: now,
          summary: safeSummary,
          rootCause: safeRoot,
        },
        timeline: [
          ...incident.timeline,
          {
            ts: now,
            label: "Post-Mortem Created",
            detail: `Root cause captured. Summary saved.`,
          },
        ],
      };
      persist(next);
      setPostMortemOpen(false);
      setSummary("");
      setRootCause("");
    } finally {
      setSaving(false);
    }
  }, [incident, persist, rootCause, saving, summary]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Incident Detail</h1>
        <p className="mt-1 text-sm text-slate-100/70">
          Timeline of the incident and post-mortem creation.
        </p>
      </div>

      {!incident ? (
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-sm text-slate-100/70">Incident not found in this session.</p>
        </Card>
      ) : (
        <>
          <Card className="border-indigo-400/30 bg-slate-950">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityPill(
                      incident.severity,
                    )}`}
                  >
                    Severity: {incident.severity.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-100/70">
                    {incident.status} · {formatShort(new Date(incident.createdAt))}
                  </span>
                </div>

                <p className="mt-3 text-lg font-semibold text-slate-100">
                  {incident.title}
                </p>
                <p className="mt-1 text-sm text-slate-100/70">
                  Service: {incident.service}
                </p>
                {incident.assignedTo ? (
                  <p className="mt-1 text-sm text-slate-100/70">
                    Assigned to: {incident.assignedTo}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-slate-100/70">Not assigned</p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <button
                  type="button"
                  onClick={() => setPostMortemOpen(true)}
                  className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
                >
                  Create Post-Mortem
                </button>
              </div>
            </div>
          </Card>

          <Card className="border-indigo-400/30 bg-slate-950">
            <h2 className="text-sm font-semibold text-slate-100">
              Timeline
            </h2>
            <div className="mt-4 space-y-3">
              {incident.timeline.map((ev, idx) => (
                <div key={`${ev.ts}-${idx}`} className="flex gap-3">
                  <div className="flex w-32 shrink-0 flex-col">
                    <p className="text-xs font-semibold text-slate-100/60">
                      {formatShort(new Date(ev.ts))}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100/90">
                      {ev.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-100/70">
                      {ev.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {incident.postMortem ? (
              <div className="mt-6 rounded-xl border border-indigo-400/30 bg-indigo-400/5 p-4">
                <p className="text-sm font-semibold text-slate-100">
                  Post-mortem saved
                </p>
                <p className="mt-2 text-sm text-slate-100/70">
                  <span className="font-semibold text-slate-100">Root cause:</span>{" "}
                  {incident.postMortem.rootCause}
                </p>
                <p className="mt-2 text-sm text-slate-100/70">
                  <span className="font-semibold text-slate-100">Summary:</span>{" "}
                  {incident.postMortem.summary}
                </p>
              </div>
            ) : null}
          </Card>
        </>
      )}

      {postMortemOpen ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-indigo-400/40 bg-slate-950 p-5">
            <h2 className="text-lg font-semibold text-slate-100">Create Post-Mortem</h2>
            <p className="mt-1 text-sm text-slate-100/70">
              Capture the root cause and a concise summary of what happened.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  Root cause
                </label>
                <textarea
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-y rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-y rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPostMortemOpen(false)}
                className="rounded-xl border border-indigo-400/30 bg-slate-900/30 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createPostMortem}
                disabled={saving}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Create Post-Mortem"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

