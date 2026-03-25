"use client";

import Link from "next/link";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "../../../components/ui/Card";

/** Cohort: intake year, enrolled at start, still active, retention % */
const COHORT_DATA = [
  { year: "2022", enrolled: 11500, active: 10200, retentionPct: 88.7 },
  { year: "2023", enrolled: 11900, active: 10850, retentionPct: 91.2 },
  { year: "2024", enrolled: 12400, active: 11680, retentionPct: 94.2 },
];

const INTAKE_2024_DETAIL = {
  enrolled: 12400,
  active: 11680,
  left: 720,
  retentionPct: 94.2,
};

export default function RetentionAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/progression" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Progression
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Retention analytics</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Cohort analysis: how many students from each intake are still active.
        </p>
      </div>

      <Card className="border-teal-100 bg-teal-50/30">
        <h2 className="text-sm font-semibold text-slate-700">2024 intake summary</h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Students who started in 2024 and are still active.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-slate-500">Enrolled (start)</dt>
            <dd className="mt-0.5 text-xl font-semibold text-slate-900">{INTAKE_2024_DETAIL.enrolled.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Still active</dt>
            <dd className="mt-0.5 text-xl font-semibold text-emerald-700">{INTAKE_2024_DETAIL.active.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Left</dt>
            <dd className="mt-0.5 text-xl font-semibold text-slate-700">{INTAKE_2024_DETAIL.left.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Retention rate</dt>
            <dd className="mt-0.5 text-xl font-semibold text-teal-700">{INTAKE_2024_DETAIL.retentionPct}%</dd>
          </div>
        </dl>
      </Card>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Cohort comparison
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Enrolled at start vs still active by intake year.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={COHORT_DATA}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value, name) => {
                  const num = Number(value ?? 0);
                  const label =
                    name === "enrolled"
                      ? "Enrolled"
                      : name === "active"
                        ? "Active"
                        : "Retention %";
                  return [num.toLocaleString(), label];
                }}
                labelFormatter={(label) => `Intake ${label}`}
              />
              <Bar dataKey="enrolled" name="enrolled" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="active" name="active" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-slate-400" /> Enrolled (start)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-teal-600" /> Still active
          </span>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Retention rate by cohort
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-2 font-medium text-slate-600">Intake year</th>
                <th className="pb-2 font-medium text-slate-600">Enrolled</th>
                <th className="pb-2 font-medium text-slate-600">Active</th>
                <th className="pb-2 font-medium text-slate-600">Retention %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COHORT_DATA.map((r) => (
                <tr key={r.year}>
                  <td className="py-2 font-medium text-slate-900">{r.year}</td>
                  <td className="py-2 text-slate-700">{r.enrolled.toLocaleString()}</td>
                  <td className="py-2 text-slate-700">{r.active.toLocaleString()}</td>
                  <td className="py-2 font-medium text-teal-700">{r.retentionPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
