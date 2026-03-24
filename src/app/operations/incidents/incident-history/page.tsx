"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { loadIncidents, severityBadge } from "../_shared";

export default function IncidentHistoryPage() {
  const [incidents, setIncidents] = React.useState(() => loadIncidents());

  React.useEffect(() => {
    setIncidents(loadIncidents());
  }, []);

  const sorted = [...incidents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

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
        <h1 className="text-2xl font-semibold text-slate-900">Incident History</h1>
        <p className="mt-1 text-sm text-slate-600">
          Historical log of incidents and outcomes.
        </p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-[760px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((inc) => (
                <tr key={inc.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-mono text-slate-600">{inc.id}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{inc.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${severityBadge(inc.severity)}`}>
                      {inc.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{inc.status}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(inc.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-slate-600">
                    No incidents in history.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

