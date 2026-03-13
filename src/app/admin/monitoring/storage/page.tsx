"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STORAGE_ITEMS = [
  { id: "materials", label: "Course Materials", used: 62, total: 100, unit: "GB" },
  { id: "video", label: "Video Recordings", used: 145, total: 200, unit: "GB" },
  { id: "logs", label: "Database Logs", used: 18, total: 50, unit: "GB" },
];

export default function StorageUsagePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/monitoring" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Monitoring
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Storage Usage</h1>
          <p className="mt-1 text-sm text-slate-600">
            Consumption for course materials, video recordings, and database logs.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/monitoring" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">System Health</Link>
          <Link href="/admin/monitoring/performance" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Performance</Link>
          <Link href="/admin/monitoring/storage" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Storage</Link>
          <Link href="/admin/monitoring/alerts" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Alerts</Link>
        </nav>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Storage consumption
        </h2>
        <div className="space-y-6">
          {STORAGE_ITEMS.map((item) => {
            const pct = Math.round((item.used / item.total) * 100);
            const isHigh = pct >= 90;
            const isWarn = pct >= 75 && pct < 90;
            return (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{item.label}</span>
                  <span className="text-sm text-slate-600">
                    {item.used} / {item.total} {item.unit} ({pct}%)
                  </span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isHigh && "bg-red-500",
                      isWarn && !isHigh && "bg-amber-500",
                      !isHigh && !isWarn && "bg-emerald-500",
                    )}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
