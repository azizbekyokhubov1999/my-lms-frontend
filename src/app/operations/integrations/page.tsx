"use client";

import * as React from "react";
import Link from "next/link";
import { Boxes, MessageSquare, School, Users } from "lucide-react";

import { Card } from "../../components/ui/Card";

type IntegrationKey = "teams" | "onec" | "asc" | "classmate";

type IntegrationState = {
  key: IntegrationKey;
  label: string;
  connectionStatus: "Connected" | "Error";
  lastSyncTs: number | null;
};

function formatAgo(seconds: number) {
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

function statusDotClass(status: IntegrationState["connectionStatus"]) {
  if (status === "Connected") return "bg-indigo-400";
  return "bg-rose-400";
}

export default function IntegrationsDashboardPage() {
  const [nowTs] = React.useState(() => Date.now());
  const [integrations] = React.useState<IntegrationState[]>(() => [
    { key: "teams", label: "Teams", connectionStatus: "Connected", lastSyncTs: nowTs - 60_000 },
    { key: "onec", label: "OneC", connectionStatus: "Error", lastSyncTs: nowTs - 12 * 60_000 },
    { key: "asc", label: "ACS", connectionStatus: "Connected", lastSyncTs: nowTs - 4 * 60_000 },
    { key: "classmate", label: "Classmate", connectionStatus: "Connected", lastSyncTs: nowTs - 28_000 },
  ]);

  const integrationMeta: Record<
    IntegrationKey,
    { href: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    teams: { href: "/operations/integrations/teams", icon: MessageSquare },
    onec: { href: "/operations/integrations/onec/sync-jobs", icon: Boxes },
    asc: { href: "/operations/integrations/asc", icon: School },
    classmate: { href: "/operations/integrations/classmate", icon: Users },
  };

  return (
    <div className="space-y-6 bg-slate-50">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Integrations Hub</h1>
        <p className="mt-1 text-sm text-slate-600">
          Central dashboard for core services and integration health.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
          Core Integrations
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {integrations.map((i) => {
            const meta = integrationMeta[i.key];
            const Icon = meta.icon;
            const isConnected = i.connectionStatus === "Connected";
            return (
              <Card key={i.key} className="rounded-xl border-slate-200 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-400/40 bg-indigo-400/10">
                        <Icon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{i.label}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${statusDotClass(i.connectionStatus)}`}
                        aria-hidden
                      />
                      <p
                        className={`text-sm font-semibold ${
                          isConnected ? "text-indigo-400" : "text-rose-500"
                        }`}
                      >
                        {i.connectionStatus}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      Last sync:{" "}
                      {i.lastSyncTs == null
                        ? "—"
                        : formatAgo(Math.max(0, Math.round((nowTs - i.lastSyncTs) / 1000)))}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={meta.href}
                    className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
                  >
                    Configure
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
          System Utilities
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Webhooks",
              description: "Webhook and callback endpoint health.",
              href: "/operations/integrations/webhooks",
            },
            {
              title: "Integration Health",
              description: "Service-level connection diagnostics.",
              href: "/operations/integrations/connections",
            },
            {
              title: "Sync Jobs",
              description: "Scheduled and manual synchronization tasks.",
              href: "/operations/integrations/sync-jobs",
            },
          ].map((u) => (
            <Card key={u.href} className="rounded-xl border-slate-200 bg-white shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{u.title}</p>
              <p className="mt-1 text-sm text-slate-600">{u.description}</p>
              <div className="mt-4">
                <Link
                  href={u.href}
                  className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
                >
                  Configure
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

