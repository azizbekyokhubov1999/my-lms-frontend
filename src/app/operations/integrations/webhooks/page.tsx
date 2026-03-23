"use client";

import * as React from "react";

import { Card } from "../../../components/ui/Card";

type HealthStatus = "Healthy" | "Degraded" | "Critical";

type HealthItem = {
  key: string;
  label: string;
  type: "Webhook" | "Callback";
  status: HealthStatus;
  lastEventAgo: string;
  description: string;
};

const STATUS_STYLE: Record<HealthStatus, string> = {
  Healthy: "border-emerald-400/30 bg-emerald-400/5 text-emerald-100",
  Degraded: "border-amber-400/30 bg-amber-400/5 text-amber-100",
  Critical: "border-rose-500/40 bg-rose-500/10 text-rose-200",
};

const STATUS_DOT: Record<HealthStatus, string> = {
  Healthy: "bg-emerald-400",
  Degraded: "bg-amber-400",
  Critical: "bg-rose-500",
};

function statusCounts(items: HealthItem[]) {
  const counts: Record<HealthStatus, number> = {
    Healthy: 0,
    Degraded: 0,
    Critical: 0,
  };
  for (const it of items) counts[it.status] += 1;
  return counts;
}

export default function IntegrationHealthPage() {
  const [items, setItems] = React.useState<HealthItem[]>(() => [
    {
      key: "wh-teams-events",
      label: "Teams Events Webhook",
      type: "Webhook",
      status: "Healthy",
      lastEventAgo: "18s ago",
      description: "Payload validated and delivered successfully.",
    },
    {
      key: "cb-teams-callbacks",
      label: "Teams Callback Handler",
      type: "Callback",
      status: "Healthy",
      lastEventAgo: "32s ago",
      description: "Ack received; retry queue remains empty.",
    },
    {
      key: "wh-onec-mutations",
      label: "1C Mutations Webhook",
      type: "Webhook",
      status: "Degraded",
      lastEventAgo: "3m ago",
      description: "Intermittent delivery delays detected.",
    },
    {
      key: "cb-onec-validation",
      label: "1C Payload Validation Callback",
      type: "Callback",
      status: "Degraded",
      lastEventAgo: "5m ago",
      description: "Some payloads require re-processing.",
    },
    {
      key: "wh-asc-sync",
      label: "aSc Sync Webhook",
      type: "Webhook",
      status: "Healthy",
      lastEventAgo: "1m ago",
      description: "Sync pipeline is flowing normally.",
    },
    {
      key: "cb-asc-dedupe",
      label: "aSc Dedupe Callback",
      type: "Callback",
      status: "Healthy",
      lastEventAgo: "45s ago",
      description: "Idempotency checks passing.",
    },
    {
      key: "wh-classmate-status",
      label: "Classmate Status Webhook",
      type: "Webhook",
      status: "Critical",
      lastEventAgo: "9m ago",
      description: "Delivery failures above threshold; manual intervention recommended.",
    },
    {
      key: "cb-classmate-sync",
      label: "Classmate Sync Callback",
      type: "Callback",
      status: "Healthy",
      lastEventAgo: "2m ago",
      description: "Callback processed and stored event successfully.",
    },
  ]);

  const counts = statusCounts(items);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">
          Integration Health
        </h1>
        <p className="mt-1 text-sm text-slate-100/70">
          Health status for all webhooks and callbacks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Healthy
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {counts.Healthy}
          </p>
        </Card>
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Degraded
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {counts.Degraded}
          </p>
        </Card>
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Critical
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {counts.Critical}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <Card key={it.key} className={`border-indigo-400/30 bg-slate-950 ${STATUS_STYLE[it.status]}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  {it.type}
                </p>
                <p className="mt-2 truncate text-sm font-semibold">{it.label}</p>
                <p className="mt-1 text-xs text-slate-100/70">{it.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[it.status]}`} aria-hidden />
                <p className="text-xs text-slate-100/60">Last: {it.lastEventAgo}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


