"use client";

import Link from "next/link";
import * as React from "react";
import { AlertTriangle, ClipboardList, FileText, History } from "lucide-react";

import { Card } from "../../components/ui/Card";
import { loadIncidents } from "./_shared";

export default function IncidentsHubPage() {
  const [incidentsCount, setIncidentsCount] = React.useState({
    active: 0,
    resolvedToday: 0,
    avgMinutes: 0,
  });

  React.useEffect(() => {
    const incidents = loadIncidents();
    const active = incidents.filter((i) => i.status !== "Resolved").length;
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const resolvedToday = incidents.filter(
      (i) =>
        i.status === "Resolved" &&
        i.timeline.some(
          (t) =>
            t.label.toLowerCase().includes("resolved") &&
            new Date(t.ts).getTime() >= startToday.getTime(),
        ),
    ).length;
    const resolved = incidents.filter((i) => i.status === "Resolved");
    const avgMinutes =
      resolved.length > 0
        ? Math.round(
            resolved.reduce((acc, inc) => {
              const created = new Date(inc.createdAt).getTime();
              const resolvedEvent = inc.timeline.find((t) =>
                t.label.toLowerCase().includes("resolved"),
              );
              if (!resolvedEvent) return acc;
              return acc + (new Date(resolvedEvent.ts).getTime() - created) / 60000;
            }, 0) / resolved.length,
          )
        : 0;
    setIncidentsCount({ active, resolvedToday, avgMinutes });
  }, []);

  return (
    <div className="space-y-6 bg-slate-50">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Incidents Overview</h1>
        <p className="mt-1 text-sm text-slate-600">
          Central hub for active issues, reporting, historical logs, and post-mortems.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Active Incidents
          </p>
          <p className="mt-2 text-3xl font-semibold text-rose-600">{incidentsCount.active}</p>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Resolved Today
          </p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">
            {incidentsCount.resolvedToday}
          </p>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Avg Resolution Time
          </p>
          <p className="mt-2 text-3xl font-semibold text-indigo-400">
            {incidentsCount.avgMinutes}m
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Active Incidents</p>
              <p className="mt-1 text-sm text-slate-600">
                Review and triage ongoing issues in real time.
              </p>
            </div>
            <AlertTriangle className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              href="/operations/incidents/active-incidents"
              className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
            >
              Open
            </Link>
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
            >
              Triage
            </button>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Create New Incident</p>
              <p className="mt-1 text-sm text-slate-600">
                Report a failure and assign urgency quickly.
              </p>
            </div>
            <ClipboardList className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <Link
              href="/operations/incidents/create-incident"
              className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
            >
              Open Form
            </Link>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Incident History</p>
              <p className="mt-1 text-sm text-slate-600">
                Browse historical incidents and outcomes.
              </p>
            </div>
            <History className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <Link
              href="/operations/incidents/incident-history"
              className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
            >
              Open History
            </Link>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Post-Mortem Reports</p>
              <p className="mt-1 text-sm text-slate-600">
                Read technical analysis of major resolved issues.
              </p>
            </div>
            <FileText className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <Link
              href="/operations/incidents/post-mortem"
              className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
            >
              Open Reports
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
