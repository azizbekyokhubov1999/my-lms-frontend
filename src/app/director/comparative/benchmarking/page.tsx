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

import { Card } from "../../../components/ui/Card";

/** University standards (target) vs actual */
const BENCHMARK_DATA = [
  { metric: "GPA", target: 3.0, actual: 3.92 },
  { metric: "Attendance %", target: 75, actual: 94.3 },
  { metric: "Retention %", target: 85, actual: 94.2 },
  { metric: "Compliance", target: 80, actual: 87 },
  { metric: "Revenue (index)", target: 90, actual: 98 },
];

/** Radar: target vs actual (normalized 0–100 for display) */
const RADAR_BENCHMARK = [
  { subject: "GPA (×25)", target: 75, actual: 98 },
  { subject: "Attendance", target: 75, actual: 94 },
  { subject: "Retention", target: 85, actual: 94 },
  { subject: "Compliance", target: 80, actual: 87 },
  { subject: "Revenue idx", target: 90, actual: 98 },
];

export default function BenchmarkingPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/comparative" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Program comparison
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Benchmarking</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Compare internal performance against University Standards (Target vs Actual).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Target vs actual (side-by-side)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            University Standards (target) vs current actual.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BENCHMARK_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value: unknown, name: string) => [value, name === "target" ? "Target" : "Actual"]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="target" name="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Spider (radar) – Target vs actual
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Same benchmarks on a radar chart (values normalized for scale).
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_BENCHMARK}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                <Radar name="Target" dataKey="target" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Actual" dataKey="actual" stroke="#0f766e" fill="#0f766e" fillOpacity={0.4} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 bg-slate-50/50">
        <h2 className="text-sm font-semibold text-slate-700">University standards (targets)</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
          <li>Target GPA: 3.0 (Actual: 3.92)</li>
          <li>Target Attendance: 75% (Actual: 94.3%)</li>
          <li>Target Retention: 85% (Actual: 94.2%)</li>
          <li>Target Compliance: 80 (Actual: 87)</li>
          <li>Revenue index target: 90 (Actual: 98)</li>
        </ul>
      </Card>
    </div>
  );
}
