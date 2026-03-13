"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const LIVE_STATS = {
  usersOnline: 127,
  usersTotal: 2840,
  uptimeDays: 14,
  uptimeHours: 6,
  activeApiRequests: 23,
  storageUsedPercent: 62,
  storageUsedGb: 186,
  storageTotalGb: 300,
};

const SECURITY = {
  failedLoginAttempts: 12,
  pendingIncidents: 2,
};

const RECENT_ACTIVITY: Array<{ id: string; message: string; time: string; type: "info" | "success" | "warning" }> = [
  { id: "1", message: "New Teacher account created", time: "2 min ago", type: "success" },
  { id: "2", message: "Database backup completed", time: "15 min ago", type: "success" },
  { id: "3", message: "Scheduled maintenance window started", time: "1 hour ago", type: "info" },
  { id: "4", message: "API rate limit approached for tenant T-004", time: "2 hours ago", type: "warning" },
  { id: "5", message: "New Student batch imported (240 users)", time: "3 hours ago", type: "success" },
  { id: "6", message: "SSL certificate renewed", time: "5 hours ago", type: "success" },
  { id: "7", message: "Failed login spike detected (IP 192.168.1.x)", time: "6 hours ago", type: "warning" },
];

function useSimulatedUsage(initialCpu: number, initialMem: number) {
  const [cpu, setCpu] = React.useState(initialCpu);
  const [mem, setMem] = React.useState(initialMem);
  const [history, setHistory] = React.useState<{ cpu: number; mem: number }[]>(() =>
    Array.from({ length: 24 }, () => ({ cpu: initialCpu, mem: initialMem })),
  );

  React.useEffect(() => {
    const id = setInterval(() => {
      setCpu((c) => Math.min(100, Math.max(5, c + (Math.random() - 0.5) * 12)));
      setMem((m) => Math.min(100, Math.max(20, m + (Math.random() - 0.5) * 6)));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    setHistory((h) => [...h.slice(1), { cpu, mem }]);
  }, [cpu, mem]);

  return { cpu, mem, history };
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 100;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full min-w-0" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const { cpu, mem, history } = useSimulatedUsage(42, 58);
  const cpuHistory = history.map((h) => h.cpu);
  const memHistory = history.map((h) => h.mem);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live system overview and key metrics.
        </p>
      </div>

      {/* Live Stats */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Live Stats
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Users
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              <span className="text-blue-600">{LIVE_STATS.usersOnline}</span>
              <span className="text-slate-400"> / </span>
              <span>{LIVE_STATS.usersTotal.toLocaleString()}</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Online / Total</p>
          </Card>
          <Card className="border-l-4 border-l-emerald-500 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Server Uptime
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {LIVE_STATS.uptimeDays}d {LIVE_STATS.uptimeHours}h
            </p>
            <p className="mt-0.5 text-xs text-slate-500">System health</p>
          </Card>
          <Card className="border-l-4 border-l-slate-300 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Active API Requests
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {LIVE_STATS.activeApiRequests}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Current</p>
          </Card>
          <Card className="border-l-4 border-l-indigo-500 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Storage Used
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {LIVE_STATS.storageUsedGb} GB
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {LIVE_STATS.storageUsedPercent}% of {LIVE_STATS.storageTotalGb} GB
            </p>
          </Card>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Security Overview */}
        <section className="lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Security Overview
          </h2>
          <Card className="border-l-4 border-l-amber-500 p-4 shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">Failed login attempts</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    SECURITY.failedLoginAttempts > 10
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700",
                  )}
                >
                  {SECURITY.failedLoginAttempts}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pending security incidents</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    SECURITY.pendingIncidents > 0
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700",
                  )}
                >
                  {SECURITY.pendingIncidents}
                </span>
              </li>
            </ul>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Quick Actions
          </h2>
          <Card className="flex flex-wrap gap-3 p-4 shadow-sm">
            <Button type="button" variant="primary" size="md">
              Create User
            </Button>
            <Button type="button" variant="secondary" size="md">
              System Update
            </Button>
            <Button type="button" variant="outline" size="md">
              Export Logs
            </Button>
          </Card>
        </section>
      </div>

      {/* Resource Charts */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Resource Charts
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">CPU usage</span>
              <span className="text-lg font-bold text-slate-900">{Math.round(cpu)}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${cpu}%` }}
              />
            </div>
            <div className="mt-2 h-8 w-full">
              <MiniSparkline data={cpuHistory} color="#2563eb" />
            </div>
            <p className="mt-1 text-xs text-slate-500">Real-time (last 24 samples)</p>
          </Card>
          <Card className="p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Memory usage</span>
              <span className="text-lg font-bold text-slate-900">{Math.round(mem)}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${mem}%` }}
              />
            </div>
            <div className="mt-2 h-8 w-full">
              <MiniSparkline data={memHistory} color="#059669" />
            </div>
            <p className="mt-1 text-xs text-slate-500">Real-time (last 24 samples)</p>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Recent Activity
        </h2>
        <Card className="overflow-hidden p-0 shadow-sm">
          <ul className="divide-y divide-slate-100">
            {RECENT_ACTIVITY.map((event) => (
              <li
                key={event.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/50"
              >
                <span
                  className={cn(
                    "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                    event.type === "success" && "bg-emerald-500",
                    event.type === "info" && "bg-blue-500",
                    event.type === "warning" && "bg-amber-500",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{event.message}</p>
                  <p className="text-xs text-slate-500">{event.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
