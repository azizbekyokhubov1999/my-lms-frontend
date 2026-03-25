"use client";

import Link from "next/link";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card";

/** Bell curve–style distribution: grade band -> count of students */
const GRADE_DISTRIBUTION = [
  { band: "A (4.0–5.0)", count: 1820, pct: 14 },
  { band: "A- (3.7–3.9)", count: 3210, pct: 25 },
  { band: "B+ (3.3–3.6)", count: 3850, pct: 30 },
  { band: "B (3.0–3.2)", count: 2180, pct: 17 },
  { band: "C (2.0–2.9)", count: 1280, pct: 10 },
  { band: "D/F (<2.0)", count: 507, pct: 4 },
];

export default function GradeAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/academic" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Academic Performance
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Grade Analytics</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Bell curve distribution of grades across the university.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Grade distribution
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Number of students per grade band (approximate normal distribution).
        </p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GRADE_DISTRIBUTION} margin={{ top: 10, right: 20, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="band" tick={{ fontSize: 10, fill: "#64748b" }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(
                  value,
                  _name,
                  props: { payload?: { pct?: number } } | undefined
                ) => {
                  const pct = props?.payload?.pct ?? 0;
                  return [`${value ?? 0} students (${pct}%)`, "Count"];
                }}
              />
              <Bar dataKey="count" name="Students" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
