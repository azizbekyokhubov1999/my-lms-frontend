"use client";

import Link from "next/link";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../components/ui/Card";

/** Revenue by semester (M = millions). Next semester = forecast. */
const REVENUE_DATA = [
  { period: "S1 2023", revenue: 4.2, forecast: false },
  { period: "S2 2023", revenue: 4.5, forecast: false },
  { period: "S1 2024", revenue: 4.6, forecast: false },
  { period: "S2 2024", revenue: 4.9, forecast: false },
  { period: "S1 2025", revenue: 5.1, forecast: false },
  { period: "S2 2025", revenue: 5.4, forecast: true },
];

const CURRENT_SEMESTER = "S1 2025";
const NEXT_SEMESTER = "S2 2025";
const FORECAST_REVENUE = 5.4;
const FORECAST_GROWTH_PCT = 5.9;

export default function FinancialDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Financial dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Revenue forecasting for the next semester.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 bg-white">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Current semester</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{CURRENT_SEMESTER}</p>
          <p className="mt-0.5 text-sm text-slate-600">Actual revenue (YTD)</p>
        </Card>
        <Card className="border-teal-100 bg-teal-50/30">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Next semester forecast</p>
          <p className="mt-1 text-xl font-semibold text-teal-900">${FORECAST_REVENUE}M</p>
          <p className="mt-0.5 text-sm text-teal-700">{NEXT_SEMESTER}</p>
        </Card>
        <Card className="border-slate-200 bg-white">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Forecast growth</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600">+{FORECAST_GROWTH_PCT}%</p>
          <p className="mt-0.5 text-sm text-slate-600">vs current semester</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Revenue trend and forecast
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Historical revenue by semester. S2 2025 is forecast.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value: unknown) => [`$${value}M`, "Revenue"]}
                labelFormatter={(label, payload) => (payload?.[0]?.payload?.forecast ? `${label} (forecast)` : label)}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0f766e"
                strokeWidth={2}
                fill="url(#revenueFill)"
                strokeDasharray={undefined}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-600" /> Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border-2 border-dashed border-indigo-500 bg-white" /> Forecast (S2 2025)
          </span>
        </div>
      </Card>
    </div>
  );
}
