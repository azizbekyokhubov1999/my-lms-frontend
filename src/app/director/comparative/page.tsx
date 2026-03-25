"use client";

import Link from "next/link";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../components/ui/Card";

const PROGRAMS = [
  { id: "cs", name: "Computer Science", gpa: 3.94, attendance: 95, revenue: 1.2 },
  { id: "ds", name: "Data Science", gpa: 3.88, attendance: 93, revenue: 0.9 },
];

/** For side-by-side bar: metric -> program A value, program B value */
const COMPARISON_BARS = [
  { metric: "GPA", cs: PROGRAMS[0].gpa, ds: PROGRAMS[1].gpa, unit: "" },
  { metric: "Attendance %", cs: PROGRAMS[0].attendance, ds: PROGRAMS[1].attendance, unit: "%" },
  { metric: "Revenue (M)", cs: PROGRAMS[0].revenue, ds: PROGRAMS[1].revenue, unit: "M" },
];

/** Radar: same three dimensions for both programs */
const RADAR_DATA = [
  { subject: "GPA (×20)", fullMark: 100, cs: Math.round(PROGRAMS[0].gpa * 25), ds: Math.round(PROGRAMS[1].gpa * 25) },
  { subject: "Attendance", fullMark: 100, cs: PROGRAMS[0].attendance, ds: PROGRAMS[1].attendance },
  { subject: "Revenue (×25)", fullMark: 100, cs: Math.round(PROGRAMS[0].revenue * 50), ds: Math.round(PROGRAMS[1].revenue * 50) },
];

export default function ProgramComparisonPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Program comparison</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Side-by-side view: Computer Science vs Data Science on GPA, Attendance, and Revenue.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Metrics comparison
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Side-by-side bar chart.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPARISON_BARS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value, name) => [
                    String(value ?? ""),
                    name === "cs" ? "Computer Science" : "Data Science",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="cs" name="Computer Science" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ds" name="Data Science" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Spider (radar) comparison
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Same metrics on a radar chart.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                <Radar name="Computer Science" dataKey="cs" stroke="#0f766e" fill="#0f766e" fillOpacity={0.4} strokeWidth={2} />
                <Radar name="Data Science" dataKey="ds" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 bg-slate-50/50">
        <h2 className="text-sm font-semibold text-slate-700">Comparative module</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/director/comparative/departments" className="text-sm font-medium text-slate-700 underline decoration-slate-400 hover:decoration-slate-600">Department performance →</Link>
          <Link href="/director/comparative/benchmarking" className="text-sm font-medium text-slate-700 underline decoration-slate-400 hover:decoration-slate-600">Benchmarking →</Link>
        </div>
      </Card>
    </div>
  );
}
