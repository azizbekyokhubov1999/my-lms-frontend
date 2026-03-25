"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STORAGE_KEY_GRADES = "teacher-grades";

function loadPostedGrades(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GRADES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Weights: assignments 30%, midterm 30%, final 40%. Final grade = sum(score/max * weight) */
const WEIGHTS = { assignments: 0.3, midterm: 0.3, final: 0.4 };
const ASSIGNMENT_WEIGHT = WEIGHTS.assignments / 3; // 3 assignments, 10% each

interface GradeRow {
  studentId: string;
  studentName: string;
  group: string;
  a1: number | null;
  a2: number | null;
  a3: number | null;
  quiz1: number | null;
  quiz2: number | null;
  midterm: number | null;
  final: number | null;
}

const MAX_POINTS = { a1: 100, a2: 100, a3: 100, quiz1: 100, quiz2: 100, midterm: 100, final: 100 };

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
    { studentId: "st1", studentName: "Alex Johnson", group: "Group-101", a1: 85, a2: null, a3: null, quiz1: 88, quiz2: null, midterm: 78, final: null },
    { studentId: "st2", studentName: "Jordan Lee", group: "Group-101", a1: 92, a2: 88, a3: null, quiz1: 90, quiz2: 85, midterm: 90, final: null },
    { studentId: "st4", studentName: "Riley Davis", group: "Group-102", a1: null, a2: null, a3: null, quiz1: null, quiz2: null, midterm: null, final: null },
    { studentId: "st6", studentName: "Casey Brown", group: "Group-101", a1: 78, a2: 82, a3: 80, quiz1: 75, quiz2: 80, midterm: 75, final: 88 },
    { studentId: "st7", studentName: "Taylor Wong", group: "Group-102", a1: 95, a2: 91, a3: 89, quiz1: 98, quiz2: 92, midterm: 92, final: 90 },
  ],
  "2": [
    { studentId: "st3", studentName: "Sam Chen", group: "Group-201", a1: 88, a2: null, a3: null, quiz1: 82, quiz2: null, midterm: null, final: null },
    { studentId: "st8", studentName: "Jamie Park", group: "Group-201", a1: 72, a2: 76, a3: 80, quiz1: 70, quiz2: 74, midterm: 70, final: null },
  ],
  "3": [
    { studentId: "st5", studentName: "Morgan Kim", group: "Group-301", a1: 90, a2: null, a3: null, quiz1: 85, quiz2: null, midterm: 85, final: null },
  ],
};

const DETAILED_COLUMNS = [
  { key: "a1", label: "Assignment 1", sublabel: "A1", max: MAX_POINTS.a1 },
  { key: "a2", label: "Assignment 2", sublabel: "A2", max: MAX_POINTS.a2 },
  { key: "a3", label: "Assignment 3", sublabel: "A3", max: MAX_POINTS.a3 },
  { key: "quiz1", label: "Quiz 1", sublabel: null, max: MAX_POINTS.quiz1 },
  { key: "quiz2", label: "Quiz 2", sublabel: null, max: MAX_POINTS.quiz2 },
  { key: "midterm", label: "Midterm Exam", sublabel: null, max: MAX_POINTS.midterm },
  { key: "final", label: "Final Exam", sublabel: null, max: MAX_POINTS.final },
] as const;

const WEIGHTED_KEYS = ["a1", "a2", "a3", "midterm", "final"] as const;

function isWeighted(key: string): boolean {
  return (WEIGHTED_KEYS as readonly string[]).includes(key);
}

function mergeWithPostedGrades(
  baseRows: GradeRow[],
  courseId: string,
  posted: Record<string, number>,
): GradeRow[] {
  return baseRows.map((row) => {
    const merged: GradeRow = { ...row };
    (["a1", "a2", "a3"] as const).forEach((key) => {
      const storageKey = `${courseId}-${row.studentId}-${key}`;
      if (posted[storageKey] != null) {
        merged[key] = posted[storageKey];
      }
    });
    return merged;
  });
}

export default function TeacherGradebookPage() {
  const [selectedCourseId, setSelectedCourseId] = React.useState("1");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [postedGrades, setPostedGrades] = React.useState<Record<string, number>>({});

  const baseRows = GRADEBOOK[selectedCourseId] ?? [];
  const rows = React.useMemo(
    () => mergeWithPostedGrades(baseRows, selectedCourseId, postedGrades),
    [baseRows, selectedCourseId, postedGrades],
  );

  const filteredRows = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.studentName.toLowerCase().includes(q) ||
        row.group.toLowerCase().includes(q),
    );
  }, [rows, searchQuery]);

  const refreshScores = () => {
    setPostedGrades(loadPostedGrades());
  };

  React.useEffect(() => {
    setPostedGrades(loadPostedGrades());
  }, []);

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
        <div className="flex flex-wrap items-end gap-4">
          <div>
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
          </div>
          <div className="min-w-[200px] flex-1">
            <Input
              id="gradebook-search"
              type="search"
              placeholder="Search by name or group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search students by name or group"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={refreshScores}
          >
            Refresh
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="sticky left-0 z-10 min-w-[140px] bg-slate-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                  Student
                </th>
                <th className="sticky left-[140px] z-10 min-w-[90px] bg-slate-50 px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                  Group
                </th>
                {DETAILED_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "min-w-[72px] px-2 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-600",
                      isWeighted(col.key) ? "bg-slate-100" : "bg-slate-50/80",
                    )}
                    title={isWeighted(col.key) ? "Used in final grade" : undefined}
                  >
                    <span className="block">{col.label}</span>
                    {col.sublabel && (
                      <span className="mt-0.5 block text-[10px] text-slate-500">({col.sublabel})</span>
                    )}
                  </th>
                ))}
                <th className="min-w-[90px] bg-slate-100 px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  Final grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={2 + DETAILED_COLUMNS.length + 1} className="px-4 py-12 text-center text-slate-500">
                    {rows.length === 0 ? "No students in this course." : "No students match your search."}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const finalGrade = computeFinalGrade(row);
                  return (
                    <tr key={row.studentId} className="hover:bg-slate-50/50">
                      <td className="sticky left-0 z-10 min-w-[140px] bg-white px-4 py-3 font-medium text-slate-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                        {row.studentName}
                      </td>
                      <td className="sticky left-[140px] z-10 min-w-[90px] bg-white px-3 py-3 text-slate-600 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                        {row.group}
                      </td>
                      {DETAILED_COLUMNS.map((col) => {
                        const value = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={cn(
                              "px-2 py-3 text-center text-slate-700",
                              isWeighted(col.key) ? "bg-slate-50/70" : "bg-white",
                            )}
                          >
                            {value != null ? value : "—"}
                          </td>
                        );
                      })}
                      <td className="bg-slate-50/70 px-4 py-3 text-right">
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
        <strong>Weights:</strong> Assignments 30% (A1–A3, 10% each), Midterm 30%, Final 40%. Final grade is computed from A1, A2, A3, Midterm, and Final only. Quiz scores are for reference.
      </p>
    </div>
  );
}
