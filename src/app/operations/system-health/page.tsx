"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, AlertTriangle, BarChart3, Clock3, Database, FileText, Network, Server } from "lucide-react";

import { Card } from "../../components/ui/Card";

export default function SystemHealthPage() {
  const hubCards = [
    {
      title: "Server",
      summary: "99.9% Uptime",
      href: "/operations/system-health/server",
      icon: Server,
    },
    {
      title: "Database",
      summary: "12ms Response",
      href: "/operations/system-health/db",
      icon: Database,
    },
    {
      title: "Network",
      summary: "0.03% Packet Loss",
      href: "/operations/system-health/network",
      icon: Network,
    },
    {
      title: "App Logs",
      summary: "3 WARN / 0 CRITICAL",
      href: "/operations/system-health/application-logs",
      icon: Activity,
    },
    {
      title: "Latency",
      summary: "P95: 180ms",
      href: "/operations/system-health/latency",
      icon: Clock3,
    },
    {
      title: "Uptime",
      summary: "30-day: 99.95%",
      href: "/operations/system-health/uptime",
      icon: BarChart3,
    },
  ] as const;

  return (
    <div className="space-y-6 bg-slate-50">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">System Health Overview</h1>
        <p className="mt-1 text-sm text-slate-600">
          Central hub for all infrastructure health analytics and operational telemetry.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hubCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.href} className="bg-white border-slate-200 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {card.title}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{card.summary}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-400/10">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href={card.href}
                  className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
                >
                  View Detailed Analytics
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Health Reports</h2>
              <p className="mt-1 text-sm text-slate-600">
                Generate and review consolidated health snapshots.
              </p>
            </div>
            <FileText className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <Link
              href="/operations/reports"
              className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
            >
              Open Health Reports
            </Link>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Performance Alerts</h2>
              <p className="mt-1 text-sm text-slate-600">
                Monitor alert thresholds and investigate performance regressions.
              </p>
            </div>
            <AlertTriangle className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <Link
              href="/operations/performance"
              className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
            >
              View Performance Alerts
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

