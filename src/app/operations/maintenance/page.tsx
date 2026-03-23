"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Switch } from "../../components/ui/Switch";

type UpdateScope = "Security" | "Database" | "Infrastructure" | "Full Stack";

type UpdateStatus = "Pending" | "Scheduled" | "Completed";

type ScheduledUpdate = {
  id: string;
  title: string;
  scheduledAt: string; // ISO
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
    return "border-indigo-400/40 bg-indigo-400/10 text-indigo-100";
  if (status === "Scheduled")
    return "border-indigo-400/30 bg-indigo-400/5 text-indigo-100/80";
  return "border-amber-500/40 bg-amber-500/10 text-amber-100";
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 9)}`;
}

export default function MaintenancePage() {
  const [serviceMode, setServiceMode] = React.useState(false);

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

  const [updates, setUpdates] = React.useState<ScheduledUpdate[]>([
    {
      id: "u-1",
      title: "Kernel hardening patch",
      scope: "Security",
      scheduledAt: new Date(Date.now() + 5 * 3600_000).toISOString(),
      status: "Scheduled",
    },
    {
      id: "u-2",
      title: "Quarterly DB index maintenance",
      scope: "Database",
      scheduledAt: new Date(Date.now() + 28 * 3600_000).toISOString(),
      status: "Pending",
    },
  ]);

  const toggleServiceMode = React.useCallback((next: boolean) => {
    setServiceMode(next);
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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Maintenance</h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Service Mode toggle and scheduled system updates.
          </p>
        </div>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100">Service Mode</p>
            <p className="mt-1 text-sm text-slate-100/70">
              When enabled, the public site enters maintenance window mode.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={serviceMode}
              onCheckedChange={toggleServiceMode}
              aria-label="Service mode toggle"
              className={serviceMode ? "bg-indigo-400 border-indigo-400" : "bg-slate-200"}
            />
            <span
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                serviceMode
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
                  : "border-indigo-400/40 bg-indigo-400/10 text-indigo-100"
              }`}
            >
              {serviceMode ? "Service Mode On" : "Service Mode Off"}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Schedule System Updates
          </h2>
          <p className="mt-1 text-xs text-slate-100/60">
            Create an update ticket and schedule it for later execution.
          </p>

          <form onSubmit={addUpdate} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., TLS policy update"
                  className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  Scope
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as UpdateScope)}
                  className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                >
                  <option value="Security">Security</option>
                  <option value="Database">Database</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Scheduled At
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="submit"
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
              >
                Create Update Ticket
              </button>
            </div>
          </form>
        </Card>

        <Card className="border-indigo-400/30 bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-100">Quick Insights</h2>
          <p className="mt-1 text-xs text-slate-100/60">
            Status snapshot for pending operations.
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Pending
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {updates.filter((u) => u.status === "Pending").length}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Scheduled
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {updates.filter((u) => u.status === "Scheduled").length}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Completed
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {updates.filter((u) => u.status === "Completed").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <h2 className="text-sm font-semibold text-slate-100">
          Scheduled Updates
        </h2>
        <p className="mt-1 text-xs text-slate-100/60">
          Execute updates manually for demo purposes.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-indigo-400/20">
          <table className="min-w-[760px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-slate-100/60">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Scheduled</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((u) => (
                <tr key={u.id} className="border-t border-indigo-400/20">
                  <td className="px-4 py-3 text-slate-100/80 font-medium">
                    {u.title}
                  </td>
                  <td className="px-4 py-3 text-slate-100/70">{u.scope}</td>
                  <td className="px-4 py-3 text-slate-100/70">
                    {formatDateTime(u.scheduledAt)}
                  </td>
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
                      <span className="text-xs text-slate-100/60">Done</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => runUpdateNow(u.id)}
                        className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-xs font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
                      >
                        Run Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {updates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-slate-100/70">
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

