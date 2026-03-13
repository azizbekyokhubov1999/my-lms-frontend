"use client";

import Link from "next/link";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const SERVICES = [
  { id: "api", name: "API", description: "REST API gateway" },
  { id: "database", name: "Database", description: "Primary data store" },
  { id: "redis", name: "Redis", description: "Cache and sessions" },
  { id: "teams", name: "Teams Integration", description: "Microsoft Teams connector" },
];

const STATUSES: Record<string, "up" | "down"> = {
  api: "up",
  database: "up",
  redis: "up",
  teams: "down",
};

export default function SystemHealthPage() {

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Monitoring</h1>
          <p className="mt-1 text-sm text-slate-600">
            System health, performance, storage, and alerts.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/monitoring"
            className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900"
          >
            System Health
          </Link>
          <Link
            href="/admin/monitoring/performance"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Performance
          </Link>
          <Link
            href="/admin/monitoring/storage"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Storage
          </Link>
          <Link
            href="/admin/monitoring/alerts"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Alerts
          </Link>
        </nav>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          System Health
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((svc) => {
            const status = STATUSES[svc.id] ?? "up";
            return (
              <Card key={svc.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{svc.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{svc.description}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex h-3 w-3 shrink-0 rounded-full",
                      status === "up" ? "bg-emerald-500" : "bg-red-500",
                    )}
                    aria-hidden
                  />
                </div>
                <p className="mt-3 text-sm font-medium">
                  <span className={status === "up" ? "text-emerald-600" : "text-red-600"}>
                    {status === "up" ? "Operational" : "Down"}
                  </span>
                </p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
