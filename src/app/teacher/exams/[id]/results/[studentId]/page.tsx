"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STUDENT_NAMES: Record<string, string> = {
  st1: "Alex Johnson",
  st2: "Jordan Lee",
  st3: "Sam Chen",
  st4: "Riley Davis",
  st5: "Morgan Kim",
  st6: "Casey Brown",
  st7: "Taylor Wong",
  st8: "Jamie Park",
};

interface AnswerRow {
  questionNum: number;
  question: string;
  type: "mc" | "open";
  answer: string;
  correct?: boolean;
  points: number;
  maxPoints: number;
}

interface ProctoringLog {
  time: string;
  event: string;
  severity: "info" | "warning" | "flag";
}

const MOCK_ANSWERS: AnswerRow[] = [
  { questionNum: 1, question: "What is the time complexity of BFS?", type: "mc", answer: "O(V + E)", correct: true, points: 10, maxPoints: 10 },
  { questionNum: 2, question: "Explain the difference between stack and queue.", type: "open", answer: "Stack is LIFO, queue is FIFO. Stack uses push/pop, queue uses enqueue/dequeue.", points: 8, maxPoints: 10 },
  { questionNum: 3, question: "Which data structure uses LIFO?", type: "mc", answer: "Stack", correct: true, points: 5, maxPoints: 5 },
];

const MOCK_PROCTORING: ProctoringLog[] = [
  { time: "2:00:15 PM", event: "Exam started", severity: "info" },
  { time: "2:12:30 PM", event: "Face detected", severity: "info" },
  { time: "2:35:22 PM", event: "Brief gaze away from screen", severity: "warning" },
  { time: "2:58:45 PM", event: "Exam submitted", severity: "info" },
];

export default function ExamResultDetailPage() {
  const params = useParams();
  const examId = (params?.id as string) ?? "";
  const studentId = (params?.studentId as string) ?? "";

  const studentName = STUDENT_NAMES[studentId] ?? "Student";

  const totalPoints = MOCK_ANSWERS.reduce((s, a) => s + a.points, 0);
  const maxPoints = MOCK_ANSWERS.reduce((s, a) => s + a.maxPoints, 0);
  const scorePct = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  return (
    <div className="space-y-6">
      <section>
        <Link href={`/teacher/exams/${examId}/results`} className="text-xs font-medium text-teal-600 hover:underline">
          ← Back to results
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          {studentName}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Answer sheet & proctoring logs
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          Score: {totalPoints} / {maxPoints} ({scorePct}%)
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Answer sheet */}
        <Card className="rounded-lg border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Answer sheet</h3>
          <p className="mt-0.5 text-xs text-slate-500">Student responses by question</p>
          <ul className="mt-4 space-y-4">
            {MOCK_ANSWERS.map((a) => (
              <li key={a.questionNum} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500">Q{a.questionNum}</p>
                    <p className="mt-1 font-medium text-slate-900">{a.question}</p>
                    <p className="mt-2 text-sm text-slate-700">{a.answer}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-semibold text-slate-900">{a.points} / {a.maxPoints}</span>
                    {a.correct != null && (
                      <span className={cn("ml-1 text-xs", a.correct ? "text-emerald-600" : "text-amber-600")}>
                        {a.correct ? "✓" : "—"}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Proctoring logs */}
        <Card className="rounded-lg border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Proctoring logs</h3>
          <p className="mt-0.5 text-xs text-slate-500">AI and session events</p>
          <ul className="mt-4 space-y-2">
            {MOCK_PROCTORING.map((log, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-start gap-3 rounded-md border px-3 py-2",
                  log.severity === "flag" && "border-red-200 bg-red-50",
                  log.severity === "warning" && "border-amber-200 bg-amber-50/50",
                  log.severity === "info" && "border-slate-200 bg-slate-50/50",
                )}
              >
                <span className="shrink-0 text-xs text-slate-500">{log.time}</span>
                <span className="text-sm text-slate-700">{log.event}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
