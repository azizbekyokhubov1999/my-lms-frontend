"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

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
};

const STORAGE_KEY = "ops_incidents_v1";

const TEAMS = ["Security", "Network", "Database", "Integrations", "Operations"];

const SEED_INCIDENTS: Incident[] = [
  {
    id: "INC-10041",
    title: "Classmate Sync Failures",
    service: "Classmate",
    severity: "critical",
    urgency: "critical",
    status: "Open",
    createdAt: new Date(Date.now() - 40 * 60_000).toISOString(),
    assignedTo: null,
    timeline: [
      {
        ts: new Date(Date.now() - 42 * 60_000).toISOString(),
        label: "Detection",
        detail: "Webhook delivery failures exceed threshold.",
      },
      {
        ts: new Date(Date.now() - 39 * 60_000).toISOString(),
        label: "Triage",
        detail: "Correlated with downstream retry queue growth.",
      },
    ],
  },
  {
    id: "INC-10055",
    title: "Database Latency Spike",
    service: "PostgreSQL",
    severity: "high",
    urgency: "high",
    status: "In Progress",
    createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
    assignedTo: "Database",
    timeline: [
      {
        ts: new Date(Date.now() - 20 * 60_000).toISOString(),
        label: "Detection",
        detail: "p95 latency breached SLO for 7 minutes.",
      },
      {
        ts: new Date(Date.now() - 17 * 60_000).toISOString(),
        label: "Investigation",
        detail: "Slow queries match index scan regression.",
      },
    ],
  },
  {
    id: "INC-10063",
    title: "Webhook Callback Retries Increasing",
    service: "1C",
    severity: "medium",
    urgency: "medium",
    status: "Open",
    createdAt: new Date(Date.now() - 8 * 60_000).toISOString(),
    assignedTo: null,
    timeline: [
      {
        ts: new Date(Date.now() - 9 * 60_000).toISOString(),
        label: "Detection",
        detail: "Retry rate increased after payload validation warnings.",
      },
    ],
  },
];

function formatRelative(tsIso: string) {
  const deltaSec = Math.floor((Date.now() - new Date(tsIso).getTime()) / 1000);
  if (deltaSec < 60) return `${deltaSec}s ago`;
  const m = Math.floor(deltaSec / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function severityStyles(sev: Severity) {
  if (sev === "critical")
    return "border-rose-500/40 bg-rose-500/10 text-rose-200";
  if (sev === "high")
    return "border-amber-400/30 bg-amber-400/10 text-amber-100";
  return "border-indigo-400/30 bg-indigo-400/10 text-indigo-200";
}

function severityPill(sev: Severity) {
  if (sev === "critical") return "border-rose-500/50 bg-rose-500/15 text-rose-100";
  if (sev === "high") return "border-amber-400/40 bg-amber-400/10 text-amber-100";
  return "border-indigo-400/40 bg-indigo-400/10 text-indigo-200";
}

export default function ActiveIncidentsPage() {
  const router = useRouter();

  const [incidents, setIncidents] = React.useState<Incident[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [assignSelections, setAssignSelections] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setIncidents(JSON.parse(raw) as Incident[]);
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INCIDENTS));
        setIncidents(SEED_INCIDENTS);
      }
    } catch {
      setIncidents(SEED_INCIDENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = React.useCallback((next: Incident[]) => {
    setIncidents(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const assignTo = React.useCallback(
    (id: string, team: string) => {
      const next = incidents.map((inc) => {
        if (inc.id !== id) return inc;
        const now = new Date().toISOString();
        return {
          ...inc,
          assignedTo: team,
          status: inc.status === "Open" ? "In Progress" : inc.status,
          timeline: [
            ...inc.timeline,
            {
              ts: now,
              label: "Assignment",
              detail: `Assigned to ${team}.`,
            },
          ],
        };
      });
      persist(next);
    },
    [incidents, persist],
  );

  const active = React.useMemo(() => {
    // High-priority = critical + high
    const hp = incidents.filter((i) => i.severity === "critical" || i.severity === "high");
    return [...hp].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [incidents]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Active Incidents</h1>
        <p className="mt-1 text-sm text-slate-100/70">
          High-priority list with severity badges and assign actions.
        </p>
      </div>

      {loading ? (
        <div className="text-slate-100/70">Loading incidents...</div>
      ) : null}

      <div className="grid gap-4">
        {active.length === 0 ? (
          <Card className="border-indigo-400/30 bg-slate-950">
            <p className="text-sm text-slate-100/70">No active high-priority incidents.</p>
          </Card>
        ) : null}

        {active.map((inc) => (
          <Card
            key={inc.id}
            className={`border-indigo-400/30 bg-slate-950 ${severityStyles(inc.severity)}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityPill(
                      inc.severity,
                    )}`}
                  >
                    Severity: {inc.severity.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-100/70">
                    {inc.status} · {formatRelative(inc.createdAt)}
                  </span>
                </div>

                <p className="mt-3 text-lg font-semibold text-slate-100">
                  {inc.title}
                </p>
                <p className="mt-1 text-sm text-slate-100/70">
                  Service: {inc.service}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <div className="flex items-center gap-2">
                  <select
                    value={assignSelections[inc.id] ?? inc.assignedTo ?? ""}
                    onChange={(e) =>
                      setAssignSelections((prev) => ({
                        ...prev,
                        [inc.id]: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                  >
                    <option value="" disabled>
                      Assign...
                    </option>
                    {TEAMS.map((t) => (
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
                    className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!assignSelections[inc.id] && !inc.assignedTo}
                  >
                    Assign
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push(`/operations/incidents/${inc.id}`)}
                    className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
                  >
                    View
                  </button>
                </div>

                {inc.assignedTo ? (
                  <p className="text-xs text-slate-100/60">
                    Assigned to: {inc.assignedTo}
                  </p>
                ) : (
                  <p className="text-xs text-slate-100/60">Not assigned</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


