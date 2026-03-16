"use client";

import Link from "next/link";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const RESOURCE_STATS = [
  { label: "Total teachers", value: 184 },
  { label: "Active assignments", value: 362 },
  { label: "Teachers on leave", value: 9 },
  { label: "Pending verifications", value: 14 },
];

const WORKLOAD_FACULTIES = [
  { faculty: "Engineering", utilization: 88 },
  { faculty: "Business", utilization: 76 },
  { faculty: "Law", utilization: 64 },
  { faculty: "Medicine", utilization: 92 },
  { faculty: "Arts & Sci", utilization: 71 },
  { faculty: "Language", utilization: 58 },
];

const URGENT_TASKS = [
  {
    id: "t1",
    type: "Replacement",
    label: "Replace CS101 – Group A (sick leave)",
    owner: "Engineering",
    due: "Today · 14:00",
  },
  {
    id: "t2",
    type: "Overload",
    label: "Check overload for Dr. Sokolova (154%)",
    owner: "Business",
    due: "Today · 17:00",
  },
  {
    id: "t3",
    type: "Replacement",
    label: "Transition content for MKT201 (resignation)",
    owner: "Business",
    due: "This week",
  },
];

const QUALITY_DATA = [
  { month: "Jan", score: 4.3 },
  { month: "Feb", score: 4.4 },
  { month: "Mar", score: 4.5 },
];

export default function ResourcesDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Resource Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Overview of teacher allocation, workload, and pending resource actions.
          </p>
        </div>
        <Link
          href="/resources/reports"
          className="inline-flex h-9 items-center justify-center rounded-md border border-teal-600 bg-white px-3 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
        >
          View reports →
        </Link>
      </div>

      {/* Resource stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RESOURCE_STATS.map((kpi) => (
          <Card key={kpi.label} className="border-teal-100 bg-teal-50/50">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {kpi.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workload heatmap / utilization grid */}
        <Card className="lg:col-span-2 border-teal-100 bg-white/80">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Workload utilization by faculty
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Target range 70–90%. Values above 100% indicate overload.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WORKLOAD_FACULTIES.map((f) => {
              const level =
                f.utilization >= 100
                  ? "bg-rose-600"
                  : f.utilization >= 90
                  ? "bg-amber-500"
                  : "bg-teal-600";
              return (
                <div
                  key={f.faculty}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{f.faculty}</p>
                    <span className="text-xs font-semibold text-slate-600">
                      {f.utilization}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className={cn("h-2 rounded-full", level)}
                      style={{ width: `${Math.min(f.utilization, 110)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Urgent tasks */}
        <Card className="border-amber-100 bg-amber-50/50">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Urgent tasks
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Pending replacements and overloads that require immediate attention.
          </p>
          <ul className="mt-4 space-y-3">
            {URGENT_TASKS.length === 0 ? (
              <li className="text-sm text-slate-500">No urgent tasks.</li>
            ) : (
              URGENT_TASKS.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                        {t.type}
                      </span>
                      <p className="mt-1 font-medium text-slate-900">{t.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {t.owner} · {t.due}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
                      onClick={() => alert(`Open task ${t.id} (Demo)`)}
                    >
                      Open
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      {/* Teacher quality chart */}
      <Card className="border-teal-100 bg-white/80">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Teacher quality (avg. scores, last 3 months)
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Aggregated performance scores from student feedback and peer review (0–5 scale).
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={QUALITY_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                domain={[3.5, 5]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #99f6e4" }}
                formatter={(value) => [value != null ? Number(value).toFixed(2) : "—", "Avg. score"]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="score"
                name="Average score"
                fill="#0f766e" /* teal-700 */
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

