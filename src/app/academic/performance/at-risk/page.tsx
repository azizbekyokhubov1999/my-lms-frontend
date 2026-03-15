"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

interface AtRiskStudent {
  id: string;
  name: string;
  studentId: string;
  group: string;
  attendancePct: number;
  gpa: number;
  riskReason: string;
}

const MOCK_AT_RISK: AtRiskStudent[] = [
  { id: "r1", name: "Ivan Kozlov", studentId: "STU-10002", group: "SD-24-01", attendancePct: 62, gpa: 2.1, riskReason: "Low attendance and below-threshold GPA" },
  { id: "r2", name: "Dmitri Volkov", studentId: "STU-10004", group: "SD-24-01", attendancePct: 58, gpa: 1.9, riskReason: "Critical attendance; failing grades" },
  { id: "r3", name: "Elena Novikova", studentId: "STU-10005", group: "SD-24-02", attendancePct: 71, gpa: 2.0, riskReason: "GPA below 2.0; borderline attendance" },
];

export default function AtRiskStudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/performance" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Performance
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">At-risk students</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Predictive list: low attendance and/or poor grades. Initiate intervention to assign support.
        </p>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border-2 border-rose-200 bg-rose-50/30">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-rose-200 bg-rose-100">
                <th className="px-4 py-3 text-left font-medium text-rose-900">Student</th>
                <th className="px-4 py-3 text-left font-medium text-rose-900">Group</th>
                <th className="px-4 py-3 text-right font-medium text-rose-900">Attendance</th>
                <th className="px-4 py-3 text-right font-medium text-rose-900">GPA</th>
                <th className="px-4 py-3 text-left font-medium text-rose-900">Risk reason</th>
                <th className="w-44 px-4 py-3 text-right font-medium text-rose-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {MOCK_AT_RISK.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No at-risk students identified.
                  </td>
                </tr>
              ) : (
                MOCK_AT_RISK.map((s) => (
                  <tr key={s.id} className="bg-white hover:bg-rose-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs font-mono text-slate-500">{s.studentId}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{s.group}</td>
                    <td className="px-4 py-3 text-right font-medium text-rose-700">{s.attendancePct}%</td>
                    <td className="px-4 py-3 text-right font-medium text-rose-700">{s.gpa.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-700">{s.riskReason}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500"
                        onClick={() => alert(`Initiate intervention for ${s.name} (Demo). Assign tutor, schedule meeting, or add to support program.`)}
                      >
                        Initiate intervention
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
