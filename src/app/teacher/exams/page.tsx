"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ExamStatus = "Draft" | "Active" | "Finished" | "Proctoring Verified";

interface Exam {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: ExamStatus;
  studentCount: number;
}

const EXAMS: Exam[] = [
  { id: "1", title: "Midterm Exam", course: "CS 440 - Machine Learning", date: "Mar 15, 2026", time: "10:00 AM", duration: "90 min", status: "Draft", studentCount: 42 },
  { id: "2", title: "Module 1 Quiz", course: "CS 210 - Data Structures", date: "Mar 12, 2026", time: "2:00 PM", duration: "45 min", status: "Active", studentCount: 28 },
  { id: "3", title: "Final Exam", course: "CS 440 - Machine Learning", date: "May 10, 2026", time: "9:00 AM", duration: "120 min", status: "Draft", studentCount: 42 },
  { id: "4", title: "Methodology Quiz", course: "RES 301 - Research Methods", date: "Mar 8, 2026", time: "11:00 AM", duration: "60 min", status: "Finished", studentCount: 18 },
  { id: "5", title: "Data Structures Midterm", course: "CS 210 - Data Structures", date: "Mar 5, 2026", time: "2:00 PM", duration: "75 min", status: "Proctoring Verified", studentCount: 28 },
];

export default function TeacherExamsPage() {
  const [statusFilter, setStatusFilter] = React.useState<ExamStatus | "all">("all");

  const filtered = statusFilter === "all"
    ? EXAMS
    : EXAMS.filter((e) => e.status === statusFilter);

  const statusBadge = (s: ExamStatus) => {
    switch (s) {
      case "Draft": return "bg-slate-100 text-slate-700";
      case "Active": return "bg-emerald-100 text-emerald-800";
      case "Finished": return "bg-sky-100 text-sky-800";
      case "Proctoring Verified": return "bg-teal-100 text-teal-800";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Exams
          </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage planned and completed exams. Monitor active exams in real time.
        </p>
        </div>
        <Link href="/teacher/exams/builder/new">
          <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
            Create exam
          </Button>
        </Link>
      </section>

      <Card className="rounded-lg border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-600">Filter:</span>
          {(["all", "Draft", "Active", "Finished", "Proctoring Verified"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                statusFilter === s
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Exam</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    No exams match the filter.
                  </td>
                </tr>
              ) : (
                filtered.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{exam.title}</p>
                      <p className="text-xs text-slate-500">{exam.duration} · {exam.studentCount} students</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{exam.course}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {exam.date} · {exam.time}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded px-2 py-0.5 text-xs font-semibold",
                          statusBadge(exam.status),
                        )}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {exam.status === "Active" && (
                        <Link href={`/teacher/exams/${exam.id}/monitoring`}>
                          <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                            Monitor
                          </Button>
                        </Link>
                      )}
                      {exam.status === "Draft" && (
                        <Link href={`/teacher/exams/builder/${exam.id}`}>
                          <Button type="button" variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>
                      )}
                      {exam.status === "Finished" && (
                        <Link href={`/teacher/exams/${exam.id}/results`}>
                          <Button type="button" variant="secondary" size="sm">
                            Results
                          </Button>
                        </Link>
                      )}
                      {exam.status === "Proctoring Verified" && (
                        <>
                          <Link href={`/teacher/exams/${exam.id}/grade`} className="mr-2">
                            <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                              Grade
                            </Button>
                          </Link>
                          <Link href={`/teacher/exams/${exam.id}/results`}>
                            <Button type="button" variant="secondary" size="sm">
                              Results
                            </Button>
                          </Link>
                        </>
                      )}
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
