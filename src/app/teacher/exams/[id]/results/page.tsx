"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface ExamResult {
  studentId: string;
  studentName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  score: number;
  maxScore: number;
  completed: boolean;
}

const EXAM_DETAILS: Record<string, { name: string; date: string; course: string; maxScore: number }> = {
  "4": { name: "Methodology Quiz", date: "Mar 8, 2026", course: "RES 301 - Research Methods", maxScore: 100 },
  "5": { name: "Data Structures Midterm", date: "Mar 5, 2026", course: "CS 210 - Data Structures", maxScore: 100 },
  "2": { name: "Module 1 Quiz", date: "Mar 12, 2026", course: "CS 210 - Data Structures", maxScore: 100 },
};

const RESULTS: Record<string, ExamResult[]> = {
  "4": [
    { studentId: "st5", studentName: "Morgan Kim", startTime: "11:02 AM", endTime: "11:48 AM", durationMinutes: 46, score: 92, maxScore: 100, completed: true },
    { studentId: "st1", studentName: "Alex Johnson", startTime: "11:00 AM", endTime: "11:55 AM", durationMinutes: 55, score: 78, maxScore: 100, completed: true },
    { studentId: "st2", studentName: "Jordan Lee", startTime: "11:05 AM", endTime: "11:42 AM", durationMinutes: 37, score: 88, maxScore: 100, completed: true },
    { studentId: "st3", studentName: "Sam Chen", startTime: "11:01 AM", endTime: "—", durationMinutes: 20, score: 0, maxScore: 100, completed: false },
  ],
  "5": [
    { studentId: "st3", studentName: "Sam Chen", startTime: "2:00 PM", endTime: "3:10 PM", durationMinutes: 70, score: 85, maxScore: 100, completed: true },
    { studentId: "st8", studentName: "Jamie Park", startTime: "2:02 PM", endTime: "3:08 PM", durationMinutes: 66, score: 72, maxScore: 100, completed: true },
    { studentId: "st7", studentName: "Taylor Wong", startTime: "2:01 PM", endTime: "2:58 PM", durationMinutes: 57, score: 95, maxScore: 100, completed: true },
    { studentId: "st6", studentName: "Casey Brown", startTime: "2:05 PM", endTime: "3:12 PM", durationMinutes: 67, score: 68, maxScore: 100, completed: true },
  ],
  "2": [
    { studentId: "st1", studentName: "Alex Johnson", startTime: "2:00 PM", endTime: "2:42 PM", durationMinutes: 42, score: 90, maxScore: 100, completed: true },
    { studentId: "st2", studentName: "Jordan Lee", startTime: "2:01 PM", endTime: "2:44 PM", durationMinutes: 43, score: 82, maxScore: 100, completed: true },
    { studentId: "st4", studentName: "Riley Davis", startTime: "—", endTime: "—", durationMinutes: 0, score: 0, maxScore: 100, completed: false },
  ],
};

export default function ExamResultsPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const exam = EXAM_DETAILS[id] ?? {
    name: "Exam",
    date: "—",
    course: "—",
    maxScore: 100,
  };
  const results = RESULTS[id] ?? [];

  const completed = results.filter((r) => r.completed);
  const totalParticipants = results.length;
  const completionRate = totalParticipants > 0 ? Math.round((completed.length / totalParticipants) * 100) : 0;
  const scores = completed.map((r) => r.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const highest = scores.length > 0 ? Math.max(...scores) : 0;
  const lowest = scores.length > 0 ? Math.min(...scores) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <Link href="/teacher/exams" className="text-xs font-medium text-teal-600 hover:underline">
          ← Exams
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          {exam.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {exam.date} · {exam.course}
        </p>
        <p className="mt-0.5 text-sm font-medium text-slate-700">
          {totalParticipants} participant{totalParticipants !== 1 ? "s" : ""}
        </p>
      </section>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Average score</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{avgScore}%</p>
        </Card>
        <Card className="rounded-lg border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Highest</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{highest}%</p>
        </Card>
        <Card className="rounded-lg border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Lowest</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{lowest}%</p>
        </Card>
        <Card className="rounded-lg border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Completion rate</p>
          <p className="mt-1 text-2xl font-bold text-teal-600">{completionRate}%</p>
          <p className="mt-0.5 text-xs text-slate-500">{completed.length} of {totalParticipants} completed</p>
        </Card>
      </div>

      {/* Attendance list */}
      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">Attendance list</h2>
          <p className="text-xs text-slate-500">Student name, timing, and score. Click for detailed view.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Start</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">End</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Score</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    No results yet.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r.studentId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.startTime}</td>
                    <td className="px-4 py-3 text-slate-600">{r.endTime}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.durationMinutes > 0 ? `${r.durationMinutes} min` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex font-semibold",
                          r.completed
                            ? r.score >= 70
                              ? "text-emerald-600"
                              : "text-amber-600"
                            : "text-slate-400",
                        )}
                      >
                        {r.completed ? `${r.score}%` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/teacher/exams/${id}/results/${r.studentId}`}>
                        <Button type="button" variant="secondary" size="sm">
                          View details
                        </Button>
                      </Link>
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
