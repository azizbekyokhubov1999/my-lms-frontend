"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

const DEPARTMENT_LEADERBOARD = [
  { rank: 1, department: "Law", compositeScore: 94, gpa: 3.95, attendance: 96, compliance: 95 },
  { rank: 2, department: "Engineering", compositeScore: 91, gpa: 3.92, attendance: 95, compliance: 92 },
  { rank: 3, department: "Language", compositeScore: 89, gpa: 3.90, attendance: 94, compliance: 90 },
  { rank: 4, department: "Business", compositeScore: 86, gpa: 3.88, attendance: 93, compliance: 88 },
  { rank: 5, department: "Arts & Sciences", compositeScore: 83, gpa: 3.85, attendance: 92, compliance: 85 },
  { rank: 6, department: "Medicine", compositeScore: 80, gpa: 3.78, attendance: 91, compliance: 82 },
];

export default function DepartmentPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/comparative" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Program comparison
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Department performance</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Leaderboard of best performing departments by composite score.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Leaderboard
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Composite score (0–100) from GPA, attendance, and compliance.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Rank</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Composite</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">GPA</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Attendance %</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEPARTMENT_LEADERBOARD.map((row) => (
                <tr key={row.rank} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.department}</td>
                  <td className="px-4 py-3 text-right font-semibold text-teal-700">{row.compositeScore}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.gpa}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.attendance}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.compliance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
