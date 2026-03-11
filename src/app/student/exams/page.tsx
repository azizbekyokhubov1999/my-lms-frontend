"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

interface UpcomingExam {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  durationMinutes: number;
}

interface PastResult {
  id: string;
  title: string;
  course: string;
  date: string;
  score: number;
  maxScore: number;
  passed: boolean;
}

const UPCOMING: UpcomingExam[] = [
  {
    id: "midterm-algorithms",
    title: "Algorithms Midterm",
    course: "Algorithms and Data Structures",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: "14:00",
    durationMinutes: 90,
  },
  {
    id: "quiz-distributed",
    title: "Quiz 2: Consensus",
    course: "Distributed Systems",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: "10:00",
    durationMinutes: 45,
  },
];

const PAST_RESULTS: PastResult[] = [
  {
    id: "entrance",
    title: "Entrance Exam",
    course: "Admission",
    date: "2026-02-15",
    score: 78,
    maxScore: 100,
    passed: true,
  },
  {
    id: "algorithms-quiz1",
    title: "Quiz 1: Foundations",
    course: "Algorithms and Data Structures",
    date: "2026-02-28",
    score: 22,
    maxScore: 25,
    passed: true,
  },
];

function formatDate(iso: string): string {
  return new Date(iso + "Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExamCenterPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Exam center
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Upcoming exams and past results. Run a system check before starting.
        </p>
      </section>

      {/* Upcoming exams */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Upcoming exams</h2>
        {UPCOMING.length === 0 ? (
          <Card className="mt-3 py-8 text-center text-sm text-slate-500">
            No upcoming exams scheduled.
          </Card>
        ) : (
          <ul className="mt-3 space-y-4">
            {UPCOMING.map((exam) => (
              <Card key={exam.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {exam.course}
                  </p>
                  <h3 className="mt-1 font-semibold text-slate-900">{exam.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDate(exam.date)} at {exam.time} · {exam.durationMinutes} min
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/student/exams/check?examId=${encodeURIComponent(exam.id)}`}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    System check
                  </Link>
                  <Link
                    href={`/student/exams/check?examId=${encodeURIComponent(exam.id)}`}
                    className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
                  >
                    Start exam
                  </Link>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </section>

      {/* Past results */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Past results</h2>
        {PAST_RESULTS.length === 0 ? (
          <Card className="mt-3 py-8 text-center text-sm text-slate-500">
            No past results yet.
          </Card>
        ) : (
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Exam</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Course</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-700">Score</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-700">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PAST_RESULTS.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.title}</td>
                    <td className="px-4 py-3 text-slate-600">{r.course}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(r.date)}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      {r.score}/{r.maxScore}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          r.passed
                            ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
                            : "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800"
                        }
                      >
                        {r.passed ? "Passed" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
