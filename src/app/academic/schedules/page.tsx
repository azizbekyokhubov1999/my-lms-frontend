"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const LAST_SYNC = "2026-03-06 08:15";
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const DAYS = ["Mon 2 Mar", "Tue 3 Mar", "Wed 4 Mar", "Thu 5 Mar", "Fri 6 Mar"];

const MOCK_GRID: Record<string, string> = {
  "Mon 2 Mar-09:00": "SD-24-01 · CS101 · Rm A101",
  "Mon 2 Mar-10:00": "CS-23-01 · SE201 · Rm B202",
  "Tue 3 Mar-09:00": "SD-24-01 · SE201 · Rm B202",
  "Wed 4 Mar-14:00": "MBA-24-A · Strategy · Rm C301",
  "Thu 5 Mar-10:00": "SD-24-02 · CS101 · Rm A101",
  "Fri 6 Mar-09:00": "SD-24-01 · CS102 · Rm A102",
};

export default function SchedulesPage() {
  const [syncing, setSyncing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState(LAST_SYNC);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setLastSync(new Date().toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }).replace(",", ""));
      setSyncing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Schedules</h1>
          <p className="mt-0.5 text-sm text-slate-600">Daily and weekly view. Sync from aSc Timetable.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right text-sm text-slate-600">
            <span className="font-medium text-slate-500">Last sync:</span> {lastSync}
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-70"
          >
            {syncing ? "Syncing…" : "Sync from aSc Timetable"}
          </button>
          <Link
            href="/academic/schedules/conflicts"
            className="inline-flex h-10 items-center justify-center rounded-md border border-amber-600 px-4 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50"
          >
            Conflicts
          </Link>
          <Link
            href="/academic/schedules/overrides"
            className="inline-flex h-10 items-center justify-center rounded-md border border-purple-600 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
          >
            Overrides
          </Link>
          <Link
            href="/academic/schedules/sync-history"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Sync history
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Week view</h2>
        <p className="mt-0.5 text-xs text-slate-600">Calendar grid. Click a slot to see detail.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-16 border border-slate-200 bg-slate-50 p-2 text-left text-xs font-medium text-slate-600">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className="min-w-[120px] border border-slate-200 bg-purple-100 p-2 text-left text-xs font-medium text-purple-900">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  <td className="border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-600">{hour}</td>
                  {DAYS.map((day) => {
                    const key = `${day}-${hour}`;
                    const label = MOCK_GRID[key];
                    return (
                      <td key={key} className="border border-slate-200 p-1 align-top">
                        {label ? (
                          <Link
                            href={`/academic/schedules/detail?date=${encodeURIComponent(day)}&slot=${encodeURIComponent(hour)}`}
                            className="block rounded bg-purple-100 px-2 py-1.5 text-xs font-medium text-purple-900 hover:bg-purple-200"
                          >
                            {label}
                          </Link>
                        ) : (
                          <span className="block px-2 py-1.5 text-xs text-slate-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
