"use client";

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

const TOTAL_CAPACITY = 100; // percent
const USED_CAPACITY = 78;

const FACULTY_HEATMAP = [
  { faculty: "Engineering", utilization: 94 },
  { faculty: "Business", utilization: 82 },
  { faculty: "Law", utilization: 65 },
  { faculty: "Medicine", utilization: 105 },
  { faculty: "Arts & Sci", utilization: 58 },
  { faculty: "Language", utilization: 49 },
];

const UTILIZATION_DATA = [
  { dept: "Engineering", target: 18, actual: 20 },
  { dept: "Business", target: 16, actual: 17.5 },
  { dept: "Law", target: 14, actual: 13 },
  { dept: "Medicine", target: 20, actual: 22 },
  { dept: "Arts & Sci", target: 15, actual: 12.5 },
];

export default function WorkloadDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Workload dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          High-level view of staff capacity, faculty utilization, and department-level analytics.
        </p>
      </div>

      {/* Capacity gauge + faculty heatmap */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gauge */}
        <Card className="lg:col-span-1 border-teal-100 bg-white/80">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Total capacity
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Overall teaching staff load as a percentage of available hours.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-4">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full bg-slate-100" />
              <div
                className="absolute inset-2 rounded-full border-[10px] border-teal-600"
                style={{
                  clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                }}
              />
              <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-xl font-bold text-slate-900">
                  {USED_CAPACITY}%
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {USED_CAPACITY}% of total capacity used ·{" "}
              {TOTAL_CAPACITY - USED_CAPACITY}% remaining.
            </p>
          </div>
        </Card>

        {/* Faculty heatmap */}
        <Card className="lg:col-span-2 border-teal-100 bg-white/80">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Faculty workload heatmap
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Faculties above 100% are overloaded; those below 60% are under-utilized.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FACULTY_HEATMAP.map((f) => {
              const overloaded = f.utilization > 100;
              const under = f.utilization < 60;
              const badge =
                overloaded ? "bg-rose-500" : under ? "bg-sky-500" : "bg-teal-600";
              return (
                <div
                  key={f.faculty}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">
                      {f.faculty}
                    </p>
                    <span
                      className={cn(
                        "inline-flex h-2 w-2 rounded-full",
                        overloaded && "bg-rose-500",
                        under && "bg-sky-500",
                        !overloaded && !under && "bg-teal-500",
                      )}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Utilization: {f.utilization}%
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className={cn("h-2 rounded-full", badge)}
                      style={{ width: `${Math.min(f.utilization, 120)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {overloaded
                      ? "Overloaded (rose)"
                      : under
                      ? "Under-utilized (sky)"
                      : "Within target"}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Utilization analytics chart */}
      <Card className="border-teal-100 bg-white/80">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Utilization analytics – target vs actual hours
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Compare target teaching hours with actual recorded hours per department (weekly
          average).
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={UTILIZATION_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #99f6e4" }}
                formatter={(value, name) => [
                  `${Number(value ?? 0).toFixed(1)} h`,
                  name ?? "Metric",
                ]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="target"
                name="Target hours"
                fill="#0f766e" /* teal-700 */
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="actual"
                name="Actual hours"
                fill="#22c55e" /* emerald-500 */
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

