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

import { Card } from "../../components/ui/Card";

const GPA_BY_FACULTY = [
  { name: "Engineering", gpa: 3.92, students: 2100 },
  { name: "Business", gpa: 3.88, students: 1850 },
  { name: "Law", gpa: 3.95, students: 820 },
  { name: "Medicine", gpa: 3.78, students: 1100 },
  { name: "Arts & Sciences", gpa: 3.85, students: 2400 },
  { name: "Language", gpa: 3.90, students: 650 },
];

const GPA_BY_PROGRAM = [
  { name: "CS", gpa: 3.94 },
  { name: "MBA", gpa: 3.82 },
  { name: "LLB", gpa: 3.96 },
  { name: "MD", gpa: 3.76 },
  { name: "BA Liberal Arts", gpa: 3.88 },
  { name: "Applied Linguistics", gpa: 3.91 },
];

export default function AcademicPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Academic Performance</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          High-level view of GPA by Faculty and Program.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            GPA by faculty
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Average GPA and student count per faculty.</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GPA_BY_FACULTY} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} angle={-25} textAnchor="end" />
                <YAxis domain={[3.5, 4.2]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value, name) => [String(value ?? ""), name === "gpa" ? "GPA" : "Students"]}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="gpa" name="gpa" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            GPA by program
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Average GPA per selected program.</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GPA_BY_PROGRAM} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} angle={-25} textAnchor="end" />
                <YAxis domain={[3.5, 4.2]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value) => [String(value ?? ""), "GPA"]}
                />
                <Bar dataKey="gpa" name="GPA" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 bg-slate-50/50">
        <h2 className="text-sm font-semibold text-slate-700">Academic analytics</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/director/academic/grades" className="text-sm font-medium text-slate-700 underline decoration-slate-400 hover:decoration-slate-600">Grade analytics →</Link>
          <Link href="/director/academic/at-risk" className="text-sm font-medium text-slate-700 underline decoration-slate-400 hover:decoration-slate-600">At-risk students →</Link>
          <Link href="/director/academic/outcomes" className="text-sm font-medium text-slate-700 underline decoration-slate-400 hover:decoration-slate-600">Learning outcomes →</Link>
        </div>
      </Card>
    </div>
  );
}
