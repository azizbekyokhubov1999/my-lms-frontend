"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card";

interface ForecastPoint {
  term: string;
  enrollment: number;
  requiredHours: number;
}

const FORECAST_DATA: ForecastPoint[] = [
  { term: "Prev Spring", enrollment: 3200, requiredHours: 780 },
  { term: "Prev Fall", enrollment: 3400, requiredHours: 820 },
  { term: "Current Spring", enrollment: 3600, requiredHours: 860 },
  { term: "Current Fall", enrollment: 3800, requiredHours: 900 },
  { term: "Next Spring (proj.)", enrollment: 4100, requiredHours: 960 },
  { term: "Next Fall (proj.)", enrollment: 4300, requiredHours: 1000 },
];

export default function WorkloadForecastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Workload forecast
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Projected resource needs for the next semester based on enrollment
          trends and historical teaching hours.
        </p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Enrollment &amp; required hours – trend
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Use this forecast to plan hiring, assistant assignments, and
          co-teaching in advance.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="term"
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #99f6e4" }}
                formatter={(value: number, name: string) =>
                  name === "Enrollment"
                    ? [`${value.toLocaleString()} students`, name]
                    : [`${value.toFixed(0)} hours`, name]
                }
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="enrollment"
                name="Enrollment"
                stroke="#0f766e"
                fill="#ccfbf1" /* teal-50 */
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="requiredHours"
                name="Required hours"
                stroke="#fb7185" /* rose-400 */
                fill="#ffe4e6" /* rose-100 */
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

