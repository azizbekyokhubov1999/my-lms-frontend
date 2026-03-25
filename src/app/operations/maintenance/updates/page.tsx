"use client";

import * as React from "react";
import { Clock, PackageOpen, Timer } from "lucide-react";

import { Card } from "@/app/components/ui/Card";
import { Switch } from "@/app/components/ui/Switch";

import { HubBackButton } from "../HubBackButton";

type UpdateComponent = "Kernel" | "Database" | "Frontend";

type Severity = "Critical" | "Minor";

type PendingUpdate = {
  id: string;
  component: UpdateComponent;
  title: string;
  severity: Severity;
};

type UpdateScope = "Security" | "Database" | "Infrastructure" | "Full Stack";

type UpdateStatus = "Pending" | "Scheduled" | "Completed";

type ScheduledUpdate = {
  id: string;
  title: string;
  scheduledAt: string;
  scope: UpdateScope;
  status: UpdateStatus;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function badgeByStatus(status: UpdateStatus) {
  if (status === "Completed")
    return "border-emerald-500/40 bg-emerald-50 text-emerald-700";
  if (status === "Scheduled")
    return "border-amber-500/40 bg-amber-50 text-amber-800";
  return "border-amber-500/30 bg-amber-50/80 text-amber-900";
}

function severityBadge(sev: Severity) {
  if (sev === "Critical")
    return "border-rose-500/40 bg-rose-50 text-rose-800";
  return "border-slate-300 bg-slate-50 text-slate-700";
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 9)}`;
}

function estimateDowntimeMinutes(pending: PendingUpdate[]): { min: number; max: number } {
  if (pending.length === 0) return { min: 0, max: 0 };
  const critical = pending.filter((p) => p.severity === "Critical").length;
  const minor = pending.filter((p) => p.severity === "Minor").length;
  const min = critical * 12 + minor * 4;
  const max = critical * 25 + minor * 12;
  return { min, max };
}

export default function SystemUpdatesPage() {
  const [serviceMode, setServiceMode] = React.useState(false);

  const [pendingUpdates, setPendingUpdates] = React.useState<PendingUpdate[]>([
    {
      id: "p-k1",
      component: "Kernel",
      title: "CVE-2026-1102 privilege boundary fix (6.8.x)",
      severity: "Critical",
    },
    {
      id: "p-d1",
      component: "Database",
      title: "pg_stat_statements extension minor bump",
      severity: "Minor",
    },
    {
      id: "p-f1",
      component: "Frontend",
      title: "Next.js security advisory — RSC patch",
      severity: "Critical",
    },
  ]);

  const [title, setTitle] = React.useState("");
  const [scope, setScope] = React.useState<UpdateScope>("Security");
  const [scheduledAt, setScheduledAt] = React.useState(() => {
    const d = new Date(Date.now() + 2 * 3600_000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  });

  const [updates, setUpdates] = React.useState<ScheduledUpdate[]>(() => {
    const now = Date.now();
    return [
      {
        id: "u-1",
        title: "Kernel hardening patch",
        scope: "Security",
        scheduledAt: new Date(now + 5 * 3600_000).toISOString(),
        status: "Scheduled",
      },
      {
        id: "u-2",
        title: "Quarterly DB index maintenance",
        scope: "Database",
        scheduledAt: new Date(now + 28 * 3600_000).toISOString(),
        status: "Pending",
      },
    ];
  });

  const downtime = estimateDowntimeMinutes(pendingUpdates);

  const toggleServiceMode = React.useCallback((next: boolean) => {
    setServiceMode(next);
  }, []);

  const installPendingNow = React.useCallback((id: string) => {
    setPendingUpdates((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addUpdate = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const safeTitle = title.trim();
      if (!safeTitle) return;

      const iso = new Date(scheduledAt).toISOString();
      const next: ScheduledUpdate = {
        id: randomId("u"),
        title: safeTitle,
        scope,
        scheduledAt: iso,
        status: "Scheduled",
      };
      setUpdates((prev) => [next, ...prev].slice(0, 100));
      setTitle("");
    },
    [scheduledAt, scope, title],
  );

  const runUpdateNow = React.useCallback((id: string) => {
    const nowIso = new Date().toISOString();
    setUpdates((prev) =>
      prev.map((u) =>
        u.id !== id
          ? u
          : {
              ...u,
              scheduledAt: nowIso,
              status: "Completed",
            },
      ),
    );
  }, []);

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <PackageOpen className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">System updates</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pending release queue, downtime modeling, and scheduled change tickets.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-amber-500/35 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-amber-500/40 bg-amber-50">
              <Timer className="h-5 w-5 text-amber-500" aria-hidden />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Downtime estimate</h2>
              <p className="mt-1 text-sm text-slate-600">
                Aggregated rolling restart window if all <strong>pending</strong> updates are
                applied in a single maintenance sequence (excluding user-scheduled tickets below).
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums text-slate-900">
                  {pendingUpdates.length === 0
                    ? "0"
                    : `${downtime.min}–${downtime.max}`}
                </span>
                <span className="text-sm font-medium text-slate-600">
                  {pendingUpdates.length === 0 ? "minutes (no pending queue)" : "minutes est."}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Model weights critical vs. minor; verify against runbook before announcing a window.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" aria-hidden />
            <h2 className="text-sm font-semibold text-slate-900">Queue snapshot</h2>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-600">Pending installs</dt>
              <dd className="font-semibold tabular-nums text-slate-900">{pendingUpdates.length}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-600">Critical</dt>
              <dd className="font-semibold tabular-nums text-amber-800">
                {pendingUpdates.filter((p) => p.severity === "Critical").length}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Scheduled tickets</dt>
              <dd className="font-semibold tabular-nums text-slate-900">{updates.length}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Pending updates</h2>
        <p className="mt-1 text-xs text-slate-600">
          Kernel, database, and frontend packages awaiting install during the next approved window.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-[820px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Package / advisory</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUpdates.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.component}</td>
                  <td className="px-4 py-3 text-slate-700">{row.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${severityBadge(
                        row.severity,
                      )}`}
                    >
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => installPendingNow(row.id)}
                      className="rounded-lg bg-indigo-400 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                    >
                      Install now
                    </button>
                  </td>
                </tr>
              ))}
              {pendingUpdates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Queue clear — no pending updates
                    </span>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Service mode</p>
            <p className="mt-1 text-sm text-slate-600">
              When enabled, the public site enters maintenance window mode.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={serviceMode}
              onCheckedChange={toggleServiceMode}
              aria-label="Service mode toggle"
              className={serviceMode ? "bg-indigo-400!" : undefined}
            />
            <span
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                serviceMode
                  ? "border-amber-500/40 bg-amber-50 text-amber-800"
                  : "border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              {serviceMode ? "Service mode on" : "Service mode off"}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Schedule system updates</h2>
          <p className="mt-1 text-xs text-slate-600">
            Create an update ticket and schedule it for later execution.
          </p>

          <form onSubmit={addUpdate} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., TLS policy update"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Scope
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as UpdateScope)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="Security">Security</option>
                  <option value="Database">Database</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Full Stack">Full stack</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Scheduled at
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="submit"
                className="rounded-xl bg-indigo-400 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              >
                Create update ticket
              </button>
            </div>
          </form>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Ticket counts</h2>
          <p className="mt-1 text-xs text-slate-600">By lifecycle state.</p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Pending
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {updates.filter((u) => u.status === "Pending").length}
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/25 bg-amber-50/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Scheduled
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-900">
                {updates.filter((u) => u.status === "Scheduled").length}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-50/80 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Completed
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-800">
                {updates.filter((u) => u.status === "Completed").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Scheduled updates</h2>
        <p className="mt-1 text-xs text-slate-600">Execute updates manually for demo purposes.</p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-[760px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Scheduled</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((u) => (
                <tr key={u.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.title}</td>
                  <td className="px-4 py-3 text-slate-700">{u.scope}</td>
                  <td className="px-4 py-3 text-slate-700">{formatDateTime(u.scheduledAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeByStatus(
                        u.status,
                      )}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.status === "Completed" ? (
                      <span className="text-xs font-medium text-emerald-600">Installed</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => runUpdateNow(u.id)}
                        className="rounded-lg bg-indigo-400 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                      >
                        Run now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {updates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-slate-600">
                    No updates scheduled.
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
