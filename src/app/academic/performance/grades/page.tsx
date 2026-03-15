"use client";

import Link from "next/link";
import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { Card } from "../../../components/ui/Card";

const GPA_DISTRIBUTION = [
  { range: "1.0–1.5", count: 2 },
  { range: "1.5–2.0", count: 5 },
  { range: "2.0–2.5", count: 12 },
  { range: "2.5–3.0", count: 28 },
  { range: "3.0–3.5", count: 45 },
  { range: "3.5–4.0", count: 32 },
];

const AVG_GRADE_TREND = [
  { period: "Sep 25", avg: 3.05 },
  { period: "Oct 25", avg: 3.02 },
  { period: "Nov 25", avg: 3.08 },
  { period: "Dec 25", avg: 3.04 },
  { period: "Jan 26", avg: 3.12 },
  { period: "Feb 26", avg: 3.15 },
];

const TOP_PERFORMERS = [
  { name: "Maria Sokolova", studentId: "STU-10003", gpa: 3.92, faculty: "Engineering" },
  { name: "Anna Petrova", studentId: "STU-10001", gpa: 3.88, faculty: "Engineering" },
  { name: "Elena Novikova", studentId: "STU-10005", gpa: 3.85, faculty: "Business" },
  { name: "Sofia Kim", studentId: "STU-10010", gpa: 3.82, faculty: "Law" },
  { name: "Alex Ivanov", studentId: "STU-10011", gpa: 3.78, faculty: "Engineering" },
];

const PURPLE_BAR = "#7c3aed";

export default function GradeReportPage() {
  const avgGpa = (GPA_DISTRIBUTION.reduce((s, r) => s + r.count, 0) > 0)
    ? (GPA_DISTRIBUTION.reduce((s, r, i) => {
        const mid = 1.25 + i * 0.5;
        return s + mid * r.count;
      }, 0) / GPA_DISTRIBUTION.reduce((s, r) => s + r.count, 0)).toFixed(2)
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/performance" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Performance
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Grade analytics</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          GPA distribution, average grade trends, and top performers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-purple-200 bg-purple-50/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-purple-700">Average GPA (current)</p>
          <p className="mt-1 text-2xl font-bold text-purple-900">{avgGpa}</p>
        </Card>
        <Card className="border-purple-200 bg-purple-50/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-purple-700">Top performers</p>
          <p className="mt-1 text-2xl font-bold text-purple-900">{TOP_PERFORMERS.length}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">GPA distribution</h2>
          <p className="mt-0.5 text-xs text-slate-600">Student count by GPA range.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GPA_DISTRIBUTION} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Students" fill={PURPLE_BAR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Average grade trend</h2>
          <p className="mt-0.5 text-xs text-slate-600">Cohort average GPA over time.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={AVG_GRADE_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis domain={[2.8, 3.4]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v.toFixed(2), "Avg GPA"]} />
                <Line type="monotone" dataKey="avg" name="Avg GPA" stroke={PURPLE_BAR} strokeWidth={2} dot={{ fill: PURPLE_BAR }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Top performers</h2>
        <p className="mt-0.5 text-xs text-slate-600">Highest GPA in current term.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-purple-200 bg-purple-50/30">
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b border-purple-200 bg-purple-100">
                <th className="px-4 py-3 text-left font-medium text-purple-900">#</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Student</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Faculty</th>
                <th className="px-4 py-3 text-right font-medium text-purple-900">GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {TOP_PERFORMERS.map((s, i) => (
                <tr key={s.studentId} className="hover:bg-purple-100/50">
                  <td className="px-4 py-3 font-medium text-purple-800">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs font-mono text-slate-500">{s.studentId}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.faculty}</td>
                  <td className="px-4 py-3 text-right font-semibold text-purple-700">{s.gpa.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
