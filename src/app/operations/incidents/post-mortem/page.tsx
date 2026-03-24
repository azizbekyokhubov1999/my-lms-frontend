"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { loadIncidents } from "../_shared";

export default function PostMortemPage() {
  const [reports, setReports] = React.useState(() =>
    loadIncidents().filter((i) => i.postMortem),
  );

  React.useEffect(() => {
    setReports(loadIncidents().filter((i) => i.postMortem));
  }, []);

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

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Post-Mortem Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Technical summaries and root-cause analysis for major incidents.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((inc) => (
          <Card key={inc.id} className="bg-white border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{inc.title}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {inc.id} · {inc.service}
                </p>
              </div>
              <Link
                href={`/operations/incidents/incident-detail?id=${encodeURIComponent(inc.id)}`}
                className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
              >
                Open Detail
              </Link>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Root Cause
              </p>
              <p className="mt-2 text-sm text-slate-900">{inc.postMortem?.rootCause}</p>
            </div>
            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Technical Summary
              </p>
              <p className="mt-2 text-sm text-slate-900">{inc.postMortem?.summary}</p>
            </div>
          </Card>
        ))}
        {reports.length === 0 ? (
          <Card className="bg-white border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600">
              No post-mortem reports yet. Create one from Incident Detail.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

