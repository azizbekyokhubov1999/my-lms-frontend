export type Severity = "critical" | "high" | "medium" | "low";

export type IncidentTimelineEvent = {
  ts: string;
  label: string;
  detail: string;
};

export type Incident = {
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

export const INCIDENTS_STORAGE_KEY = "ops_incidents_v1";

export const INCIDENT_TEAMS = [
  "Security",
  "Network",
  "Database",
  "Integrations",
  "Operations",
];

export function seedIncidents(nowMs: number = Date.now()): Incident[] {
  return [
    {
      id: "INC-10041",
      title: "Classmate Sync Failures",
      service: "Classmate",
      severity: "critical",
      urgency: "critical",
      status: "Open",
      createdAt: new Date(nowMs - 40 * 60_000).toISOString(),
      assignedTo: null,
      timeline: [
        {
          ts: new Date(nowMs - 42 * 60_000).toISOString(),
          label: "Detected",
          detail: "Webhook delivery failures exceed threshold.",
        },
        {
          ts: new Date(nowMs - 39 * 60_000).toISOString(),
          label: "Investigating",
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
      createdAt: new Date(nowMs - 18 * 60_000).toISOString(),
      assignedTo: "Database",
      timeline: [
        {
          ts: new Date(nowMs - 20 * 60_000).toISOString(),
          label: "Detected",
          detail: "p95 latency breached SLO for 7 minutes.",
        },
        {
          ts: new Date(nowMs - 17 * 60_000).toISOString(),
          label: "Investigating",
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
      status: "Resolved",
      createdAt: new Date(nowMs - 10 * 3600_000).toISOString(),
      assignedTo: "Integrations",
      timeline: [
        {
          ts: new Date(nowMs - 10.2 * 3600_000).toISOString(),
          label: "Detected",
          detail: "Retry rate increased after payload validation warnings.",
        },
        {
          ts: new Date(nowMs - 9.8 * 3600_000).toISOString(),
          label: "Resolved",
          detail: "Validation rules patched and queue drained.",
        },
      ],
      postMortem: {
        createdAt: new Date(nowMs - 9.5 * 3600_000).toISOString(),
        summary: "Validation mismatch caused repeated retries.",
        rootCause: "Incorrect payload schema mapping for optional fields.",
      },
    },
  ];
}

export function loadIncidents(): Incident[] {
  try {
    const raw = sessionStorage.getItem(INCIDENTS_STORAGE_KEY);
    if (!raw) {
      const seed = seedIncidents();
      sessionStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Incident[];
  } catch {
    return seedIncidents();
  }
}

export function saveIncidents(next: Incident[]) {
  try {
    sessionStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors in UI mock mode
  }
}

export function severityBadge(sev: Severity) {
  if (sev === "critical") return "border-rose-500/50 bg-rose-500/15 text-rose-700";
  if (sev === "high") return "border-amber-500/40 bg-amber-500/15 text-amber-700";
  if (sev === "medium") return "border-indigo-400/40 bg-indigo-400/10 text-indigo-700";
  return "border-slate-300 bg-slate-100 text-slate-700";
}

