"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Heatmap: 7 days (rows) x 12 two-hour slots (cols). Value = relative activity 0-100.
const PEAK_ACTIVITY: number[][] = [
  [5, 3, 2, 1, 2, 8, 25, 55, 70, 75, 72, 68],
  [4, 2, 1, 1, 3, 12, 30, 58, 72, 78, 74, 65],
  [6, 3, 2, 2, 5, 15, 35, 62, 75, 80, 76, 70],
  [5, 4, 2, 2, 6, 18, 38, 65, 78, 82, 78, 72],
  [7, 5, 3, 3, 8, 22, 42, 68, 80, 85, 80, 70],
  [15, 10, 6, 5, 12, 35, 55, 72, 78, 80, 75, 65],
  [12, 8, 5, 4, 10, 28, 48, 65, 70, 72, 68, 55],
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_LABELS = ["00h", "02h", "04h", "06h", "08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];

const GEO_DATA = [
  { region: "North America", count: 1240 },
  { region: "Europe", count: 890 },
  { region: "Asia Pacific", count: 520 },
  { region: "South America", count: 180 },
  { region: "Other", count: 90 },
];

const MAX_GEO = Math.max(...GEO_DATA.map((d) => d.count));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Reports
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">
            Peak activity heatmaps and geographical distribution.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/reports" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">System Reports</Link>
          <Link href="/admin/reports/analytics" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Analytics</Link>
          <Link href="/admin/reports/export" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Data Export</Link>
        </nav>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Peak activity (heatmap)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Activity by day of week and time of day (UTC). Darker = higher activity.
        </p>
        <div className="mt-4 overflow-x-auto">
          <div className="inline-block min-w-0">
            <div className="mb-1 flex justify-between gap-1 text-[10px] text-slate-500">
              {HOUR_LABELS.map((h) => (
                <span key={h} className="w-6 shrink-0 text-center">{h}</span>
              ))}
            </div>
            {PEAK_ACTIVITY.map((row, i) => (
              <div key={DAYS[i]} className="flex gap-0.5">
                <span className="w-8 shrink-0 py-0.5 text-xs text-slate-600">{DAYS[i]}</span>
                <div className="flex gap-0.5">
                  {row.map((v, j) => (
                    <div
                      key={j}
                      className="h-5 w-6 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `rgb(30 64 175 / ${0.15 + (v / 100) * 0.85})`,
                      }}
                      title={`${DAYS[i]} ${HOUR_LABELS[j]}: ${v}%`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Low</span>
              <div className="h-3 w-24 rounded bg-linear-to-r from-blue-100 to-blue-600" />
              <span>High</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Geographical distribution
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          User distribution by region (approximate).
        </p>
        <div className="mt-4 space-y-3">
          {GEO_DATA.map((d) => (
            <div key={d.region} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-sm font-medium text-slate-700">{d.region}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-6 rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${(d.count / MAX_GEO) * 100}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-sm text-slate-600">{d.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Total: {GEO_DATA.reduce((a, d) => a + d.count, 0).toLocaleString()} users. Use Data Export for coordinates or city-level data.
        </p>
      </Card>
    </div>
  );
}
