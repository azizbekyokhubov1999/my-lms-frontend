"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const COURSE_GRADES = [
  { course: "CS 440 - ML", avgGrade: 84, color: "bg-teal-500" },
  { course: "CS 210 - Data Struct", avgGrade: 78, color: "bg-sky-500" },
  { course: "RES 301 - Research", avgGrade: 82, color: "bg-amber-500" },
];

const COURSE_ATTENDANCE = [
  { course: "CS 440", rate: 92, color: "bg-teal-500" },
  { course: "CS 210", rate: 85, color: "bg-sky-500" },
  { course: "RES 301", rate: 88, color: "bg-amber-500" },
];

const COURSE_COMPLETION = [
  { course: "CS 440 - ML", completed: 72, total: 42, pct: 72 },
  { course: "CS 210 - Data Struct", completed: 68, total: 28, pct: 68 },
  { course: "RES 301 - Research", completed: 78, total: 18, pct: 78 },
];

export default function TeacherReportsPage() {
  const [exporting, setExporting] = React.useState(false);
  const [exported, setExported] = React.useState(false);

  const handleExportReport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Reports
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Analytics and reports for grades, attendance, and course completion.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          className="bg-teal-600 hover:bg-teal-700"
          onClick={handleExportReport}
          disabled={exporting}
        >
          {exporting ? "Generating…" : exported ? "Report ready ✓" : "Semester Activity Report"}
        </Button>
      </section>

      {/* Visual data charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Average grades */}
        <Card className="rounded-lg border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Student average grades</h3>
          <p className="mt-0.5 text-xs text-slate-500">By course (0–100 scale)</p>
          <div className="mt-4 space-y-4">
            {COURSE_GRADES.map((row) => (
              <div key={row.course}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{row.course}</span>
                  <span className="font-semibold text-slate-900">{row.avgGrade}%</span>
                </div>
                <div className="mt-1 h-6 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full transition-all", row.color)}
                    style={{ width: `${row.avgGrade}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Attendance rates */}
        <Card className="rounded-lg border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Attendance rates</h3>
          <p className="mt-0.5 text-xs text-slate-500">Average lecture attendance by course</p>
          <div className="mt-4 space-y-4">
            {COURSE_ATTENDANCE.map((row) => (
              <div key={row.course}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{row.course}</span>
                  <span className="font-semibold text-slate-900">{row.rate}%</span>
                </div>
                <div className="mt-1 h-6 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full transition-all", row.color)}
                    style={{ width: `${row.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Course completion */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Course completion</h3>
        <p className="mt-0.5 text-xs text-slate-500">Students who completed core modules</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 text-left text-xs font-medium uppercase text-slate-600">Course</th>
                <th className="pb-2 text-left text-xs font-medium uppercase text-slate-600">Completed</th>
                <th className="pb-2 text-left text-xs font-medium uppercase text-slate-600">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {COURSE_COMPLETION.map((row) => (
                <tr key={row.course}>
                  <td className="py-3 font-medium text-slate-900">{row.course}</td>
                  <td className="py-3 text-slate-600">
                    {row.completed} / {row.total}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-teal-500"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{row.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export section */}
      <Card className="rounded-lg border-teal-200 bg-teal-50/30 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Export for Academic Dept</h3>
        <p className="mt-1 text-xs text-slate-600">
          Generate a Semester Activity Report summarizing grades, attendance, and completion. Submit to Academic Department for review.
        </p>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="mt-3 bg-teal-600 hover:bg-teal-700"
          onClick={handleExportReport}
          disabled={exporting}
        >
          {exporting ? "Generating…" : exported ? "Report ready ✓" : "Generate Semester Activity Report"}
        </Button>
      </Card>
    </div>
  );
}
