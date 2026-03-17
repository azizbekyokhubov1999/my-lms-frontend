"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Teacher Performance vs Salary/Workload for efficiency matrix */
const EFFICIENCY_MATRIX = [
  { id: "1", department: "Engineering", performance: 92, salaryBand: "Mid", workloadPct: 88, efficiency: "High" },
  { id: "2", department: "Business", performance: 85, salaryBand: "High", workloadPct: 82, efficiency: "Medium" },
  { id: "3", department: "Law", performance: 94, salaryBand: "Mid", workloadPct: 76, efficiency: "High" },
  { id: "4", department: "Medicine", performance: 88, salaryBand: "High", workloadPct: 95, efficiency: "Medium" },
  { id: "5", department: "Arts & Sciences", performance: 79, salaryBand: "Mid", workloadPct: 91, efficiency: "Low" },
  { id: "6", department: "Language", performance: 90, salaryBand: "Low", workloadPct: 72, efficiency: "High" },
];

/** Resource forecast: base FTE and rooms, then +20% intake */
const CURRENT_STUDENTS = 12847;
const CURRENT_FTE = 520;
const CURRENT_ROOMS = 312;
const INTAKE_INCREASE_PCT = 20;
const STUDENTS_PER_FTE = 25;
const STUDENTS_PER_ROOM = 45;

const additionalStudents = Math.round((CURRENT_STUDENTS * INTAKE_INCREASE_PCT) / 100);
const requiredFTE = Math.ceil((CURRENT_STUDENTS + additionalStudents) / STUDENTS_PER_FTE);
const requiredRooms = Math.ceil((CURRENT_STUDENTS + additionalStudents) / STUDENTS_PER_ROOM);
const newFTENeeded = Math.max(0, requiredFTE - CURRENT_FTE);
const newRoomsNeeded = Math.max(0, requiredRooms - CURRENT_ROOMS);

export default function ResourceEfficiencyPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Resources</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Resource efficiency (performance vs salary/workload) and forecast for intake growth.
        </p>
      </div>

      {/* 1. Resource Efficiency Matrix */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Teacher performance vs. salary / workload
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Matrix by department. Efficiency = high performance relative to salary and sustainable workload.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Department</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Performance</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Salary band</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Workload %</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EFFICIENCY_MATRIX.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.department}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.performance}%</td>
                  <td className="px-4 py-3 text-slate-700">{row.salaryBand}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.workloadPct}%</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.efficiency === "High" && "bg-emerald-100 text-emerald-800",
                        row.efficiency === "Medium" && "bg-amber-100 text-amber-800",
                        row.efficiency === "Low" && "bg-slate-200 text-slate-700",
                      )}
                    >
                      {row.efficiency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 2. Resource Forecast */}
      <Card className="border-teal-100 bg-teal-50/20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Resource forecast
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Predicting how many new teachers and rooms are needed for a {INTAKE_INCREASE_PCT}% increase in student intake.
        </p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-800">
            Assumptions: current students {CURRENT_STUDENTS.toLocaleString()}, {STUDENTS_PER_FTE} students/FTE, {STUDENTS_PER_ROOM} students/room.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            +{INTAKE_INCREASE_PCT}% intake → +{additionalStudents.toLocaleString()} students → total {((CURRENT_STUDENTS + additionalStudents)).toLocaleString()} students.
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <dt className="text-xs font-medium uppercase text-slate-500">New teachers (FTE) needed</dt>
              <dd className="mt-1 text-2xl font-semibold text-teal-700">{newFTENeeded}</dd>
              <dd className="mt-0.5 text-xs text-slate-600">
                Required FTE: {requiredFTE} · Current: {CURRENT_FTE}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <dt className="text-xs font-medium uppercase text-slate-500">New rooms needed</dt>
              <dd className="mt-1 text-2xl font-semibold text-teal-700">{newRoomsNeeded}</dd>
              <dd className="mt-0.5 text-xs text-slate-600">
                Required: {requiredRooms} · Current: {CURRENT_ROOMS}
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  );
}
