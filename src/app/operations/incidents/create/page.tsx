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

function randomIncidentId() {
  return `INC-${Math.floor(10000 + Math.random() * 90000)}`;
}

function severityToPriority(sev: Severity): "critical" | "high" | "medium" {
  if (sev === "critical") return "critical";
  if (sev === "high") return "high";
  if (sev === "medium") return "medium";
  return "medium";
}

export default function CreateIncidentPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [service, setService] = React.useState("Operations");
  const [description, setDescription] = React.useState("");
  const [urgency, setUrgency] = React.useState<Severity>("high");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const create = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const safeTitle = title.trim();
      const safeService = service.trim();
      const safeDesc = description.trim();

      if (!safeTitle) return setError("Title is required.");
      if (!safeService) return setError("Service is required.");
      if (!safeDesc) return setError("Description is required.");

      setSubmitting(true);
      try {
        const now = new Date().toISOString();
        const id = randomIncidentId();
        const priority = severityToPriority(urgency);

        const incident: Incident = {
          id,
          title: safeTitle,
          service: safeService,
          severity: priority,
          urgency,
          status: "Open",
          createdAt: now,
          assignedTo: null,
          timeline: [
            {
              ts: now,
              label: "Reported",
              detail: `Incident reported with urgency: ${urgency.toUpperCase()}.`,
            },
            {
              ts: now,
              label: "Summary",
              detail: safeDesc,
            },
          ],
        };

        const raw = sessionStorage.getItem(STORAGE_KEY);
        const existing: Incident[] = raw ? (JSON.parse(raw) as Incident[]) : [];
        const next = [incident, ...existing].slice(0, 200);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));

        router.push(`/operations/incidents/${id}`);
      } catch {
        setError("Failed to create incident. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [description, router, service, title, urgency],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Create Incident</h1>
        <p className="mt-1 text-sm text-slate-100/70">
          Manually report a system failure with urgency levels.
        </p>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <form onSubmit={create} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Database connection timeouts"
              className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-100/40 outline-none focus:border-indigo-400/60"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Service / System
              </label>
              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g., PostgreSQL"
                className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-100/40 outline-none focus:border-indigo-400/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Severity)}
                className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened, impact, and any relevant context..."
              rows={6}
              className="mt-2 w-full resize-y rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-100/40 outline-none focus:border-indigo-400/60"
            />
          </div>

          {error ? <p className="text-sm text-rose-200">{error}</p> : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Incident"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}


