"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const AT_RISK_STUDENTS = [
  { id: "s1", name: "Ali Karimov", faculty: "Engineering", attendance: "62%", gpa: "2.1", status: "Failing both" },
  { id: "s2", name: "Dilnoza Rahimova", faculty: "Business", attendance: "58%", gpa: "2.3", status: "Failing both" },
  { id: "s3", name: "Jasur Toshmatov", faculty: "Medicine", attendance: "71%", gpa: "1.9", status: "Failing both" },
  { id: "s4", name: "Madina Yusupova", faculty: "Law", attendance: "65%", gpa: "2.0", status: "Failing both" },
  { id: "s5", name: "Rustam Bekmurodov", faculty: "Arts & Sciences", attendance: "69%", gpa: "2.2", status: "Failing both" },
];

export default function AtRiskStudentsPage() {
  const [escalated, setEscalated] = React.useState<Set<string>>(new Set());

  const handleEscalate = (id: string) => {
    setEscalated((prev) => new Set(prev).add(id));
    // Demo: could call API here
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/academic" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Academic Performance
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">At-Risk Students</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Students failing both attendance and grades. Escalate to Academic Dept for intervention.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          At-risk list
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Failing both attendance (&lt;75%) and grades (GPA &lt;2.5). Click to escalate.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Faculty</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Attendance</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">GPA</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AT_RISK_STUDENTS.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-700">{s.faculty}</td>
                  <td className="px-4 py-3 text-right text-red-600">{s.attendance}</td>
                  <td className="px-4 py-3 text-right text-red-600">{s.gpa}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {escalated.has(s.id) ? (
                      <span className="text-xs font-medium text-slate-500">Escalated</span>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                        onClick={() => handleEscalate(s.id)}
                      >
                        Escalate to Academic Dept
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
