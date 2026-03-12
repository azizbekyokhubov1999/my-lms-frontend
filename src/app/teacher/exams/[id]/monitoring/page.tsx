"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AiFlag {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
}

const MOCK_STUDENTS = [
  { id: "st1", name: "Alex Johnson", flagged: false },
  { id: "st2", name: "Jordan Lee", flagged: true },
  { id: "st3", name: "Sam Chen", flagged: false },
  { id: "st4", name: "Riley Davis", flagged: true },
  { id: "st5", name: "Morgan Kim", flagged: false },
  { id: "st6", name: "Casey Brown", flagged: false },
  { id: "st7", name: "Taylor Wong", flagged: false },
  { id: "st8", name: "Jamie Park", flagged: false },
];

const AI_FLAGS: AiFlag[] = [
  { id: "f1", studentId: "st2", studentName: "Jordan Lee", timestamp: "2m ago", type: "Head movement", severity: "medium", description: "Repeated head turn detected; possible second monitor" },
  { id: "f2", studentId: "st4", studentName: "Riley Davis", timestamp: "5m ago", type: "Multiple faces", severity: "high", description: "Second person detected in frame" },
  { id: "f3", studentId: "st2", studentName: "Jordan Lee", timestamp: "8m ago", type: "Eyes off screen", severity: "low", description: "Extended gaze away from screen (5s)" },
];

function severityStyles(s: AiFlag["severity"]) {
  switch (s) {
    case "high": return "border-red-300 bg-red-50 text-red-900";
    case "medium": return "border-amber-300 bg-amber-50 text-amber-900";
    case "low": return "border-slate-200 bg-slate-50 text-slate-700";
    default: return "border-slate-200 bg-slate-50";
  }
}

export default function ExamMonitoringPage() {
  const params = useParams();
  const examId = params.id as string;
  const [selectedStudent, setSelectedStudent] = React.useState<string | null>(null);

  const examTitle = "Module 1 Quiz";
  const examCourse = "CS 210 - Data Structures";

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4 overflow-hidden lg:flex-row">
      {/* Main: Webcam grid */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Live monitoring
            </h1>
            <p className="text-sm text-slate-600">
              {examCourse} · {examTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <Link href="/teacher/exams">
              <Button type="button" variant="secondary" size="sm">
                ← Back to exams
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {MOCK_STUDENTS.map((s) => {
              const isSelected = selectedStudent === s.id;
              const flagsForStudent = AI_FLAGS.filter((f) => f.studentId === s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStudent(isSelected ? null : s.id)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-lg border-2 bg-slate-900 transition-all",
                    isSelected ? "border-teal-500 ring-2 ring-teal-500/30" : "border-slate-700 hover:border-slate-600",
                  )}
                >
                  {/* Webcam placeholder */}
                  <div className="aspect-video w-full bg-slate-800 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-2xl font-bold text-slate-400">
                      {s.name.charAt(0)}
                    </div>
                  </div>
                  {flagsForStudent.length > 0 && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {flagsForStudent.length}
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-2 bg-slate-800 px-3 py-2">
                    <span className="truncate text-xs font-medium text-slate-200">{s.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar: AI Flags */}
      <Card className="flex w-full shrink-0 flex-col border-slate-200 p-0 lg:w-96">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">AI flags</h3>
          <p className="text-xs text-slate-500">
            Suspicious behavior alerts from proctoring system
          </p>
          <p className="mt-1 text-xs font-medium text-red-600">
            {AI_FLAGS.length} alert{AI_FLAGS.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {AI_FLAGS.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No alerts</p>
          ) : (
            <ul className="space-y-3">
              {AI_FLAGS.map((flag) => (
                <li
                  key={flag.id}
                  className={cn(
                    "cursor-pointer rounded-lg border p-3 transition-colors hover:opacity-90",
                    severityStyles(flag.severity),
                    selectedStudent === flag.studentId && "ring-2 ring-teal-500",
                  )}
                  onClick={() => setSelectedStudent(flag.studentId)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900">{flag.studentName}</p>
                      <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-600">
                        {flag.type}
                      </p>
                      <p className="mt-1 text-xs text-slate-700">{flag.description}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-500">{flag.timestamp}</span>
                  </div>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                      flag.severity === "high" && "bg-red-200 text-red-900",
                      flag.severity === "medium" && "bg-amber-200 text-amber-900",
                      flag.severity === "low" && "bg-slate-200 text-slate-600",
                    )}
                  >
                    {flag.severity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
