"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type FeedbackType = "course" | "exam" | "material";
type FeedbackStatus = "open" | "in_progress" | "resolved";

interface AqadFeedback {
  id: string;
  type: FeedbackType;
  title: string;
  comment: string;
  reviewerName: string;
  date: string;
  dateTs: number;
  resolvedAt?: string;
  resolvedAtTs?: number;
  taskId: string;
  courseName?: string;
  status: FeedbackStatus;
}

const FEEDBACK: AqadFeedback[] = [
  { id: "fb1", type: "course", title: "Lecture 5 video quality", comment: "Replace low-quality recording with HD version; ensure audio is clear.", reviewerName: "Dr. A. Quality", date: "Mar 5, 2026", dateTs: new Date("2026-03-05").getTime(), taskId: "ca1", courseName: "CS 210 - Data Structures", status: "open" },
  { id: "fb2", type: "course", title: "Quiz 2 typos", comment: "Correct spelling and numbering errors in Quiz 2 (Module 3).", reviewerName: "Dr. A. Quality", date: "Mar 6, 2026", dateTs: new Date("2026-03-06").getTime(), taskId: "ca2", courseName: "CS 440 - Machine Learning", status: "in_progress" },
  { id: "fb3", type: "course", title: "Lecture 3 audio", comment: "Audio clipping detected at 10:45. Re-record or re-upload with clear audio.", reviewerName: "Prof. B. Reviewer", date: "Mar 7, 2026", dateTs: new Date("2026-03-07").getTime(), taskId: "ca3", courseName: "CS 440 - Machine Learning", status: "open" },
  { id: "fb4", type: "material", title: "Outdated readings", comment: "Module 4 readings: replace 2018 sources with current editions.", reviewerName: "Dr. A. Quality", date: "Mar 4, 2026", dateTs: new Date("2026-03-04").getTime(), taskId: "ca4", courseName: "CS 350 - Database Systems", status: "open" },
  { id: "fb5", type: "course", title: "Learning outcomes", comment: "Define 5 measurable outcomes for Module 2; align with assessment.", reviewerName: "Prof. B. Reviewer", date: "Mar 2, 2026", dateTs: new Date("2026-03-02").getTime(), resolvedAt: "Mar 6, 2026", resolvedAtTs: new Date("2026-03-06").getTime(), taskId: "ca5", courseName: "RES 301 - Research Methods", status: "resolved" },
  { id: "fb6", type: "exam", title: "Midterm proctoring clarity", comment: "Add explicit instructions for webcam placement and allowed materials.", reviewerName: "Dr. A. Quality", date: "Mar 1, 2026", dateTs: new Date("2026-03-01").getTime(), resolvedAt: "Mar 4, 2026", resolvedAtTs: new Date("2026-03-04").getTime(), taskId: "ca6", courseName: "CS 440 - Machine Learning", status: "resolved" },
];

function typeLabel(t: FeedbackType): string {
  switch (t) {
    case "course": return "Course";
    case "exam": return "Exam";
    case "material": return "Material";
    default: return "—";
  }
}

function statusStyles(s: FeedbackStatus): string {
  switch (s) {
    case "open": return "bg-amber-100 text-amber-800";
    case "in_progress": return "bg-sky-100 text-sky-800";
    case "resolved": return "bg-emerald-100 text-emerald-800";
    default: return "bg-slate-100 text-slate-600";
  }
}

function formatStatus(s: FeedbackStatus): string {
  switch (s) {
    case "open": return "Open";
    case "in_progress": return "In progress";
    case "resolved": return "Resolved";
    default: return s;
  }
}

function daysBetween(startTs: number, endTs: number): number {
  return Math.round((endTs - startTs) / (24 * 60 * 60 * 1000));
}

export default function AqadFeedbackPage() {
  const [typeFilter, setTypeFilter] = React.useState<FeedbackType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<FeedbackStatus | "all">("all");

  const filtered = FEEDBACK.filter((f) => {
    if (typeFilter !== "all" && f.type !== typeFilter) return false;
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    return true;
  });

  const resolved = FEEDBACK.filter((f) => f.status === "resolved" && f.resolvedAtTs && f.dateTs);
  const fixedCount = resolved.length;
  const avgResolutionDays = resolved.length > 0
    ? Math.round(
        resolved.reduce((sum, f) => sum + daysBetween(f.dateTs, f.resolvedAtTs ?? f.dateTs), 0) / resolved.length,
      )
    : 0;

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher" className="text-xs font-medium text-teal-600 hover:underline">
          ← Teacher Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          AQAD Feedback
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Quality review comments on courses, exams, and materials. Resolve via Corrective Actions.
        </p>
      </section>

      {/* Resolution history */}
      <Card className="rounded-lg border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Resolution history</h3>
        <p className="mt-0.5 text-xs text-slate-500">Quality issues fixed and turnaround time</p>
        <div className="mt-4 flex flex-wrap gap-6">
          <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-3 shadow-sm">
            <span className="text-3xl font-bold text-emerald-600">{fixedCount}</span>
            <div>
              <p className="text-sm font-medium text-slate-900">Issues resolved</p>
              <p className="text-xs text-slate-500">Total quality issues fixed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-3 shadow-sm">
            <span className="text-3xl font-bold text-teal-600">{avgResolutionDays}</span>
            <div>
              <p className="text-sm font-medium text-slate-900">Avg resolution time</p>
              <p className="text-xs text-slate-500">Days from feedback to fix</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-3 shadow-sm">
            <span className="text-3xl font-bold text-amber-600">{FEEDBACK.filter((f) => f.status !== "resolved").length}</span>
            <div>
              <p className="text-sm font-medium text-slate-900">Pending</p>
              <p className="text-xs text-slate-500">Open or in progress</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="rounded-lg border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-medium text-slate-600">Filter:</span>
          <div className="flex flex-wrap gap-2">
            {(["all", "course", "exam", "material"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  typeFilter === t ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {t === "all" ? "All types" : typeLabel(t)}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex flex-wrap gap-2">
            {(["all", "open", "in_progress", "resolved"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  statusFilter === s ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {s === "all" ? "All statuses" : formatStatus(s)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Feedback feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Feedback feed</h2>
          <Link href="/teacher/aqad-tasks" className="text-xs font-medium text-teal-600 hover:underline">
            Corrective Actions →
          </Link>
        </div>

        {filtered.length === 0 ? (
          <Card className="rounded-lg border-slate-200 p-12 text-center">
            <p className="text-sm text-slate-600">No feedback matches your filters.</p>
          </Card>
        ) : (
          <ul className="space-y-4">
            {filtered.map((f) => (
              <li key={f.id}>
                <Card className="rounded-lg border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                          {typeLabel(f.type)}
                        </span>
                        <span className={cn("rounded px-2 py-0.5 text-xs font-semibold", statusStyles(f.status))}>
                          {formatStatus(f.status)}
                        </span>
                        {f.courseName && (
                          <span className="text-xs text-slate-500">{f.courseName}</span>
                        )}
                      </div>
                      <h3 className="mt-2 font-semibold text-slate-900">{f.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{f.comment}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {f.reviewerName} · {f.date}
                        {f.resolvedAt && (
                          <span className="text-emerald-600"> · Resolved {f.resolvedAt}</span>
                        )}
                      </p>
                    </div>
                    <Link href={`/teacher/aqad-tasks?task=${f.taskId}`}>
                      <span className="inline-flex items-center rounded-md border border-teal-600 bg-white px-3 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50">
                        View corrective action →
                      </span>
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
