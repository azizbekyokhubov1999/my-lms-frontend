"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Severity = "critical" | "warning" | "info";

interface AlertItem {
  id: string;
  trigger: string;
  description: string;
  severity: Severity;
  at: string;
}

const MOCK_ALERTS: AlertItem[] = [
  { id: "1", trigger: "High CPU Usage", description: "CPU above 90% for 5 minutes", severity: "critical", at: "2026-03-06 10:45" },
  { id: "2", trigger: "Storage 90% Full", description: "Course materials volume at 90% capacity", severity: "warning", at: "2026-03-06 09:30" },
  { id: "3", trigger: "API Latency Spike", description: "P95 response time > 500ms", severity: "warning", at: "2026-03-06 09:15" },
  { id: "4", trigger: "Teams Integration Down", description: "Microsoft Teams connector unreachable", severity: "critical", at: "2026-03-06 08:00" },
  { id: "5", trigger: "Scheduled Backup Completed", description: "Nightly backup finished successfully", severity: "info", at: "2026-03-06 06:00" },
  { id: "6", trigger: "Certificate Expiry (30 days)", description: "SSL certificate renews in 30 days", severity: "info", at: "2026-03-05 12:00" },
];

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: "bg-red-100 text-red-800",
  warning: "bg-amber-100 text-amber-800",
  info: "bg-sky-100 text-sky-800",
};

export default function AlertsPage() {
  const [filter, setFilter] = React.useState<Severity | "">("");
  const alerts = React.useMemo(
    () => (filter ? MOCK_ALERTS.filter((a) => a.severity === filter) : MOCK_ALERTS),
    [filter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/monitoring" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Monitoring
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Alerts</h1>
          <p className="mt-1 text-sm text-slate-600">
            System triggers: High CPU, storage, latency, and operational events.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/monitoring" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">System Health</Link>
          <Link href="/admin/monitoring/performance" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Performance</Link>
          <Link href="/admin/monitoring/storage" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Storage</Link>
          <Link href="/admin/monitoring/alerts" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Alerts</Link>
        </nav>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Filter by severity:</span>
          <button
            type="button"
            onClick={() => setFilter("")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              filter === "" ? "bg-slate-200 text-slate-900" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("critical")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              filter === "critical" ? "bg-red-200 text-red-900" : "bg-red-100 text-red-700 hover:bg-red-200",
            )}
          >
            Critical
          </button>
          <button
            type="button"
            onClick={() => setFilter("warning")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              filter === "warning" ? "bg-amber-200 text-amber-900" : "bg-amber-100 text-amber-700 hover:bg-amber-200",
            )}
          >
            Warning
          </button>
          <button
            type="button"
            onClick={() => setFilter("info")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              filter === "info" ? "bg-sky-200 text-sky-900" : "bg-sky-100 text-sky-700 hover:bg-sky-200",
            )}
          >
            Info
          </button>
        </div>

        <ul className="divide-y divide-slate-100">
          {alerts.map((alert) => (
            <li key={alert.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0">
              <div>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", SEVERITY_STYLES[alert.severity])}>
                  {alert.severity}
                </span>
                <p className="mt-1 font-medium text-slate-900">{alert.trigger}</p>
                <p className="text-sm text-slate-600">{alert.description}</p>
                <p className="mt-0.5 text-xs text-slate-500">{alert.at}</p>
              </div>
            </li>
          ))}
        </ul>
        {alerts.length === 0 && (
          <p className="py-6 text-center text-slate-500">No alerts match the filter.</p>
        )}
      </Card>
    </div>
  );
}
