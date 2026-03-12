"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  courseName: string;
  submittedAt: string;
  isMcOnly: boolean;
  autoScore: number | null;
  maxScore: number;
  overrideScore: number | null;
  needsManualGrade: boolean;
}

const SUBMISSIONS: QuizSubmission[] = [
  { id: "qs1", quizId: "qz1", quizTitle: "Module 1: Foundations", studentId: "st1", studentName: "Alex Johnson", courseName: "CS 440", submittedAt: "Mar 6, 2026", isMcOnly: true, autoScore: 85, maxScore: 100, overrideScore: null, needsManualGrade: false },
  { id: "qs2", quizId: "qz1", quizTitle: "Module 1: Foundations", studentId: "st2", studentName: "Jordan Lee", courseName: "CS 440", submittedAt: "Mar 6, 2026", isMcOnly: true, autoScore: 92, maxScore: 100, overrideScore: null, needsManualGrade: false },
  { id: "qs3", quizId: "qz2", quizTitle: "Data Types Quiz", studentId: "st3", studentName: "Sam Chen", courseName: "CS 210", submittedAt: "Mar 5, 2026", isMcOnly: true, autoScore: 78, maxScore: 100, overrideScore: 82, needsManualGrade: false },
  { id: "qs4", quizId: "qz3", quizTitle: "Research Basics", studentId: "st5", studentName: "Morgan Kim", courseName: "RES 301", submittedAt: "Mar 4, 2026", isMcOnly: false, autoScore: 60, maxScore: 100, overrideScore: null, needsManualGrade: true },
];

export default function QuizGradePage() {
  const [submissions, setSubmissions] = React.useState<QuizSubmission[]>(SUBMISSIONS);

  const handleOverride = (id: string, score: number) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, overrideScore: score } : s)),
    );
  };

  const displayScore = (s: QuizSubmission) => s.overrideScore ?? s.autoScore ?? 0;

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/quizzes" className="text-xs font-medium text-teal-600 hover:underline">
          ← Quizzes
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Quiz grading
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          MC-only quizzes are auto-graded. Override any score or grade short-answer questions manually.
        </p>
      </section>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Quiz · Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Score</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{s.quizTitle}</p>
                    <p className="text-xs text-slate-500">{s.studentName} · {s.courseName} · {s.submittedAt}</p>
                  </td>
                  <td className="px-4 py-3">
                    {s.isMcOnly ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                        Auto-graded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        Manual
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-900">{displayScore(s)} / {s.maxScore}</span>
                    {s.overrideScore != null && (
                      <span className="ml-1 text-[10px] text-slate-500">(override)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <OverrideButton
                      submission={s}
                      onOverride={(score) => handleOverride(s.id, score)}
                    />
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

function OverrideButton({ submission, onOverride }: { submission: QuizSubmission; onOverride: (score: number) => void }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(String(submission.overrideScore ?? submission.autoScore ?? 0));

  const handleApply = () => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0 && n <= submission.maxScore) {
      onOverride(n);
      setOpen(false);
    }
  };

  return (
    <div className="flex justify-end">
      {open ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={submission.maxScore}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-16 rounded border border-slate-300 px-2 py-1 text-sm"
          />
          <Button type="button" variant="primary" size="sm" className="bg-teal-600" onClick={handleApply}>
            Apply
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Override
        </Button>
      )}
    </div>
  );
}
