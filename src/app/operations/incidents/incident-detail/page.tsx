"use client";

import Link from "next/link";
import * as React from "react";
import { useSearchParams } from "next/navigation";

import { Card } from "../../../components/ui/Card";
import { Incident, loadIncidents, saveIncidents, severityBadge } from "../_shared";

function formatShort(d: Date) {
  return d.toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function IncidentDetailPage() {
  const searchParams = useSearchParams();
  const incidentId = searchParams.get("id");
  const [incident, setIncident] = React.useState<Incident | null>(null);
  const [postMortemOpen, setPostMortemOpen] = React.useState(false);
  const [summary, setSummary] = React.useState("");
  const [rootCause, setRootCause] = React.useState("");

  React.useEffect(() => {
    const list = loadIncidents();
    const found = incidentId ? list.find((i) => i.id === incidentId) ?? null : null;
    setIncident(found);
  }, [incidentId]);

  const createPostMortem = () => {
    if (!incident || !summary.trim() || !rootCause.trim()) return;
    const now = new Date().toISOString();
    const nextIncident: Incident = {
      ...incident,
      postMortem: {
        createdAt: now,
        summary: summary.trim(),
        rootCause: rootCause.trim(),
      },
      timeline: [
        ...incident.timeline,
        { ts: now, label: "Resolved", detail: "Post-mortem created and resolution documented." },
      ],
      status: "Resolved",
    };
    const list = loadIncidents().map((i) => (i.id === nextIncident.id ? nextIncident : i));
    saveIncidents(list);
    setIncident(nextIncident);
    setPostMortemOpen(false);
    setSummary("");
    setRootCause("");
  };

  return (
    <div className="space-y-5 bg-slate-50">
      <div>
        <Link
          href="/operations/incidents"
          className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
        >
          Back to Incident Overview
        </Link>
      </div>

      {!incident ? (
        <Card className="bg-white border-slate-200 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Incident Detail</h1>
          <p className="mt-2 text-sm text-slate-600">
            Incident not found. Open from Active Incidents or Incident History.
          </p>
        </Card>
      ) : (
        <>
          <Card className="bg-white border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Incident Detail</h1>
                <p className="mt-1 text-sm text-slate-600">{incident.title}</p>
              </div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${severityBadge(incident.severity)}`}>
                {incident.severity.toUpperCase()}
              </span>
            </div>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Incident Lifecycle Timeline
            </h2>
            <div className="mt-4 space-y-3">
              {incident.timeline.map((ev, idx) => (
                <div key={`${ev.ts}-${idx}`} className="flex gap-3">
                  <div className="w-40 shrink-0">
                    <p className="text-xs font-semibold text-slate-600">
                      {formatShort(new Date(ev.ts))}
                    </p>
                  </div>
                  <div className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">{ev.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{ev.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setPostMortemOpen(true)}
                className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
              >
                Create Post-Mortem
              </button>
            </div>
          </Card>
        </>
      )}

      {postMortemOpen ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Create Post-Mortem</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Root cause
                </label>
                <textarea
                  rows={4}
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Summary
                </label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPostMortemOpen(false)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createPostMortem}
                className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

