"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import {
  INCIDENT_TEAMS,
  Incident,
  loadIncidents,
  saveIncidents,
  severityBadge,
} from "../_shared";

function severityCell(sev: Incident["severity"]) {
  if (sev === "critical") return "bg-rose-500 text-white";
  if (sev === "high") return "bg-amber-500 text-white";
  if (sev === "medium") return "bg-indigo-400 text-white";
  return "bg-slate-300 text-slate-900";
}

export default function ActiveIncidentsPage() {
  const [incidents, setIncidents] = React.useState<Incident[]>([]);
  const [assignSelections, setAssignSelections] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setIncidents(loadIncidents());
  }, []);

  const active = React.useMemo(
    () =>
      incidents
        .filter((i) => i.status !== "Resolved")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [incidents],
  );

  const assignTo = (id: string, team: string) => {
    const next = incidents.map((inc) => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        assignedTo: team,
        status: inc.status === "Open" ? "In Progress" : inc.status,
      };
    });
    setIncidents(next);
    saveIncidents(next);
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

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Active Incidents</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ongoing incidents with assignment and triage actions.
        </p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-[860px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Incident</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {active.map((inc) => (
                <tr key={inc.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-mono text-slate-600">{inc.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{inc.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{inc.service}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityCell(
                        inc.severity,
                      )}`}
                    >
                      {inc.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{inc.status}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${severityBadge("medium")}`}>
                      {inc.assignedTo ?? "Unassigned"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <select
                        value={assignSelections[inc.id] ?? inc.assignedTo ?? ""}
                        onChange={(e) =>
                          setAssignSelections((prev) => ({
                            ...prev,
                            [inc.id]: e.target.value,
                          }))
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
                      >
                        <option value="" disabled>
                          Assign...
                        </option>
                        {INCIDENT_TEAMS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const team = assignSelections[inc.id] ?? inc.assignedTo;
                          if (!team) return;
                          assignTo(inc.id, team);
                        }}
                        className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
                      >
                        Triage
                      </button>
                      <Link
                        href={`/operations/incidents/incident-detail?id=${encodeURIComponent(inc.id)}`}
                        className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
                      >
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {active.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-slate-600">
                    No active incidents.
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

