"use client";

import Link from "next/link";
import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const KPI_CARDS = [
  { label: "Total Active Programs", value: 24, href: "/academic/programs", accent: "bg-purple-100 text-purple-800" },
  { label: "Total Student Groups", value: 142, href: "/academic/groups", accent: "bg-purple-100 text-purple-800" },
  { label: "Pending Admission Decisions", value: 18, href: "/academic/admission", accent: "bg-amber-100 text-amber-800" },
  { label: "Today's Schedule Conflicts (Urgent)", value: 3, href: "/academic/schedules/conflicts", accent: "bg-rose-100 text-rose-800" },
];

const GPA_TREND_DATA = [
  { period: "Sep 25", Engineering: 3.2, Business: 3.4, Law: 3.1, Medicine: 3.3, "Arts & Sciences": 3.0 },
  { period: "Oct 25", Engineering: 3.15, Business: 3.35, Law: 3.05, Medicine: 3.25, "Arts & Sciences": 2.95 },
  { period: "Nov 25", Engineering: 3.22, Business: 3.38, Law: 3.12, Medicine: 3.28, "Arts & Sciences": 3.02 },
  { period: "Dec 25", Engineering: 3.18, Business: 3.32, Law: 3.08, Medicine: 3.22, "Arts & Sciences": 2.98 },
  { period: "Jan 26", Engineering: 3.25, Business: 3.42, Law: 3.15, Medicine: 3.35, "Arts & Sciences": 3.05 },
  { period: "Feb 26", Engineering: 3.28, Business: 3.45, Law: 3.18, Medicine: 3.38, "Arts & Sciences": 3.08 },
];

const LINE_COLORS = {
  Engineering: "#7c3aed",
  Business: "#8b5cf6",
  Law: "#a78bfa",
  Medicine: "#c4b5fd",
  "Arts & Sciences": "#ddd6fe",
};

const AT_RISK_GROUPS = [
  { id: "G-ENG-3A", name: "Engineering 3A", attendance: 62, faculty: "Engineering" },
  { id: "G-BUS-2B", name: "Business 2B", attendance: 58, faculty: "Business" },
  { id: "G-LAW-1C", name: "Law 1C", attendance: 55, faculty: "Law" },
];

type SyncStatus = "success" | "error" | "pending";

const SYNC_STATUS: {
  status: SyncStatus;
  lastSync: string;
  message: string;
} = {
  status: "success",
  lastSync: "2026-03-06 08:15",
  message: "aSc Timetable sync completed. 142 groups, 0 conflicts.",
};

export default function AcademicDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Academic Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Overview of programs, groups, schedules, and academic operations.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}>
            <Card className={cn("h-full transition-shadow hover:shadow-md", "border-purple-100 bg-purple-50/50")}>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                <span className={cn("mt-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold", kpi.accent)}>
                  View →
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Student Performance Chart - spans 2 cols */}
        <Card className="lg:col-span-2 border-purple-100 bg-purple-50/30">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Average GPA by Faculty (trend)
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">Last 6 periods across faculties.</p>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <LineChart data={GPA_TREND_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[2.8, 3.6]} tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => v.toFixed(2)} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e9d5ff" }}
                  formatter={(value) => [Number(value ?? 0).toFixed(2), ""]}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                {(Object.keys(LINE_COLORS) as Array<keyof typeof LINE_COLORS>).map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={LINE_COLORS[key]}
                    strokeWidth={2}
                    dot={{ fill: LINE_COLORS[key], r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* At-Risk Alert Widget */}
        <Card className="border-purple-100 bg-purple-50/30">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">At-Risk Alert</h2>
          <p className="mt-0.5 text-xs text-slate-600">Groups with critically low attendance (&lt;70%).</p>
          <ul className="mt-4 space-y-3">
            {AT_RISK_GROUPS.length === 0 ? (
              <li className="text-sm text-slate-500">No at-risk groups.</li>
            ) : (
              AT_RISK_GROUPS.map((g) => (
                <li key={g.id} className="rounded-lg border border-rose-200 bg-rose-50/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{g.name}</p>
                      <p className="text-xs text-slate-500">{g.faculty}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                      {g.attendance}%
                    </span>
                  </div>
                  <Link
                    href="/academic/performance"
                    className="mt-2 inline-block text-xs font-medium text-purple-700 hover:underline"
                  >
                    View attendance →
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      {/* Sync Status */}
      <Card className="border-purple-100 bg-purple-50/30">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">aSc Timetable Sync Status</h2>
        <p className="mt-0.5 text-xs text-slate-600">Current status of schedule synchronization.</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-purple-200 bg-purple-100/50 p-4">
          <span
            className={cn(
              "inline-flex h-3 w-3 shrink-0 rounded-full",
              SYNC_STATUS.status === "success" && "bg-emerald-500",
              SYNC_STATUS.status === "error" && "bg-rose-500",
              SYNC_STATUS.status === "pending" && "bg-amber-500",
            )}
            aria-hidden
          />
          <div className="min-w-0">
            <p className="font-medium text-slate-900">
              {SYNC_STATUS.status === "success" && "Synced"}
              {SYNC_STATUS.status === "error" && "Error"}
              {SYNC_STATUS.status === "pending" && "Pending"}
            </p>
            <p className="text-sm text-slate-600">{SYNC_STATUS.message}</p>
            <p className="mt-0.5 text-xs text-slate-500">Last sync: {SYNC_STATUS.lastSync}</p>
          </div>
          <Link
            href="/academic/schedules"
            className="ml-auto inline-flex items-center rounded-lg border border-purple-700 bg-white px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
          >
            Schedules →
          </Link>
        </div>
      </Card>
    </div>
  );
}
