"use client";

import * as React from "react";
import { CalendarClock } from "lucide-react";

import { Card } from "@/app/components/ui/Card";
import { Switch } from "@/app/components/ui/Switch";

import { HubBackButton } from "../HubBackButton";

type ScheduleRow = {
  id: string;
  /** Human-readable: "Weekly Security Audit -> Send to: admin@lms.com" */
  summary: string;
  cadence: "Daily" | "Weekly" | "Monthly";
  nextRun: string;
  enabled: boolean;
};

const INITIAL: ScheduleRow[] = [
  {
    id: "s1",
    summary: "Weekly Security Audit → Send to: admin@lms.com",
    cadence: "Weekly",
    nextRun: "2026-03-30 07:00 UTC",
    enabled: true,
  },
  {
    id: "s2",
    summary: "Daily platform health digest → Send to: ops-leads@lms.com",
    cadence: "Daily",
    nextRun: "2026-03-25 06:00 UTC",
    enabled: true,
  },
  {
    id: "s3",
    summary: "Monthly capacity & cost rollup → Send to: finance-it@lms.com",
    cadence: "Monthly",
    nextRun: "2026-04-01 05:00 UTC",
    enabled: false,
  },
];

export default function ScheduledReportsPage() {
  const [rows, setRows] = React.useState<ScheduleRow[]>(INITIAL);

  const toggle = (id: string, enabled: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
  };

  const createNew = () => {
    window.alert(
      "Create New Schedule: opens a wizard (demo) — pick report, cadence, recipients, and channel.",
    );
  };

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <CalendarClock className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Scheduled reports</h1>
          <p className="mt-1 text-sm text-slate-900/80">
            Active schedules and delivery targets. Toggles apply immediately in this UI (demo only).
          </p>
        </div>
        <button
          type="button"
          onClick={createNew}
          className="shrink-0 rounded-xl bg-indigo-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
        >
          Create new schedule
        </button>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Active schedules</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-900">
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Cadence</th>
                <th className="px-4 py-3">Next run</th>
                <th className="px-4 py-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.summary}</td>
                  <td className="px-4 py-3 text-slate-900">{r.cadence}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-900">{r.nextRun}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={r.enabled}
                        onCheckedChange={(next) => toggle(r.id, next)}
                        aria-label={`Toggle ${r.summary}`}
                        className={r.enabled ? "bg-indigo-400!" : undefined}
                      />
                      <span className="text-xs font-medium text-slate-900">
                        {r.enabled ? "On" : "Off"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
