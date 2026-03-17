"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

const SYSTEMIC_PATTERNS = [
  {
    id: "p1",
    pattern: "Attendance drops every time Exam Week starts",
    evidence: "Last 4 semesters: attendance falls 8–12% in the week before exams. Peaks again after exam period.",
    category: "Academic",
    severity: "Medium",
  },
  {
    id: "p2",
    pattern: "Finance collection dips in first month of semester",
    evidence: "Consistent 15–20% lower collection in Month 1 vs Month 2–3. Suggests payment timing or enrollment lag.",
    category: "Finance",
    severity: "High",
  },
  {
    id: "p3",
    pattern: "Grievances spike after grade release",
    evidence: "Grievance submissions increase 2–3x in the 2 weeks following mid-term and final grade release.",
    category: "Student experience",
    severity: "Medium",
  },
  {
    id: "p4",
    pattern: "Teacher overload concentrated in Engineering in S2",
    evidence: "Engineering workload exceeds 100% in S2 in 3 of last 4 years. Other faculties stable.",
    category: "Resources",
    severity: "High",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SystemicIssuesPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/incidents" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Incident dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Systemic issues</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Analytics that find patterns (e.g. attendance drops every Exam Week).
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Detected patterns
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Recurring patterns from incident and operational data. Use for preventive action.
        </p>
        <ul className="mt-4 space-y-4">
          {SYSTEMIC_PATTERNS.map((p) => (
            <li
              key={p.id}
              className={cn(
                "rounded-lg border p-4",
                p.severity === "High" ? "border-rose-200 bg-rose-50/30" : "border-slate-200 bg-slate-50/30",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-slate-900">{p.pattern}</p>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    p.severity === "High" && "bg-rose-600 text-white",
                    p.severity === "Medium" && "bg-amber-100 text-amber-800",
                  )}
                >
                  {p.severity}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{p.evidence}</p>
              <p className="mt-1 text-xs text-slate-500">Category: {p.category}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-slate-800 bg-slate-800/10">
        <h2 className="text-sm font-semibold text-slate-200">History</h2>
        <p className="mt-1 text-xs text-slate-400">
          Pattern analytics are run weekly. Historical pattern reports are available in the archive (slate-800 theme for history).
        </p>
      </Card>
    </div>
  );
}
