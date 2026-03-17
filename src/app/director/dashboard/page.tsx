"use client";

import Link from "next/link";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STATS = [
  { label: "Total Students", value: "12,847", trend: 4.2, up: true },
  { label: "Revenue Status", value: "98.1%", trend: 2.1, up: true },
  { label: "Avg. Attendance", value: "94.3%", trend: -0.8, up: false },
  { label: "Teacher Utilization", value: "87%", trend: 1.5, up: true },
];

const PERFORMANCE_DATA = [
  { month: "Oct", attendance: 91, grade: 3.8 },
  { month: "Nov", attendance: 92, grade: 3.9 },
  { month: "Dec", attendance: 93, grade: 4.0 },
  { month: "Jan", attendance: 93.5, grade: 4.1 },
  { month: "Feb", attendance: 94, grade: 4.0 },
  { month: "Mar", attendance: 94.3, grade: 4.2 },
];

const RED_ZONE_INCIDENTS = [
  { id: "i1", type: "Incident", title: "Lab equipment failure – Building B", severity: "High", date: "Mar 5" },
  { id: "i2", type: "Incident", title: "Student grievance escalation", severity: "Medium", date: "Mar 4" },
];

const RED_ZONE_OVERLOADED = [
  { id: "o1", resource: "Engineering – CS dept", utilization: "112%", note: "3 FTE short" },
  { id: "o2", resource: "Medicine – Clinical slots", utilization: "108%", note: "Overtime threshold" },
];

const TUITION_DATA = [
  { name: "Paid", value: 78, fill: "#10b981" },
  { name: "Outstanding", value: 22, fill: "#f59e0b" },
];

export default function DirectorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-300">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Executive Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Institutional pulse, performance, critical alerts, and financial health.
        </p>
      </div>

      {/* 1. Institutional Pulse – 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="border-0 bg-slate-900 shadow-lg">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 flex items-center gap-1 text-sm">
              <span
                className={cn(
                  "font-medium",
                  stat.up ? "text-emerald-500" : "text-red-400",
                )}
              >
                {stat.up ? "↑" : "↓"} {Math.abs(stat.trend)}%
              </span>
              <span className="text-slate-500">vs last period</span>
            </p>
          </Card>
        ))}
      </div>

      {/* 2. Performance Overview – Area Chart */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Performance overview
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Attendance vs. grade trends over the last 6 months.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="attendance" tick={{ fontSize: 11, fill: "#64748b" }} domain={[85, 100]} />
              <YAxis yAxisId="grade" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} domain={[3.5, 5]} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value: unknown) => [value, undefined]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area
                yAxisId="attendance"
                type="monotone"
                dataKey="attendance"
                name="Attendance %"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#attendanceFill)"
              />
              <Area
                yAxisId="grade"
                type="monotone"
                dataKey="grade"
                name="Avg. Grade"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#gradeFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 3. Critical Alerts – Red Zone */}
        <Card className="border-red-200 bg-red-50/50 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-red-800">
            Red zone – Critical alerts
          </h2>
          <p className="mt-0.5 text-xs text-red-700">
            Incidents and overloaded resources requiring attention.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-red-600">Incidents</h3>
              <ul className="space-y-2">
                {RED_ZONE_INCIDENTS.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.severity} · {item.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-red-600">Overloaded resources</h3>
              <ul className="space-y-2">
                {RED_ZONE_OVERLOADED.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-slate-900">{item.resource}</p>
                    <p className="mt-0.5 text-xs text-red-600">
                      {item.utilization} · {item.note}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* 4. Financial Health – Donut */}
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Financial health
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Tuition fees – Paid vs. Outstanding.
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TUITION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={64}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value: unknown) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Paid
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Outstanding
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
