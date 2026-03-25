"use client";

import Link from "next/link";
import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card";

/** AI-driven (mock) trend: past 2 semesters actual + next 4 semesters projected. Indigo for future. */
const REVENUE_FORECAST = [
  { period: "S2 2024", revenue: 4.9, projected: false },
  { period: "S1 2025", revenue: 5.1, projected: false },
  { period: "S2 2025", revenue: 5.4, projected: true },
  { period: "S1 2026", revenue: 5.7, projected: true },
  { period: "S2 2026", revenue: 6.0, projected: true },
  { period: "S1 2027", revenue: 6.2, projected: true },
];

const GRADUATION_FORECAST = [
  { period: "S2 2024", rate: 88, projected: false },
  { period: "S1 2025", rate: 89, projected: false },
  { period: "S2 2025", rate: 90, projected: true },
  { period: "S1 2026", rate: 91, projected: true },
  { period: "S2 2026", rate: 92, projected: true },
  { period: "S1 2027", rate: 93, projected: true },
];

export default function ForecastingPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/strategic" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Strategic planning
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Forecasting</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          AI-driven trend lines (mock): projected revenue and graduation rates for the next 4 semesters.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Revenue projection
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Past actual (teal) and future projection (indigo) for next 4 semesters.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_FORECAST} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `$${v}M`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value, _name, props) => {
                    const revenueM = Number(value ?? 0);
                    const projected =
                      (props as { payload?: { projected?: boolean } } | undefined)?.payload
                        ?.projected ?? false;
                    return [
                      `$${revenueM}M${projected ? " (projected)" : ""}`,
                      "Revenue",
                    ];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ fill: "#4f46e5", r: 4 }}
                  strokeDasharray={undefined}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-600" /> Future (projected)
            </span>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Graduation rate projection
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Past actual and future projection (indigo) for next 4 semesters.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GRADUATION_FORECAST} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[85, 95]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value, _name, props) => {
                    const rate = Number(value ?? 0);
                    const projected =
                      (props as { payload?: { projected?: boolean } } | undefined)?.payload
                        ?.projected ?? false;
                    return [
                      `${rate}%${projected ? " (projected)" : ""}`,
                      "Graduation rate",
                    ];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Graduation rate %"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ fill: "#4f46e5", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
