"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

const DROPOUT_RISK_STUDENTS = [
  { id: "r1", name: "Aziza N", faculty: "Engineering", riskScore: 82, financial: "Outstanding fees", academic: "Low GPA, missed exams" },
  { id: "r2", name: "Bekzod K", faculty: "Business", riskScore: 78, financial: "Payment plan default", academic: "Attendance <70%" },
  { id: "r3", name: "Dilafruz M", faculty: "Medicine", riskScore: 75, financial: "No issues", academic: "Failing 2 courses" },
  { id: "r4", name: "Jahongir T", faculty: "Law", riskScore: 71, financial: "Delayed payments", academic: "Declining grades" },
  { id: "r5", name: "Nilufar S", faculty: "Arts & Sciences", riskScore: 68, financial: "Outstanding fees", academic: "Low engagement" },
];

function riskLevel(score: number): { label: string; className: string } {
  if (score >= 80) return { label: "High", className: "bg-red-100 text-red-800" };
  if (score >= 60) return { label: "Medium", className: "bg-amber-100 text-amber-800" };
  return { label: "Low", className: "bg-slate-100 text-slate-700" };
}

export default function DropoutRiskPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/progression" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Progression
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Dropout risk</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Predictive view of students likely to leave based on financial and academic patterns.
        </p>
      </div>

      <Card className="border-amber-100 bg-amber-50/30">
        <p className="text-sm text-amber-800">
          <strong>Model:</strong> Risk score 0–100 from payment history, attendance, grades, and engagement. 
          High-risk students are prioritized for outreach and support.
        </p>
      </Card>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Students at risk
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Sorted by risk score. Use financial and academic factors for intervention.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Faculty</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Risk score</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Financial</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Academic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DROPOUT_RISK_STUDENTS.map((s) => {
                const level = riskLevel(s.riskScore);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-700">{s.faculty}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${level.className}`}>
                        {s.riskScore} · {level.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{s.financial}</td>
                    <td className="px-4 py-3 text-slate-700">{s.academic}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
