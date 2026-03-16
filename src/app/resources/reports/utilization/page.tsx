"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface DeptUtilization {
  id: string;
  department: string;
  teachers: number;
  teachingHours: number;
  capacityHours: number; // max hours available
  utilizationPercent: number;
  studentsServed: number;
}

const MOCK_DEPARTMENTS: DeptUtilization[] = [
  { id: "d1", department: "Engineering", teachers: 24, teachingHours: 420, capacityHours: 520, utilizationPercent: 81, studentsServed: 680 },
  { id: "d2", department: "Business", teachers: 18, teachingHours: 380, capacityHours: 450, utilizationPercent: 84, studentsServed: 520 },
  { id: "d3", department: "Law", teachers: 12, teachingHours: 240, capacityHours: 300, utilizationPercent: 80, studentsServed: 320 },
  { id: "d4", department: "Medicine", teachers: 20, teachingHours: 410, capacityHours: 500, utilizationPercent: 82, studentsServed: 440 },
  { id: "d5", department: "Arts & Sciences", teachers: 22, teachingHours: 350, capacityHours: 480, utilizationPercent: 73, studentsServed: 580 },
];

export default function UtilizationAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/resources/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Reports
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Utilization analytics</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Compare how different departments use their teaching resources (hours vs capacity).
        </p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Department comparison</h2>
        <p className="mt-0.5 text-xs text-slate-600">Teaching hours used vs capacity. Bar = utilization % (0–100).</p>
        <div className="mt-6 space-y-6">
          {MOCK_DEPARTMENTS.map((d) => (
            <div key={d.id}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-medium text-slate-700">{d.department}</span>
                <span className="text-slate-500">{d.utilizationPercent}% · {d.teachingHours}h / {d.capacityHours}h</span>
              </div>
              <div className="h-8 w-full overflow-hidden rounded-md bg-slate-100">
                <div
                  className={cn(
                    "h-full rounded-md transition-[width] duration-500",
                    d.utilizationPercent >= 90 ? "bg-amber-500" : d.utilizationPercent >= 75 ? "bg-teal-500" : "bg-teal-400",
                  )}
                  style={{ width: `${d.utilizationPercent}%`, minWidth: d.utilizationPercent > 0 ? "4px" : "0" }}
                  aria-hidden
                />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>{d.teachers} FTE · {d.studentsServed} students</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Summary table</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Teachers</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Hours used</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Capacity</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Utilization</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_DEPARTMENTS.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{d.department}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{d.teachers}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{d.teachingHours}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{d.capacityHours}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "font-medium",
                        d.utilizationPercent >= 90 ? "text-amber-700" : "text-teal-700",
                      )}
                    >
                      {d.utilizationPercent}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">{d.studentsServed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
