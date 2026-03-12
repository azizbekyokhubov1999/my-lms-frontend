"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../../components/ui/Button";
import { Card } from "../../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STUDENT_NAMES: Record<string, string> = {
  st3: "Sam Chen",
  st6: "Casey Brown",
  st7: "Taylor Wong",
  st8: "Jamie Park",
};

interface OpenEndedQuestion {
  id: string;
  questionNum: number;
  question: string;
  maxPoints: number;
  answer: string;
  startTime: string;
  endTime: string;
  points?: number;
}

interface ProctoringFlag {
  time: string;
  event: string;
  severity: "info" | "warning" | "flag";
}

const OPEN_ENDED_QUESTIONS: Record<string, OpenEndedQuestion[]> = {
  st3: [
    { id: "q2", questionNum: 2, question: "Explain the difference between stack and queue.", maxPoints: 10, answer: "Stack is LIFO, queue is FIFO. Stack uses push/pop, queue uses enqueue/dequeue.", startTime: "2:12 PM", endTime: "2:22 PM" },
  ],
  st8: [
    { id: "q2", questionNum: 2, question: "Explain the difference between stack and queue.", maxPoints: 10, answer: "Stack is last in first out. Queue is first in first out.", startTime: "2:15 PM", endTime: "2:25 PM" },
  ],
  st7: [
    { id: "q2", questionNum: 2, question: "Explain the difference between stack and queue.", maxPoints: 10, answer: "Stack: LIFO - push adds to top, pop removes from top. Queue: FIFO - enqueue adds to back, dequeue removes from front.", startTime: "2:05 PM", endTime: "2:18 PM" },
  ],
  st6: [
    { id: "q2", questionNum: 2, question: "Explain the difference between stack and queue.", maxPoints: 10, answer: "Stack uses LIFO and queue uses FIFO. Both are linear data structures.", startTime: "2:20 PM", endTime: "2:35 PM" },
  ],
};

const PROCTORING_BY_STUDENT: Record<string, ProctoringFlag[]> = {
  st3: [
    { time: "2:00:15 PM", event: "Exam started", severity: "info" },
    { time: "2:12:30 PM", event: "Face detected", severity: "info" },
    { time: "2:16:45 PM", event: "Brief gaze away from screen", severity: "warning" },
    { time: "2:22:10 PM", event: "Face detected", severity: "info" },
    { time: "2:58:45 PM", event: "Exam submitted", severity: "info" },
  ],
  st8: [
    { time: "2:02:00 PM", event: "Exam started", severity: "info" },
    { time: "2:18:22 PM", event: "Second face detected in frame", severity: "flag" },
    { time: "2:25:00 PM", event: "Face detected", severity: "info" },
  ],
  st7: [],
  st6: [
    { time: "2:05:00 PM", event: "Exam started", severity: "info" },
    { time: "2:28:15 PM", event: "Extended gaze away from screen", severity: "warning" },
  ],
};

function flagsDuringAnswer(flags: ProctoringFlag[], startTime: string, endTime: string): ProctoringFlag[] {
  const parse = (t: string) => {
    const [h, m, s] = t.replace(/ AM| PM/, "").split(":").map(Number);
    const isPM = t.includes("PM");
    return (isPM && h !== 12 ? h + 12 : h) * 3600 + (m || 0) * 60 + (s || 0);
  };
  const start = parse(startTime);
  const end = parse(endTime);
  return flags.filter((f) => {
    const ft = parse(f.time);
    return ft >= start - 60 && ft <= end + 60;
  });
}

export default function ExamManualGradePage() {
  const params = useParams();
  const examId = (params?.id as string) ?? "";
  const studentId = (params?.studentId as string) ?? "";

  const studentName = STUDENT_NAMES[studentId] ?? "Student";
  const questions = OPEN_ENDED_QUESTIONS[studentId] ?? [];
  const allFlags = PROCTORING_BY_STUDENT[studentId] ?? [];

  const [points, setPoints] = React.useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    questions.forEach((q) => { init[q.id] = 0; });
    return init;
  });
  const [posted, setPosted] = React.useState(false);

  const totalMax = questions.reduce((s, q) => s + q.maxPoints, 0);
  const totalEarned = questions.reduce((s, q) => s + (points[q.id] ?? 0), 0);

  const handlePost = () => setPosted(true);

  return (
    <div className="space-y-6">
      <section>
        <Link href={`/teacher/exams/${examId}/grade`} className="text-xs font-medium text-teal-600 hover:underline">
          ← Grading queue
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          {studentName}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Grade open-ended responses. Review proctoring flags during each answer period.
        </p>
      </section>

      <div className="space-y-6">
        {questions.map((q) => {
          const flags = flagsDuringAnswer(allFlags, q.startTime, q.endTime);
          return (
            <Card key={q.id} className="rounded-lg border-slate-200 p-4">
              <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Student response */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Q{q.questionNum}: {q.question}</h3>
                  <p className="mt-1 text-xs text-slate-500">Answered {q.startTime} – {q.endTime}</p>
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                    <p className="whitespace-pre-wrap text-sm text-slate-800">{q.answer}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700">Points</label>
                    <input
                      type="number"
                      min={0}
                      max={q.maxPoints}
                      value={points[q.id] ?? 0}
                      onChange={(e) => setPoints((prev) => ({ ...prev, [q.id]: Math.min(q.maxPoints, Math.max(0, parseInt(e.target.value, 10) || 0)) }))}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
                    />
                    <span className="text-slate-500">/ {q.maxPoints}</span>
                  </div>
                </div>

                {/* Proctoring flags during this answer */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Proctoring flags</h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">During {q.startTime} – {q.endTime}</p>
                  {flags.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-500">No flags during this period.</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {flags.map((f, i) => (
                        <li
                          key={i}
                          className={cn(
                            "flex items-start gap-2 rounded-md border px-3 py-2",
                            f.severity === "flag" && "border-red-200 bg-red-50",
                            f.severity === "warning" && "border-amber-200 bg-amber-50/50",
                            f.severity === "info" && "border-slate-200 bg-slate-50/50",
                          )}
                        >
                          <span className="shrink-0 text-[11px] text-slate-500">{f.time}</span>
                          <span className="text-sm text-slate-700">{f.event}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-lg border-teal-200 bg-teal-50/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Total: {totalEarned} / {totalMax}</p>
            <p className="text-xs text-slate-600">Open-ended portion only</p>
          </div>
          <Button
            type="button"
            variant="primary"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={handlePost}
            disabled={posted}
          >
            {posted ? "Posted ✓" : "Post grade"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
