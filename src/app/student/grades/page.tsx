"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const CURRENT_GPA = 3.42;
const GPA_MAX = 4.0;

interface CourseGrade {
  id: string;
  course: string;
  attendance: number;
  midterm: number;
  midtermMax: number;
  final: number;
  finalMax: number;
  totalScore: number; // 0–100
  letterGrade: string;
}

const COURSE_GRADES: CourseGrade[] = [
  {
    id: "1",
    course: "Algorithms and Data Structures",
    attendance: 94,
    midterm: 38,
    midtermMax: 45,
    final: 42,
    finalMax: 50,
    totalScore: 87,
    letterGrade: "A",
  },
  {
    id: "2",
    course: "Distributed Systems",
    attendance: 88,
    midterm: 30,
    midtermMax: 40,
    final: 35,
    finalMax: 40,
    totalScore: 82,
    letterGrade: "B+",
  },
  {
    id: "3",
    course: "Research Methods",
    attendance: 91,
    midterm: 22,
    midtermMax: 30,
    final: 26,
    finalMax: 30,
    totalScore: 78,
    letterGrade: "B",
  },
  {
    id: "4",
    course: "Data Communications",
    attendance: 96,
    midterm: 36,
    midtermMax: 40,
    final: 38,
    finalMax: 45,
    totalScore: 88,
    letterGrade: "A",
  },
];

// Grade trend: semester -> GPA (for line chart)
const SEMESTER_TRENDS = [
  { semester: "Fall 24", gpa: 3.2 },
  { semester: "Spring 25", gpa: 3.35 },
  { semester: "Fall 25", gpa: 3.5 },
  { semester: "Spring 26", gpa: 3.42 },
];

/** Circular progress for GPA (0–4 scale shown as %) */
function GPACircle({ gpa, max = 4 }: { gpa: number; max?: number }) {
  const pct = Math.min(100, (gpa / max) * 100);
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-slate-200"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-sky-600 transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <span className="block text-xl font-bold text-slate-900">{gpa.toFixed(2)}</span>
        <span className="text-[10px] font-medium text-slate-500">GPA</span>
      </div>
    </div>
  );
}

/** Simple SVG line chart for grade trend */
function GradeTrendChart({ data }: { data: { semester: string; gpa: number }[] }) {
  const width = 320;
  const height = 120;
  const padding = { top: 10, right: 10, bottom: 28, left: 32 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const gpas = data.map((d) => d.gpa);
  const minY = Math.min(...gpas, 0);
  const maxY = Math.min(4, Math.max(...gpas) + 0.3);
  const scaleY = (v: number) =>
    padding.top + innerHeight - ((v - minY) / (maxY - minY)) * innerHeight;
  const scaleX = (i: number) =>
    padding.left + (i / Math.max(1, data.length - 1)) * innerWidth;

  const pathD = data
    .map((_, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(data[i].gpa)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-full"
      aria-label="GPA trend over semesters"
    >
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={padding.top + innerHeight}
        stroke="currentColor"
        strokeWidth="1"
        className="text-slate-200"
      />
      <line
        x1={padding.left}
        y1={padding.top + innerHeight}
        x2={padding.left + innerWidth}
        y2={padding.top + innerHeight}
        stroke="currentColor"
        strokeWidth="1"
        className="text-slate-200"
      />
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-sky-600"
      />
      {data.map((d, i) => (
        <circle
          key={d.semester}
          cx={scaleX(i)}
          cy={scaleY(d.gpa)}
          r="4"
          fill="currentColor"
          className="text-sky-600"
        />
      ))}
      {data.map((d, i) => (
        <text
          key={d.semester}
          x={scaleX(i)}
          y={height - 6}
          textAnchor="middle"
          className="fill-slate-500 text-[10px] font-medium"
        >
          {d.semester}
        </text>
      ))}
    </svg>
  );
}

export default function GradesPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Gradebook
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Overall GPA, course breakdown, and grade trends.
        </p>
      </section>

      {/* 1. Overall GPA Card with progress circle */}
      <Card className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-6">
          <GPACircle gpa={CURRENT_GPA} max={GPA_MAX} />
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Current GPA</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Out of {GPA_MAX} scale · Cumulative
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Credits earned: 78
            </p>
          </div>
        </div>
      </Card>

      {/* 2. Course Breakdown Table */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Course breakdown</h2>
        <p className="mt-1 text-xs text-slate-500">
          Attendance, midterm, final, and total grade per course
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Course
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  Attendance
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  Midterm
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  Final exam
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  Total grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COURSE_GRADES.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.course}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {row.attendance}%
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {row.midterm}/{row.midtermMax}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {row.final}/{row.finalMax}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-slate-900">
                      {row.letterGrade}
                    </span>
                    <span className="ml-1.5 text-slate-600">
                      ({row.totalScore}/100)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. Visual analytics — line chart */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Grade trend</h2>
        <p className="mt-1 text-xs text-slate-500">
          GPA by semester
        </p>
        <div className="mt-4 flex justify-center border border-slate-100 bg-slate-50/30 rounded-lg p-4">
          <GradeTrendChart data={SEMESTER_TRENDS} />
        </div>
      </Card>
    </div>
  );
}
