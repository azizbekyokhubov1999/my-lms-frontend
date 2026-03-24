"use client";

import * as React from "react";
import { Bell, CalendarDays } from "lucide-react";

import { Card } from "@/app/components/ui/Card";
import { Switch } from "@/app/components/ui/Switch";

import { HubBackButton } from "../HubBackButton";

type Window = {
  id: string;
  label: string;
  startLabel: string;
  endLabel: string;
  impact: string;
  /** position 0–100 on timeline for visual bar */
  weekOffsetPct: number;
  spanPct: number;
};

const WINDOWS: Window[] = [
  {
    id: "w1",
    label: "Monthly patching — compute",
    startLabel: "Mar 30 · 02:00 UTC",
    endLabel: "Mar 30 · 04:00 UTC",
    impact: "Degraded performance possible on LMS edge",
    weekOffsetPct: 8,
    spanPct: 22,
  },
  {
    id: "w2",
    label: "DB failover drill",
    startLabel: "Apr 6 · 01:00 UTC",
    endLabel: "Apr 6 · 02:00 UTC",
    impact: "Brief read-only on writes",
    weekOffsetPct: 38,
    spanPct: 14,
  },
  {
    id: "w3",
    label: "CDN config rollout",
    startLabel: "Apr 12 · 22:00 UTC",
    endLabel: "Apr 12 · 23:00 UTC",
    impact: "No user impact expected",
    weekOffsetPct: 72,
    spanPct: 12,
  },
];

export default function MaintenanceSchedulePage() {
  const [publicNotification, setPublicNotification] = React.useState(true);

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <CalendarDays className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">Maintenance schedule</h1>
        <p className="mt-1 text-sm text-slate-600">
          Timeline of approved windows and user-facing notification controls.
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-indigo-400/40 bg-indigo-50">
              <Bell className="h-5 w-5 text-indigo-400" aria-hidden />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Public notification</h2>
              <p className="mt-1 text-sm text-slate-600">
                When on, scheduled maintenance posts to the status page and in-app banner ahead of
                each window.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:shrink-0">
            <Switch
              checked={publicNotification}
              onCheckedChange={setPublicNotification}
              aria-label="Public notification for downtime"
              className={publicNotification ? "bg-indigo-400!" : undefined}
            />
            <span
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                publicNotification
                  ? "border-emerald-500/35 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-100 text-slate-700"
              }`}
            >
              {publicNotification ? "Users will be notified" : "Silent mode"}
            </span>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Maintenance windows · timeline</h2>
        <p className="mt-1 text-xs text-slate-600">
          Relative placement across the planning horizon (illustrative).
        </p>

        <div className="mt-6 px-1">
          <div className="relative h-14 rounded-lg border border-slate-200 bg-slate-50">
            <div
              className="absolute inset-x-3 inset-y-2 rounded-md bg-slate-100/90"
              aria-hidden
            />
            {WINDOWS.map((w) => (
              <div
                key={w.id}
                className="absolute inset-y-2 rounded-md border-2 border-amber-500 bg-amber-500/25 shadow-sm transition-transform hover:scale-[1.02]"
                style={{
                  left: `calc(0.75rem + (100% - 1.5rem) * ${w.weekOffsetPct / 100})`,
                  width: `max(3rem, calc((100% - 1.5rem) * ${w.spanPct / 100}))`,
                }}
                title={`${w.label}: ${w.startLabel} – ${w.endLabel}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <span>Now</span>
            <span>+2 wks</span>
            <span>+4 wks</span>
          </div>
        </div>

        <ul className="mt-8 space-y-0 border-l-2 border-amber-500/50 pl-6">
          {WINDOWS.map((w, i) => (
            <li key={w.id} className="relative pb-8 last:pb-0">
              <span
                className="absolute -left-[1.4rem] top-1 flex h-3 w-3 rounded-full border-2 border-amber-500 bg-white ring-2 ring-amber-500/30"
                aria-hidden
              />
              {i < WINDOWS.length - 1 ? (
                <span
                  className="absolute left-[-5px] top-4 bottom-0 w-px bg-amber-500/35"
                  aria-hidden
                />
              ) : null}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{w.label}</h3>
                  <span className="rounded-md border border-amber-500/40 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    Scheduled
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-mono text-xs text-slate-600">{w.startLabel}</span>
                  <span className="mx-2 text-slate-400">→</span>
                  <span className="font-mono text-xs text-slate-600">{w.endLabel}</span>
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  <span className="font-medium text-slate-800">Impact:</span> {w.impact}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
