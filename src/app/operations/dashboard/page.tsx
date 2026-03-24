import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Database,
  Gauge,
  KeyRound,
  Package,
  Shield,
} from "lucide-react";

import { Card } from "@/app/components/ui/Card";

const ALERTS = [
  { id: "a1", time: "2 min ago", message: "Backup completed — primary DB snapshot verified", tone: "ok" as const },
  { id: "a2", time: "8 min ago", message: "High CPU detected on api-tier-02 (p95 > 85%)", tone: "warn" as const },
  { id: "a3", time: "22 min ago", message: "TLS certificate renewed — edge wildcard", tone: "ok" as const },
  { id: "a4", time: "1 hr ago", message: "Scheduled report: Weekly security digest sent", tone: "ok" as const },
  { id: "a5", time: "2 hr ago", message: "Failover drill completed — no customer impact", tone: "ok" as const },
];

const SNAPSHOTS = [
  {
    name: "Backup",
    href: "/operations/backup",
    summary: "Last successful backup",
    value: "2026-03-24 · 04:12 UTC",
    icon: Database,
  },
  {
    name: "Performance",
    href: "/operations/performance",
    summary: "Current avg. latency",
    value: "120 ms",
    icon: Gauge,
  },
  {
    name: "Access",
    href: "/operations/access",
    summary: "Active VPN sessions",
    value: "42",
    icon: KeyRound,
  },
  {
    name: "Compliance",
    href: "/operations/compliance",
    summary: "Next audit",
    value: "2026-04-02",
    icon: Shield,
  },
] as const;

export default function OperationsDashboardPage() {
  return (
    <div className="space-y-8 bg-slate-50 text-slate-900">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            IT Operations Global Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Consolidated posture across health, incidents, delivery, and security.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            System Status: Operational
          </span>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                System uptime
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">99.98%</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
              <Activity className="h-5 w-5 text-indigo-400" aria-hidden />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">Rolling 30 days · SLA window</p>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active incidents
              </p>
              <p className="mt-2 text-xl font-bold text-red-500">2 Critical</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">3 total open · triage in progress</p>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending updates
              </p>
              <p className="mt-2 text-lg font-bold text-amber-500">5 updates ready</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50">
              <Package className="h-5 w-5 text-amber-500" aria-hidden />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">Kernel · DB · frontend queue</p>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Security score
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-blue-500">94/100</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50">
              <Shield className="h-5 w-5 text-blue-500" aria-hidden />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">Policy + controls composite</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Sub-module snapshots
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SNAPSHOTS.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.href}
                  className="flex h-full flex-col border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                      <Icon className="h-5 w-5 text-indigo-400" aria-hidden />
                    </div>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.summary}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
                  <div className="mt-4 flex flex-1 flex-col justify-end">
                    <Link
                      href={item.href}
                      prefetch
                      className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-indigo-400 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-400 shadow-sm transition-colors hover:bg-indigo-50"
                    >
                      View full detail
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Live alert feed
          </h2>
          <Card className="border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Bell className="h-4 w-4 text-indigo-400" aria-hidden />
              <span className="text-sm font-semibold text-slate-900">Recent system events</span>
            </div>
            <ul className="mt-4 space-y-0 divide-y divide-slate-200">
              {ALERTS.map((a) => (
                <li key={a.id} className="flex gap-3 py-3 first:pt-0">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      a.tone === "warn" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">{a.time}</p>
                    <p className="mt-2 text-sm text-slate-900">{a.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
