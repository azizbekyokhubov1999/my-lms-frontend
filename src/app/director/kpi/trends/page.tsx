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

const ENROLLMENT_TREND = [
  { year: "2021", enrollment: 11200 },
  { year: "2022", enrollment: 11850 },
  { year: "2023", enrollment: 12100 },
  { year: "2024", enrollment: 12400 },
  { year: "2025", enrollment: 12847 },
];

const GPA_TREND = [
  { year: "2021", gpa: 3.72 },
  { year: "2022", gpa: 3.78 },
  { year: "2023", gpa: 3.85 },
  { year: "2024", gpa: 3.88 },
  { year: "2025", gpa: 3.92 },
];

const BUDGET_TREND = [
  { year: "2021", budgetPct: 94 },
  { year: "2022", budgetPct: 96 },
  { year: "2023", budgetPct: 97 },
  { year: "2024", budgetPct: 98 },
  { year: "2025", budgetPct: 98.1 },
];

export default function KPITrendPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/kpi" className="text-sm font-medium text-slate-500 hover:text-slate-300">
          ← KPI Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">KPI Trends</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Year-over-year evolution of Enrollment, GPA, and Budget.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Enrollment (headcount)
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ENROLLMENT_TREND} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value: unknown) => [value, "Enrollment"]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="enrollment"
                  name="Enrollment"
                  stroke="#0f766e"
                  strokeWidth={2}
                  dot={{ fill: "#0f766e", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            GPA (average)
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GPA_TREND} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[3.5, 4.2]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value: unknown) => [value, "GPA"]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  name="GPA"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Budget utilization (% of plan)
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BUDGET_TREND} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[90, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value: unknown) => [`${value}%`, "Budget %"]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="budgetPct"
                  name="Budget %"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
