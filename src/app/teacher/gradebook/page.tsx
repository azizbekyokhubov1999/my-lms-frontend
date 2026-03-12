"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Weights: assignments 30%, midterm 30%, final 40%. Final grade = sum(score/max * weight) */
const WEIGHTS = { assignments: 0.3, midterm: 0.3, final: 0.4 };
const ASSIGNMENT_WEIGHT = WEIGHTS.assignments / 3; // 3 assignments, 10% each

interface GradeRow {
  studentId: string;
  studentName: string;
  a1: number | null;
  a2: number | null;
  a3: number | null;
  midterm: number | null;
  final: number | null;
}

const MAX_POINTS = { a1: 100, a2: 100, a3: 100, midterm: 100, final: 100 };

function computeFinalGrade(row: GradeRow): number | null {
  let weighted = 0;
  let totalWeight = 0;
  [row.a1, row.a2, row.a3].forEach((s) => {
    if (s != null) {
      weighted += (s / MAX_POINTS.a1) * ASSIGNMENT_WEIGHT;
      totalWeight += ASSIGNMENT_WEIGHT;
    }
  });
  if (row.midterm != null) {
    weighted += (row.midterm / MAX_POINTS.midterm) * WEIGHTS.midterm;
    totalWeight += WEIGHTS.midterm;
  }
  if (row.final != null) {
    weighted += (row.final / MAX_POINTS.final) * WEIGHTS.final;
    totalWeight += WEIGHTS.final;
  }
  if (totalWeight === 0) return null;
  return Math.round((weighted / totalWeight) * 100);
}

const COURSES = [
  { id: "1", name: "CS 440 - Machine Learning" },
  { id: "2", name: "CS 210 - Data Structures" },
  { id: "3", name: "RES 301 - Research Methods" },
];

const GRADEBOOK: Record<string, GradeRow[]> = {
  "1": [
    { studentId: "st1", studentName: "Alex Johnson", a1: 85, a2: null, a3: null, midterm: 78, final: null },
    { studentId: "st2", studentName: "Jordan Lee", a1: 92, a2: 88, a3: null, midterm: 90, final: null },
    { studentId: "st4", studentName: "Riley Davis", a1: null, a2: null, a3: null, midterm: null, final: null },
    { studentId: "st6", studentName: "Casey Brown", a1: 78, a2: 82, a3: 80, midterm: 75, final: 88 },
    { studentId: "st7", studentName: "Taylor Wong", a1: 95, a2: 91, a3: 89, midterm: 92, final: 90 },
  ],
  "2": [
    { studentId: "st3", studentName: "Sam Chen", a1: 88, a2: null, a3: null, midterm: null, final: null },
    { studentId: "st8", studentName: "Jamie Park", a1: 72, a2: 76, a3: 80, midterm: 70, final: null },
  ],
  "3": [
    { studentId: "st5", studentName: "Morgan Kim", a1: 90, a2: null, a3: null, midterm: 85, final: null },
  ],
};

export default function TeacherGradebookPage() {
  const [selectedCourseId, setSelectedCourseId] = React.useState("1");
  const rows = GRADEBOOK[selectedCourseId] ?? [];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Gradebook
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View and manage grades by course. Final grade is calculated from assignments (30%), midterm (30%), and final (40%).
        </p>
      </section>

      <Card className="rounded-lg border-slate-200 p-4">
        <label htmlFor="course-select" className="block text-xs font-medium text-slate-700">
          Select course
        </label>
        <select
          id="course-select"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          {COURSES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Card>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="sticky left-0 z-10 min-w-[140px] bg-slate-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Student
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-600">
                  A1
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-600">
                  A2
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-600">
                  A3
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-600">
                  Midterm
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-600">
                  Final
                </th>
                <th className="min-w-[90px] px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  Final grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No students in this course.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const finalGrade = computeFinalGrade(row);
                  return (
                    <tr key={row.studentId} className="hover:bg-slate-50/50">
                      <td className="sticky left-0 z-10 min-w-[140px] bg-white px-4 py-3 font-medium text-slate-900">
                        {row.studentName}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-700">
                        {row.a1 != null ? row.a1 : "—"}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-700">
                        {row.a2 != null ? row.a2 : "—"}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-700">
                        {row.a3 != null ? row.a3 : "—"}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-700">
                        {row.midterm != null ? row.midterm : "—"}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-700">
                        {row.final != null ? row.final : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {finalGrade != null ? (
                          <span
                            className={cn(
                              "inline-flex rounded px-2 py-0.5 text-xs font-bold",
                              finalGrade >= 90 && "bg-emerald-100 text-emerald-800",
                              finalGrade >= 80 && finalGrade < 90 && "bg-teal-100 text-teal-800",
                              finalGrade >= 70 && finalGrade < 80 && "bg-sky-100 text-sky-800",
                              finalGrade >= 60 && finalGrade < 70 && "bg-amber-100 text-amber-800",
                              finalGrade < 60 && "bg-red-100 text-red-800",
                            )}
                          >
                            {finalGrade}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-slate-500">
        <strong>Weights:</strong> Assignments 30% (A1–A3, 10% each), Midterm 30%, Final 40%. Final grade is computed from available scores only.
      </p>
    </div>
  );
}
